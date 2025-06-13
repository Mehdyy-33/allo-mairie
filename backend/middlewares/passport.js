// src/middlewares/passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// --- Vérification des secrets/env variables ---
const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error("JWT_SECRET non défini !");
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
  throw new Error(
    "Variables d'environnement Google OAuth manquantes (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL)"
  );
}

// ——————————————————————————————————————————
// 1) Sérialisation / désérialisation (pour sessions, si utilisées)
// ——————————————————————————————————————————
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// ——————————————————————————————————————————
// 2) Stratégie JWT
//    Permet de protéger les routes avec : 
//      passport.authenticate('jwt', { session: false })
// ——————————————————————————————————————————
passport.use(
  'jwt',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET,
    },
    async (payload, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { id: payload.id } });
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// ——————————————————————————————————————————
// 3) Stratégie Google OAuth
//    Pour login via Google et création/utilisateur
// ——————————————————————————————————————————
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          // Premier login Google → création d'un nouvel utilisateur
          user = await prisma.user.create({
            data: {
              email,
              password: 'google-oauth',  // placeholder, ne sert pas en login OAuth
              googleId: profile.id,
              nom: profile.displayName,
              isComplete: false,
            },
          });
        } else {
          // Utilisateur existant → mise à jour si nécessaire
          const updates = {};
          if (!user.googleId)      updates.googleId = profile.id;
          if (!user.nom)           updates.nom = profile.displayName;
          if (user.isComplete === false) updates.isComplete = true;

          if (Object.keys(updates).length > 0) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: updates,
            });
          }
        }

        // Génération du JWT pour le front
        const token = jwt.sign(
          { id: user.id, email: user.email, communeId: user.communeId ?? null },
          SECRET,
          { expiresIn: '1h' }
        );

        // On passe l'utilisateur + token à la suite
        return done(null, { ...user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;

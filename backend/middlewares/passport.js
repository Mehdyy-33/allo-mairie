const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'citoyen-secret';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;

      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            password: 'google-oauth',
            isComplete: false, // 👈 utilisateur incomplet
          },
        });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
        expiresIn: '1h',
      });

      // 👇 Fournit le token et le flag isComplete pour décider dans la route de redirection
      return done(null, { ...user, token });
    }
  )
);

module.exports = passport;

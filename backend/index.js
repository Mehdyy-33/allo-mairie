// index.js

// 0) Attraper les erreurs silencieuses
process.on('unhandledRejection', (reason, promise) => {
  console.error('🔴 Unhandled Rejection à:', promise, 'raison :', reason);
});
process.on('uncaughtException', (err) => {
  console.error('🔴 Uncaught Exception :', err);
});

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');
const passport = require('./middlewares/passport');
const helmet = require('helmet');
const path = require('path');

dotenv.config();
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET non défini !");

const app = express();
const prisma = new PrismaClient();

// ─── Import des routes ──────────────────────────────────────────────────
const requestRoutes     = require('./routes/requestRoutes');
const authRoutes        = require('./routes/authRoutes');
const communeRoutes     = require('./routes/communeRoutes');
const userRoutes        = require('./routes/userRoutes');
const adminCitiesRouter      = require('./routes/admin/cities');
const adminInvitationsRouter = require('./routes/admin/invitations');

// ─── Middlewares de sécurité / parsing ─────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Statique « uploads » ───────────────────────────────────────────────
app.use(
  '/api/uploads',
  (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(path.join(__dirname, 'uploads'))
);

// ─── Redirection HTTPS (prod uniquement) ────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}

// ─── Configuration de la session (cookies) ──────────────────────────────
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,
    }
  })
);

// ─── Passport (pour OAuth / JWT) ─────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ─── Route Ping (test simple) ────────────────────────────────────────────
app.get('/api/ping', (req, res) => {
  res.send({ message: 'API OK ✅' });
});

// ─── Montage des routes publiques ───────────────────────────────────────
app.use('/api/requests',  requestRoutes);
app.use('/api/auth',      authRoutes);
app.use('/api',           communeRoutes);
app.use('/api/user',      userRoutes);

// ─── Administration des villes (JWT protégé) ───────────────────────────
app.use(
  '/api/admin/cities',
  passport.authenticate('jwt', { session: false }),
  adminCitiesRouter
);

// ─── Invitations d’admin (routes publiques pour GET/POST token) ────────
app.use(
  '/api/admin/invitations',
  adminInvitationsRouter
);

// ─── Debug : logs juste avant d’écouter le port ─────────────────────────
console.log('--- POINT A : Tous les middlewares et routes sont montés ---');
console.log('--- POINT B : Avant app.listen ---');

// ─── Lancement du serveur ───────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend lancé sur http://localhost:${PORT}`);
});

// Ce log n’apparaîtra jamais, car app.listen ne rend pas la main tant qu’on n’a pas Ctrl+C
console.log('--- POINT C : Après app.listen (ce message ne devrait pas s’afficher) ---');

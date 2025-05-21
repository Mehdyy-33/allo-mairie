const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');
const passport = require('./middlewares/passport');
const helmet = require('helmet'); // ✅ Ajouté pour la sécurité

dotenv.config();
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET non défini !"); // ✅ Obligation du secret

const app = express();
const prisma = new PrismaClient();

// 📦 Import des routes
const requestRoutes = require('./routes/requestRoutes');
const authRoutes = require('./routes/authRoutes');

// 🔐 Middlewares de sécurité
app.use(helmet()); // ✅ Headers de sécurité
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Redirection vers HTTPS en production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,          // ✅ empêche accès JS
      secure: process.env.NODE_ENV === 'production', // ✅ HTTPS seulement en prod
      sameSite: 'lax',         // ✅ protège contre CSRF simples
      maxAge: 1000 * 60 * 60,  // 1h
    }
  })
);


app.use(passport.initialize());
app.use(passport.session());

// 🔁 Ping API
app.get('/api/ping', (req, res) => {
  res.send({ message: 'API OK ✅' });
});

// 🚏 Routes
app.use('/api/requests', requestRoutes);
app.use('/api/auth', authRoutes);

// 🚀 Lancement serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend lancé sur http://localhost:${PORT}`);
});
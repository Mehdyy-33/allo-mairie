const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');
const passport = require('./middlewares/passport');
const helmet = require('helmet');
const communeRoutes = require('./routes/communeRoutes');

dotenv.config();
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET non défini !");

const app = express();
const prisma = new PrismaClient();

// 📦 Import des routes
const requestRoutes = require('./routes/requestRoutes');
const authRoutes = require('./routes/authRoutes');

// 🔐 Middlewares de sécurité
app.use(helmet());
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
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,
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
app.use('/api', communeRoutes); // ✅ Ajout de la route des communes

// 🚀 Lancement serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend lancé sur http://localhost:${PORT}`);
});

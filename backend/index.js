const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();
const app = express();
const prisma = new PrismaClient();

// 📦 Import des routes
const requestRoutes = require('./routes/requestRoutes');
const authRoutes = require('./routes/authRoutes'); // 👈 route auth ajoutée
const session = require('express-session')
const passport = require('./middlewares/passport')

// 🔐 Middlewares
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET || 'citoyen-secret',
    resave: false,
    saveUninitialized: false,
  })
)
app.use(passport.initialize())
app.use(passport.session())

// 🚏 Routes
app.use('/api/requests', requestRoutes);
app.use('/api/auth', authRoutes); // 👈 point d'entrée /api/auth/login et /register

// 🚀 Lancement serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend lancé sur http://localhost:${PORT}`);
});

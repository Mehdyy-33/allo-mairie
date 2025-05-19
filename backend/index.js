const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');
const passport = require('./middlewares/passport');

dotenv.config();
const app = express();
const prisma = new PrismaClient();

// 📦 Import des routes
const requestRoutes = require('./routes/requestRoutes');
const authRoutes = require('./routes/authRoutes');

// 🔐 Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // autoriser le front Vite
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.JWT_SECRET || 'citoyen-secret',
    resave: false,
    saveUninitialized: false,
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

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const passport = require('passport');
const authenticateToken = require('../middlewares/authenticateToken');
const { z } = require('zod');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const prisma = new PrismaClient();

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET non défini !");
const SECRET = process.env.JWT_SECRET;

// ✅ Limiteur de connexion pour éviter brute-force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Trop de tentatives. Réessayez dans quelques minutes.'
});

// ✅ Schéma de validation avec zod
const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Mot de passe trop court (min. 8 caractères)")
});

// ✅ Route d'inscription sécurisée
router.post('/register', async (req, res) => {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Email ou mot de passe invalide.' });
  }

  const { email, password } = parsed.data;

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed },
    });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    if (err.code === 'P2002') {
      res.status(400).json({ error: 'Email déjà utilisé.' });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  }
});

// ✅ Route de login sécurisée avec limiteur + validation
router.post('/login', loginLimiter, async (req, res) => {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Email ou mot de passe invalide.' });
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Utilisateur non trouvé' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Mot de passe invalide' });

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// ✅ Route protégée (profil utilisateur connecté)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true }
    });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Auth Google
router.get('/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  (req, res) => {
    const token = req.user.token;
    console.log('redirecting to dashboard')
res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);

module.exports = router;


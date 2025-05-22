const express = require('express');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const authenticateToken = require('../middlewares/authenticateToken');
const { PrismaClient } = require('@prisma/client'); // ✅ Ajouté ici
const prisma = new PrismaClient(); // ✅ Initialisé ici

const { register, login } = require('../controllers/authController');

const router = express.Router();

// ✅ Limiteur anti-brute-force pour le login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Trop de tentatives. Réessayez dans quelques minutes.'
});

// ✅ Routes d'authentification
router.post('/register', register);
router.post('/login', loginLimiter, login);

// ✅ Route protégée pour récupérer l'utilisateur connecté
router.get('/me', authenticateToken, async (req, res) => {
  try {
    console.log('🔍 ID utilisateur:', req.user.id);

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, prenom: true }
    });

    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ Auth Google (inchangé)
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

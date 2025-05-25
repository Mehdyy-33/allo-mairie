const express = require('express');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const authenticateToken = require('../middlewares/authenticateToken');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const prisma = new PrismaClient();
const { register, login } = require('../controllers/authController');

const router = express.Router();

// ✅ Limiteur anti-brute-force pour le login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Trop de tentatives. Réessayez dans quelques minutes.'
});

// ✅ Routes d'authentification
router.post('/register', register);
router.post('/login', loginLimiter, login);

// ✅ Récupérer l'utilisateur connecté avec authProvider
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        prenom: true,
          nom: true,
        isComplete: true,
        googleId: true // pour savoir si OAuth
      }
    });

    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    res.json({
      ...user,
      authProvider: user.googleId ? 'google' : 'local'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ Route pour compléter le profil Google après connexion
const completeProfileSchema = z.object({
  nom: z.string().min(1),
  prenom: z.string().min(1),
  communeId: z.number()
});

router.patch('/complete-profile', authenticateToken, async (req, res) => {
  const parsed = completeProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Champs invalides ou manquants.' });
  }

  const { nom, prenom, communeId } = parsed.data;

  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        nom,
        prenom,
        communeId,
        isComplete: true
      }
    });

    res.json({ message: '✅ Profil complété', user });
  } catch (err) {
    console.error('❌ Erreur profil:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour.' });
  }
});

// ✅ Auth Google
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

    if (!req.user.isComplete) {
      return res.redirect(`http://localhost:5173/completer-profil?token=${token}`);
    }

    return res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);

module.exports = router;

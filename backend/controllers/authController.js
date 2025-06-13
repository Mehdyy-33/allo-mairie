// src/controllers/authController.js

const { PrismaClient } = require('@prisma/client');
const bcrypt          = require('bcrypt');
const jwt             = require('jsonwebtoken');
const { z }           = require('zod');

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'citoyen-secret';

// Schéma d'inscription : nom, prenom et communeId sont maintenant facultatifs
const registerSchema = z.object({
  email:     z.string().email(),
  password:  z.string().min(8, "Mot de passe trop court"),
  nom:       z.string().min(1, "Nom requis").optional(),
  prenom:    z.string().min(1, "Prénom requis").optional(),
  communeId: z.number().int().positive("Commune invalide").optional(),
});

exports.register = async (req, res) => {
  // 1) validation du payload
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error:   'Champs invalides.',
      details: parsed.error.errors.map(err => ({
        path: err.path,
        message: err.message
      }))
    });
  }
  const { email, password, nom, prenom, communeId } = parsed.data;

  try {
    // 2) pas de doublon d'email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email déjà utilisé.' });
    }

    // 3) si on veut associer à une commune, on la vérifie
    if (communeId !== undefined) {
      const commune = await prisma.commune.findUnique({ where: { id: communeId } });
      if (!commune || !commune.active) {
        return res.status(400).json({ error: 'Commune non valide ou inactive.' });
      }
    }

    // 4) hash du mot de passe
    const hashed = await bcrypt.hash(password, 10);

    // 5) création de l'utilisateur (isAdmin false par défaut)
    const user = await prisma.user.create({
      data: {
        email,
        password:   hashed,
        nom:        nom ?? null,
        prenom:     prenom ?? null,
        isComplete: true,
        communeId:  communeId ?? null,
        isAdmin:    false
      },
    });

    // 6) signature du JWT, en incluant isAdmin
    const token = jwt.sign(
      {
        id:        user.id,
        email:     user.email,
        communeId: user.communeId ?? null,
        isAdmin:   user.isAdmin
      },
      SECRET,
      { expiresIn: '1h' }
    );

    return res.status(201).json({ token });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// Schéma de login
const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8)
});

exports.login = async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Email ou mot de passe invalide.' });
  }
  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Mot de passe invalide.' });
    }

    const token = jwt.sign(
      {
        id:        user.id,
        email:     user.email,
        communeId: user.communeId ?? null,
        isAdmin:   Boolean(user.isAdmin)
      },
      SECRET,
      { expiresIn: '1h' }
    );
    return res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// Facultatif : endpoint GET /auth/me pour renvoyer le profil complet
exports.getProfile = async (req, res) => {
  const { id, email, prenom, nom, communeId, isAdmin } = req.user;
  res.json({ id, email, prenom, nom, communeId, isAdmin });
};

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'citoyen-secret';

// ✅ Schéma d'inscription avec tous les champs
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Mot de passe trop court"),
  nom: z.string().min(1, "Nom requis"),
  prenom: z.string().min(1, "Prénom requis"),
  commune: z.string().min(1, "Commune requise")
});

const register = async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Champs invalides.', details: parsed.error.errors });
  }

  const { email, password, nom, prenom, commune } = parsed.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email déjà utilisé.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, nom, prenom, commune },
    });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ✅ Schéma de login simple
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const login = async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
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
};

module.exports = { register, login };

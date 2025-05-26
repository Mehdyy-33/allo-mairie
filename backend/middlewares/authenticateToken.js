const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SECRET = process.env.JWT_SECRET || 'citoyen-secret';

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  jwt.verify(token, SECRET, async (err, decodedUser) => {
    if (err) return res.status(403).json({ error: 'Token invalide' });

    // 🔁 Récupérer l'utilisateur complet (incluant communeId)
    const userInDb = await prisma.user.findUnique({
      where: { id: decodedUser.id },
    });

    if (!userInDb) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    req.user = userInDb;
    next();
  });
}

module.exports = authenticateToken;

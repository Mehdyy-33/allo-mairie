const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

const prisma = new PrismaClient();

// ✅ Route : Récupérer les communes actives
router.get('/communes', async (req, res) => {
  const search = req.query.search || '';
  try {
    const communes = await prisma.commune.findMany({
      where: {
        active: true,
        nom: {
          contains: search,
          mode: 'insensitive'
        }
      },
      select: { id: true, nom: true }
    });
    res.json(communes);
  } catch (err) {
    console.error('Erreur récupération communes :', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});


module.exports = router;

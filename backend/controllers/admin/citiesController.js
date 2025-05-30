// src/controllers/admin/citiesController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCities = async (req, res) => {
  try {
    const cities = await prisma.commune.findMany();
    res.json(cities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de récupérer les villes.' });
  }
};

exports.getCityById = async (req, res) => {
  const { cityId } = req.params;
  try {
    const city = await prisma.commune.findUnique({
      where: { id: Number(cityId) }
    });
    if (!city) return res.status(404).json({ error: 'Ville introuvable.' });
    res.json(city);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

exports.getUsersByCity = async (req, res) => {
  const { cityId } = req.params;
  try {
    const users = await prisma.user.findMany({
      where: { communeId: Number(cityId) },
      select: { id: true, prenom: true, nom: true, email: true }
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de récupérer les citoyens.' });
  }
};

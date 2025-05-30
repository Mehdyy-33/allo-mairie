const express = require('express');
const router = express.Router();
const controller = require('../controllers/requestController');
const authenticateToken = require('../middlewares/authenticateToken');
const passport = require('../middlewares/passport');  // Utilisation de Passport pour JWT auth
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const sanitizedOriginalName = file.originalname
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9.\-_]/g, '');
    const uniqueName = `${Date.now()}-${sanitizedOriginalName}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Téléchargement des fichiers
router.get(
  '/download/:filename',
  authenticateToken,
  (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).send('Fichier introuvable');
    }
  }
);

// Création d'une demande
router.post(
  '/',
  authenticateToken,
  upload.single('file'),
  controller.createRequest
);

// Récupération de toutes les demandes (publices)
router.get('/', controller.getAllRequests);

// Mise à jour du statut d'une demande
router.put('/:id/status', controller.updateStatus);

// Suppression d'une demande
router.delete('/:id', controller.deleteRequest);

// Demandes de l'utilisateur connecté
router.get(
  '/user',
  authenticateToken,
  controller.getRequestsByUser
);

// Fil d'actualité pour la commune de l'utilisateur (protégé)
router.get(
  '/commune',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const communeId = req.user.communeId;
      if (!communeId) {
        return res.status(403).json({ error: 'Non autorisé' });
      }
      const demandes = await prisma.request.findMany({
        where: { user: { communeId } },
        include: { user: true }
      });
      res.json(demandes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

// Récupération d'une demande par ID
router.get(
  '/:id',
  authenticateToken,
  controller.getRequestById
);

// Mise à jour d'une demande
router.put(
  '/:id',
  authenticateToken,
  upload.single('file'),
  controller.updateRequest
);

module.exports = router;

const express = require('express');
const router = express.Router();
const controller = require('../controllers/requestController');
const authenticateToken = require('../middlewares/authenticateToken');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    // 🔧 Nettoyage du nom de fichier
    const sanitizedOriginalName = file.originalname
      .normalize('NFD') // Enlève les accents
      .replace(/[\u0300-\u036f]/g, '') // Supprime les diacritiques
      .replace(/\s+/g, '-') // Remplace les espaces par des tirets
      .replace(/[^a-zA-Z0-9.\-_]/g, '') // Supprime les caractères spéciaux

    const uniqueName = `${Date.now()}-${sanitizedOriginalName}`;
    cb(null, uniqueName);
  }
});

const fs = require('fs');

router.get('/download/:filename', authenticateToken, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'uploads', filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath); // ✅ Force le téléchargement
  } else {
    res.status(404).send('Fichier introuvable');
  }
});

const upload = multer({ storage });

router.post(
  '/',
  authenticateToken,
  upload.single('file'),
  controller.createRequest
);

router.get('/', controller.getAllRequests);
router.put('/:id/status', controller.updateStatus);
router.delete('/:id', controller.deleteRequest);
router.get('/user', authenticateToken, controller.getRequestsByUser);

module.exports = router;

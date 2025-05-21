
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
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
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
router.put('/:id/status', controller.updateStatus); // ✅ Mise à jour
router.delete('/:id', controller.deleteRequest);    // ✅ Suppression
router.get('/user', authenticateToken, controller.getRequestsByUser); // ✅ Utilisateur connecté

module.exports = router;

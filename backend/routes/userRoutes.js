const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');

const { getCurrentUser } = userController; // ✅ extraction de la fonction

router.post('/change-password', authenticateToken, userController.changePassword);
router.patch('/update', authenticateToken, userController.updateProfile);
router.get('/me', authenticateToken, getCurrentUser); // ✅ route profil

module.exports = router;

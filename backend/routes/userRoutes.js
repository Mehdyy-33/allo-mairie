const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/change-password', authenticateToken, userController.changePassword);
router.patch('/update', authenticateToken, userController.updateProfile);

module.exports = router;

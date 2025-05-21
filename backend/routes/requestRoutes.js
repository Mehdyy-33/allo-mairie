
const express = require('express');
const router = express.Router();
const controller = require('../controllers/requestController');
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/', authenticateToken, controller.createRequest);
router.get('/', controller.getAllRequests);
router.put('/:id/status', controller.updateStatus); // ✅ Mise à jour
router.delete('/:id', controller.deleteRequest);    // ✅ Suppression
router.get('/user', authenticateToken, controller.getRequestsByUser); // ✅ Utilisateur connecté

module.exports = router;

const express = require('express');
const router = express.Router();
const controller = require('../controllers/requestController');

router.post('/', controller.createRequest);
router.get('/', controller.getAllRequests);
router.put('/:id/status', controller.updateStatus); // ✅ Mise à jour
router.delete('/:id', controller.deleteRequest);    // ✅ Suppression

module.exports = router;

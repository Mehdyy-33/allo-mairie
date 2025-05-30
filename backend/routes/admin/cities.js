// backend/routes/admin/cities.js
const express = require('express');
const router  = express.Router();
const {
  getCities,
  getCityById,
  getUsersByCity
} = require('../../controllers/admin/citiesController');

// 1) Liste des communes
//    → GET /api/admin/cities
router.get('/', getCities);

// 2) Détails d’une commune
//    → GET /api/admin/cities/:cityId
router.get('/:cityId', getCityById);

// 3) Citoyens d’une commune
//    → GET /api/admin/cities/:cityId/users
router.get('/:cityId/users', getUsersByCity);

module.exports = router;

// backend/routes/admin/invitations.js
const express  = require('express');
const router   = express.Router();
const passport = require('../../middlewares/passport');
const {
  inviteAdmin,
  getInvitation,
  activateAdmin
} = require('../../controllers/admin/invitationsController');

// 1) Création d’invitation
//    POST /api/admin/invitations
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  inviteAdmin
);

// 2) Consultation de l’invitation (public)
//    GET /api/admin/invitations/:token
router.get(
  '/:token',
  getInvitation
);

// 3) Activation du compte (public)
//    POST /api/admin/invitations/:token
router.post(
  '/:token',
  activateAdmin
);

module.exports = router;

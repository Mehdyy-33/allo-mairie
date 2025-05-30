// src/controllers/admin/invitationsController.js

const { PrismaClient } = require('@prisma/client');
const crypto           = require('crypto');
const sgMail           = require('@sendgrid/mail');

const prisma = new PrismaClient();

// Configure SendGrid avec ta clé API depuis .env
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.inviteAdmin = async (req, res) => {
  const { email, communeId } = req.body;
  if (!email || !communeId) {
    return res.status(400).json({ error: 'email et communeId requis' });
  }

  // vérifie que la commune existe et est active
  const commune = await prisma.commune.findUnique({ where: { id: Number(communeId) } });
  if (!commune || !commune.active) {
    return res.status(400).json({ error: 'Commune non valide ou inactive.' });
  }

  // génère un token unique + date d’expiration à 24h
  const token     = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  try {
    // 1) création de l’invitation en base
    const invitation = await prisma.invitation.create({
      data: { email, token, communeId: Number(communeId), expiresAt }
    });

    // 2) construction du lien d’activation
    const activationLink = `${process.env.FRONTEND_URL}/activate/${token}`;

    // 3) envoi de l’e-mail via SendGrid
    await sgMail.send({
      to:      email,
      from:    process.env.SENDGRID_FROM,  // ex: 'no-reply@citoyenplus.fr'
      subject: `Invitation admin mairie de ${commune.nom}`,
      text: `
Bonjour,

Vous êtes invité·e à devenir administrateur·rice de la mairie de ${commune.nom} sur Citoyen+.
Cliquez sur ce lien pour activer votre compte (lien valable 24 h) :
${activationLink}

Si vous n’avez pas demandé cette invitation, ignorez ce message.
      `.trim(),
      html: `
<p>Bonjour,</p>
<p>Vous êtes invité·e à devenir administrateur·rice de la mairie de <strong>${commune.nom}</strong> sur <strong>Citoyen+</strong>.</p>
<p><a href="${activationLink}">Activer mon compte</a> (lien valable 24 h).</p>
<p>Si vous n’avez pas demandé cette invitation, ignorez ce message.</p>
      `
    });

    // 4) réponse au front
    res.json({ message: 'Invitation créée et email envoyé', invitationId: invitation.id });
  } catch (err) {
    console.error('InviteAdmin error:', err);
    res.status(500).json({ error: 'Impossible de créer/envoyer l’invitation.' });
  }
};

exports.getInvitation = async (req, res) => {
  const { token } = req.params;
  const inv = await prisma.invitation.findUnique({ where: { token } });
  if (!inv || inv.usedAt || inv.expiresAt < new Date()) {
    return res.status(404).json({ error: 'Invitation invalide ou expirée' });
  }
  res.json({ email: inv.email, communeId: inv.communeId });
};

exports.activateAdmin = async (req, res) => {
  const { token } = req.params;
  const { prenom, nom, password } = req.body;

  const inv = await prisma.invitation.findUnique({ where: { token } });
  if (!inv || inv.usedAt || inv.expiresAt < new Date()) {
    return res.status(400).json({ error: 'Invitation invalide ou expirée' });
  }

  // hash du mot de passe
  const bcrypt = require('bcrypt');
  const hash   = await bcrypt.hash(password, 10);

  try {
    // création du user admin
    const user = await prisma.user.create({
      data: {
        email:      inv.email,
        password:   hash,
        prenom,
        nom,
        communeId:  inv.communeId,
        isComplete: true
      }
    });

    // marque l’invitation comme utilisée
    await prisma.invitation.update({
      where: { token },
      data: { usedAt: new Date() }
    });

    res.json({ message: 'Compte activé', userId: user.id });
  } catch (err) {
    console.error('activateAdmin error:', err);
    res.status(500).json({ error: 'Impossible d’activer le compte' });
  }
};

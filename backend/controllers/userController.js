const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

exports.changePassword = async (req, res) => {
  const { current, new: newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(400).json({ error: "Utilisateur non trouvé." });
    }

    // Si l'utilisateur a un mot de passe existant, on vérifie l'ancien
    if (user.password && user.password !== 'google-oauth') {
      const isValid = await bcrypt.compare(current, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Mot de passe actuel incorrect." });
      }
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed }
    });

    res.json({ message: "Mot de passe mis à jour avec succès ✅" });
  } catch (err) {
    console.error("❌ Erreur serveur :", err);
    res.status(500).json({ error: "Erreur serveur lors du changement de mot de passe." });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { nom, prenom, email } = req.body;

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { nom, prenom, email },
    });

    res.json({ message: "Profil mis à jour avec succès", user: updated });
  } catch (err) {
    console.error("❌ Erreur mise à jour profil :", err);
    res.status(500).json({ error: "Erreur lors de la mise à jour du profil." });
  }
};

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Créer une nouvelle demande
exports.createRequest = async (req, res) => {
  try {
    const { category, description } = req.body;
    const userId = req.user.id;
    const filePath = req.file ? req.file.filename : null;

    const newRequest = await prisma.request.create({
      data: {
        fullName: req.user.nom + ' ' + req.user.prenom,
        email: req.user.email,
        category,
        description,
        userId,
        filePath,
      },
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Erreur createRequest :', error);
    res.status(500).json({ message: 'Erreur lors de la création de la demande.' });
  }
};

// Récupérer toutes les demandes
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await prisma.request.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Erreur getAllRequests :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des demandes.' });
  }
};

// Récupérer les demandes de l'utilisateur connecté
exports.getRequestsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRequests = await prisma.request.findMany({
      where: { userId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(userRequests);
  } catch (error) {
    console.error('Erreur getRequestsByUser :', error);
    res.status(500).json({ message: "Erreur lors de la récupération des demandes de l'utilisateur." });
  }
};

// Récupérer les demandes par commune de l'utilisateur
exports.getRequestsByCommune = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.communeId) {
      return res.status(400).json({ message: 'Commune non spécifiée pour cet utilisateur.' });
    }

    const requests = await prisma.request.findMany({
      where: {
        user: { communeId: user.communeId },
      },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(requests);
  } catch (error) {
    console.error('Erreur getRequestsByCommune :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des demandes par commune.' });
  }
};

// Récupérer une demande par ID (sécurisé)
exports.getRequestById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const request = await prisma.request.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });

    if (!request) {
      return res.status(404).json({ message: 'Demande introuvable' });
    }

    if (request.userId !== userId) {
      return res.status(403).json({ message: 'Accès refusé à cette demande' });
    }

    res.status(200).json(request);
  } catch (error) {
    console.error('Erreur getRequestById :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la demande.' });
  }
};

// Mettre à jour le statut d'une demande
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await prisma.request.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.status(200).json(updated);
  } catch (error) {
    console.error('Erreur updateStatus :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut.' });
  }
};

// Mettre à jour une demande (description + image pour citizen, complet pour admin)
exports.updateRequest = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const userRole = req.user?.role || 'citizen';

  try {
    const existingRequest = await prisma.request.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingRequest) {
      return res.status(404).json({ message: 'Demande introuvable' });
    }

    // Le citoyen ne peut modifier que sa propre demande et seulement description/image
    if (existingRequest.userId !== userId) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const updatedData = {};

    if (userRole === 'citizen') {
      if (req.body.description) updatedData.description = req.body.description;
      if (req.file) updatedData.filePath = req.file.filename;
    } else {
      if (req.body.fullName) updatedData.fullName = req.body.fullName;
      if (req.body.email) updatedData.email = req.body.email;
      if (req.body.category) updatedData.category = req.body.category;
      if (req.body.description) updatedData.description = req.body.description;
      if (req.file) updatedData.filePath = req.file.filename;
    }

    const updatedRequest = await prisma.request.update({
      where: { id: parseInt(id) },
      data: updatedData,
    });

    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Erreur updateRequest :', error);
    res.status(500).json({ message: 'Erreur lors de la modification de la demande.' });
  }
};

// Supprimer une demande (sécurisé)
exports.deleteRequest = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const request = await prisma.request.findUnique({
      where: { id: parseInt(id) },
    });

    if (!request) {
      return res.status(404).json({ message: 'Demande introuvable' });
    }

    if (request.userId !== userId) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    await prisma.request.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Demande supprimée avec succès' });
  } catch (error) {
    console.error('Erreur deleteRequest :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la demande.' });
  }
};

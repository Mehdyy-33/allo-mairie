
const requestModel = require('../models/requestModel');

exports.createRequest = async (req, res) => {
  try {
    const { category, description } = req.body;
    const userId = req.user.id;
    const filePath = req.file ? req.file.filename : null;

    const newRequest = await requestModel.create({
      fullName: req.user.email,
      email: req.user.email,
      category,
      description,
      userId,
      filePath,
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la demande.' });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await requestModel.getAll();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des demandes.' });
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updated = await requestModel.updateStatus(id, status);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut.' });
  }
};

exports.deleteRequest = async (req, res) => {
  const { id } = req.params;
  try {
    await requestModel.delete(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la demande.' });
  }
};

exports.getRequestsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRequests = await requestModel.getByUserId(userId);
    res.status(200).json(userRequests);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des demandes de l'utilisateur." });
  }
};

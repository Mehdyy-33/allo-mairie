import React from 'react';

const RequestCard = ({ request }) => {
  if (!request) return null;

  return (
    <div className="border rounded-xl shadow p-4 mb-4">
      <h3 className="text-lg font-semibold">{request.fullName}</h3>
      <p className="text-sm text-gray-600">Catégorie : {request.category}</p>
      <p className="mt-2">{request.description}</p>
      <p className="text-xs text-gray-400 mt-2">
        Par : {request.user?.prenom || 'Utilisateur'} | {new Date(request.createdAt).toLocaleString()}
      </p>
      <p className="text-sm mt-1 font-medium">Statut : {request.status}</p>
    </div>
  );
};

export default RequestCard;

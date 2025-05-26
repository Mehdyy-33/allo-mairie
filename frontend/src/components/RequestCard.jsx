import React from 'react';

const RequestCard = ({ request, isOwnRequest = false, onEdit, onDelete }) => {
  if (!request) return null;

  return (
    <div className="flex items-start justify-between border rounded-xl shadow p-4 mb-4 bg-white">
      <div className="flex-1 pr-4">
        <h3 className="text-lg font-semibold">{request.fullName}</h3>
        <p className="text-sm text-gray-600">Catégorie : {request.category}</p>
        <p className="mt-2">{request.description}</p>

        <p className="text-xs text-gray-400 mt-2">
          Par : {request.user?.prenom || 'Utilisateur'} | {new Date(request.createdAt).toLocaleString()}
        </p>
        <p className="text-sm mt-1 font-medium">Statut : {request.status}</p>

        {isOwnRequest && (
          <div className="mt-3 flex gap-3">
            <button
              onClick={() => onEdit(request.id)}
              className="text-sm text-blue-600 hover:underline"
            >
              ✏️ Modifier
            </button>
            <button
              onClick={() => onDelete(request.id)}
              className="text-sm text-red-600 hover:underline"
            >
              🗑 Supprimer
            </button>
          </div>
        )}
      </div>

      {request.filePath && (
        <img
          src={`${import.meta.env.VITE_API_URL}/uploads/${request.filePath}`}
          alt="Fichier joint"
          className="w-24 h-24 object-cover rounded-md"
        />
      )}
    </div>
  );
};

export default RequestCard;

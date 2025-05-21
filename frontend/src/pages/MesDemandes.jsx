import { useEffect, useState } from 'react';
import axios from 'axios';
import CitizenHeader from '../components/CitizenHeader';

export default function MesDemandes() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/requests/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des demandes :', error);
      }
    };
    fetchRequests();
  }, []);

  return (
    <>
      <CitizenHeader />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Mes demandes</h1>
        <div className="space-y-4">
          {requests.length === 0 ? (
            <p className="text-gray-600">Aucune demande enregistrée.</p>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="border rounded p-4 bg-white shadow-sm">
                <h2 className="font-semibold">{req.category}</h2>
                <p className="text-sm text-gray-700">{req.description}</p>
                <p className="text-sm text-gray-500">Créée le : {new Date(req.createdAt).toLocaleDateString()}</p>
                <span className="inline-block text-xs mt-1 px-2 py-1 bg-gray-100 rounded">
                  Statut : {req.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

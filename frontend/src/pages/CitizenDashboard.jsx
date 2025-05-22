// ✅ CitizenDashboard.jsx amélioré
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CitizenHeader from '../components/CitizenHeader';

const CitizenDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState({ prenom: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);
        console.log("Utilisateur connecté :", userResponse.data);


        const requestsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/requests/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(requestsResponse.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleNewRequest = () => {
    navigate('/nouvelle-demande');
  };

  const countByStatus = (status) => {
    return requests.filter(r => r.status === status).length;
  };

  return (
    <>
      <CitizenHeader />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Bonjour, {user.prenom} 👋</h1>
        <p className="text-gray-600 mb-6">Bienvenue sur votre tableau de bord citoyen.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <h2 className="font-semibold">📬 Total des demandes</h2>
            <p className="text-2xl">{requests.length}</p>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <h2 className="font-semibold">🕓 En cours</h2>
            <p className="text-2xl">{countByStatus('en_cours')}</p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <h2 className="font-semibold">✅ Résolues</h2>
            <p className="text-2xl">{countByStatus('resolue')}</p>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={handleNewRequest}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            ➕ Faire une nouvelle demande
          </button>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2">🕒 Dernières demandes</h2>
          <ul className="space-y-2">
            {requests.slice(0, 5).map((req) => (
              <li key={req.id} className="p-3 bg-gray-100 rounded">
                <div className="flex justify-between">
                  <span className="font-medium">{req.type}</span>
                  <span className="text-sm text-gray-600">{new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-sm text-gray-700">Statut : <strong>{req.status}</strong></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default CitizenDashboard;

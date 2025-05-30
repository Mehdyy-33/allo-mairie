import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CitizenHeader from '../components/CitizenHeader';
import RequestCard   from '../components/RequestCard';

export default function CitizenDashboard() {
  const [requests, setRequests] = useState([]);
  const [user, setUser]         = useState({ prenom: '', email: '' });
  const [loading, setLoading]   = useState(true);
  const navigate                = useNavigate();
  const API_URL                 = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // ⚙️ Récupère le profil
        const userRes = await axios.get(
          `${API_URL}/auth/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(userRes.data);

        // 📬 Récupère les demandes de cet utilisateur
        const reqRes = await axios.get(
          `${API_URL}/requests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRequests(reqRes.data);
      } catch (error) {
        console.error("Erreur de chargement du dashboard :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleNewRequest = () => {
    navigate('/nouvelle-demande');
  };

  // Nom à afficher : privilégie le prénom, sinon l'email
  const displayName = user.prenom || user.email;

  const countByStatus = status =>
    requests.filter(r => r.status === status).length;

  if (loading) {
    return (
      <>
        <CitizenHeader />
        <div className="p-4 text-center">Chargement...</div>
      </>
    );
  }

  return (
    <>
      <CitizenHeader />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Bonjour, {displayName} 👋</h1>
        <p className="text-gray-600 mb-6">
          Bienvenue sur votre tableau de bord citoyen.
        </p>

        {/* Statistiques */}
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

        {/* Bouton nouvelle demande */}
        <div className="mb-6">
          <button
            onClick={handleNewRequest}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            ➕ Faire une nouvelle demande
          </button>
        </div>

        {/* Liste des demandes */}
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-2">📣 Mes demandes récentes</h2>
          {requests.length === 0 ? (
            <p>Aucune demande récente.</p>
          ) : (
            requests.map(req => (
              <RequestCard key={req.id} request={req} />
            ))
          )}
        </div>
      </div>
    </>
  );
}

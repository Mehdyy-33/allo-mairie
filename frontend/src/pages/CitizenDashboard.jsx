
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CitizenHeader from '../components/CitizenHeader';

const CitizenDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState({ firstName: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
const token = localStorage.getItem('token');
const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
  headers: { Authorization: `Bearer ${token}` },
});
        setUser(userResponse.data);

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

  const getInProgressCount = () => {
    return requests.filter(r => r.status === 'En cours').length;
  };

  return (
    
    <div className="p-6">
            <CitizenHeader />

      <h1 className="text-2xl font-bold mb-4">
        Bonjour {user.firstName}, vous avez {getInProgressCount()} demande(s) en cours.
      </h1>
      <button
        onClick={handleNewRequest}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        Nouvelle demande
      </button>
      <div className="space-y-4">
        {requests.slice(0, 5).map((req) => (
          <div key={req.id} className="border p-4 rounded shadow">
            <h2 className="font-semibold">{req.title}</h2>
            <p className="text-sm text-gray-600">Statut : {req.status}</p>
            <p className="text-sm text-gray-500">Créée le : {new Date(req.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitizenDashboard;

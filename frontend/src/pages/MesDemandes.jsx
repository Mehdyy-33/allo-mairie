import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CitizenHeader from '../components/CitizenHeader';

export default function MesDemandes() {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

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
        setFiltered(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des demandes :', error);
      }
    };
    fetchRequests();
  }, []);

  useEffect(() => {
    let result = [...requests];

    if (search) {
      result = result.filter((r) =>
r.category && r.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((r) => r.status === statusFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFiltered(result);
  }, [search, statusFilter, sortOrder, requests]);

  const formatDate = (iso) => new Date(iso).toLocaleDateString('fr-FR');

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_cours': return 'bg-yellow-200 text-yellow-800';
      case 'terminee': return 'bg-green-200 text-green-800';
      case 'refusee': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <>
      <CitizenHeader />
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">📄 Mes demandes</h1>
          <Link to="/nouvelle-demande" className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
            ➕ Nouvelle demande
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher par type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 flex-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2"
          >
            <option value="all">Tous les statuts</option>
            <option value="en_cours">En cours</option>
            <option value="terminee">Terminée</option>
            <option value="refusee">Refusée</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border p-2"
          >
            <option value="desc">Plus récentes</option>
            <option value="asc">Plus anciennes</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-600">Aucune demande trouvée.</p>
        ) : (
          <ul className="space-y-4">
            {filtered.map((req) => (
              <li key={req.id} className="border rounded p-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
<span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 mr-2">
  {req.category}
</span>
                    <p className="text-sm text-gray-500">Créée le {formatDate(req.createdAt)}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(req.status)}`}>
                    {req.status}
                  </span>
                </div>
                <Link
                  to={`/suivi?id=${req.id}`}
                  className="text-blue-600 text-sm mt-2 inline-block hover:underline"
                >
                  Voir le détail →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

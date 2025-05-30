import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InviteAdmin() {
  const [email, setEmail] = useState('');
  const [communes, setCommunes] = useState([]);
  const [communeId, setCommuneId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  // Récupère la liste des communes protégée
  useEffect(() => {
    const fetchCommunes = async () => {
      try {
        const res = await fetch(
          `${API_URL}/admin/cities`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (!res.ok) {
          throw new Error(`Erreur ${res.status} lors du chargement des communes`);
        }
        const data = await res.json();
        setCommunes(data);
      } catch (err) {
        console.error("InviteAdmin fetchCommunes error:", err);
        setError('Impossible de charger la liste des communes.');
      }
    };

    fetchCommunes();
  }, [API_URL, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(
        `${API_URL}/admin/invitations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ email, communeId: Number(communeId) })
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Erreur ${res.status}`);
      }
      setMessage('Invitation envoyée !');
      setEmail('');
      setCommuneId('');
    } catch (err) {
      console.error("InviteAdmin handleSubmit error:", err);
      setMessage(`Échec de l’invitation : ${err.message}`);
    }
  };

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  // Affiche loading tant que la liste n'est pas chargée
  if (communes.length === 0) {
    return <div className="p-4">Chargement des communes…</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Inviter un admin de mairie</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="block w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Commune</label>
          <select
            required
            value={communeId}
            onChange={e => setCommuneId(e.target.value)}
            className="block w-full border px-2 py-1 rounded"
          >
            <option value="">-- Choisir une commune --</option>
            {communes.map(c => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Envoyer invitation
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}

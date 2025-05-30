import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ActivateAccount() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [communeId, setCommuneId] = useState(null);
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // On récupère l’invitation pour pré-remplir l’email
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/invitations/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setEmail(data.email);
          setCommuneId(data.communeId);
        }
      })
      .catch(() => setError('Erreur réseau'));
  }, [token]);

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/invitations/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prenom, nom, password })
    });
    const data = await res.json();
    if (res.ok) {
      navigate('/login');
    } else {
      setError(data.error);
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!email) return <p>Chargement…</p>;

  return (
    <div>
      <h2>Activation du compte admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Email</label>
          <input type="email" value={email} disabled className="block w-full border px-2 py-1 bg-gray-100" />
        </div>
        <div>
          <label>Prénom</label>
          <input
            type="text"
            required
            value={prenom}
            onChange={e => setPrenom(e.target.value)}
            className="block w-full border px-2 py-1"
          />
        </div>
        <div>
          <label>Nom</label>
          <input
            type="text"
            required
            value={nom}
            onChange={e => setNom(e.target.value)}
            className="block w-full border px-2 py-1"
          />
        </div>
        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="block w-full border px-2 py-1"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
          Activer mon compte
        </button>
      </form>
    </div>
  );
}

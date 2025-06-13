// src/pages/ActivateAccount.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ActivateAccount() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [communeId, setCommuneId] = useState(null);
  const [prenom, setPrenom]     = useState('');
  const [nom, setNom]           = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  // 1) On récupère l’invitation pour pré-remplir l’e-mail et la commune
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/admin/invitations/${token}`)
      .then(({ data }) => {
        if (data.error) {
          setError(data.error);
        } else {
          setEmail(data.email);
          setCommuneId(data.communeId);
        }
      })
      .catch(() => setError('Erreur réseau lors de la récupération de l’invitation'));
  }, [token]);

  // 2) Soumission du formulaire d’activation
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/invitations/${token}`,
        { prenom, nom, password }
      );

      // On attend que ton back renvoie le JWT sous la forme { token: "..." }
      const jwtToken = data.token;
      if (!jwtToken) {
        // si pas de token, on redirige sur login
        return navigate('/login', { replace: true });
      }

      // 3) Stockage du token
      localStorage.setItem('token', jwtToken);

      // 4) Décodage rapide pour récupérer communeId (payload second segment)
      const payload = JSON.parse(atob(jwtToken.split('.')[1]));
      const userCommuneId = payload.communeId;

      // 5) Redirection selon le rôle
      if (userCommuneId) {
        navigate(`/admin/${userCommuneId}`, { replace: true });
      } else {
        // super-admin
        navigate('/admin', { replace: true });
      }
    } catch (err) {
      console.error('ActivateAccount submit error:', err);
      setError(err.response?.data?.error || 'Échec de l’activation');
    }
  };

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  if (!email) {
    return <p>Chargement…</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl mb-4">Activation du compte admin</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full border px-3 py-2 bg-gray-100"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Prénom</label>
          <input
            type="text"
            required
            value={prenom}
            onChange={e => setPrenom(e.target.value)}
            className="w-full border px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Nom</label>
          <input
            type="text"
            required
            value={nom}
            onChange={e => setNom(e.target.value)}
            className="w-full border px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Mot de passe</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Activer mon compte
        </button>
      </form>
    </div>
  );
}

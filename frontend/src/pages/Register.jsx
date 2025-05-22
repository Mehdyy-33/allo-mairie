import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [communeInput, setCommuneInput] = useState('');
  const [communes, setCommunes] = useState([]);
  const [communeId, setCommuneId] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // 🔁 Requête déclenchée quand l’utilisateur tape dans le champ
  useEffect(() => {
    const fetchCommunes = async () => {
      if (communeInput.length < 2) {
        setCommunes([]);
        return;
      }

      try {
        const res = await fetch(`/api/communes?search=${communeInput}`);
        const data = await res.json();
        setCommunes(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Erreur chargement communes:', err);
      }
    };

    const delay = setTimeout(fetchCommunes, 300); // debounce 300ms
    return () => clearTimeout(delay);
  }, [communeInput]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nom || !prenom || !email || !password || !confirm || !communeId) {
      return alert('Veuillez remplir tous les champs.');
    }

    if (password !== confirm) {
      return alert('Les mots de passe ne correspondent pas.');
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nom, prenom, communeId })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      navigate('/dashboard', { replace: true });
    } else {
      alert(data.error || 'Erreur lors de l’inscription');
    }
  };

  const handleCommuneSelect = (commune) => {
    setCommuneInput(commune.nom);
    setCommuneId(commune.id);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full max-w-sm px-4 space-y-6">
      <h2 className="text-2xl font-bold text-center">Inscription</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Prénom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <input
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <div className="relative">
          <input
            type="text"
            placeholder="Commune"
            value={communeInput}
            onChange={(e) => {
              setCommuneInput(e.target.value);
              setCommuneId(null);
            }}
            className="w-full border px-4 py-2 rounded"
            required
          />
          {showSuggestions && communes.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
              {communes.map((commune) => (
                <li
                  key={commune.id}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleCommuneSelect(commune)}
                >
                  {commune.nom}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Créer un compte
        </button>
      </form>

      <p className="text-center text-sm">
        Déjà un compte ?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Connectez-vous
        </a>
      </p>
      <button
        onClick={() => window.location.href = '/'}
        className="w-full border border-gray-300 hover:border-gray-500 text-gray-700 py-2 rounded mt-4"
      >
        ⬅ Revenir à l’accueil
      </button>
    </div>
  );
}

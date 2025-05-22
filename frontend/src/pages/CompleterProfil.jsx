import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CompleterProfil() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [communeId, setCommuneId] = useState('');
  const [communeInput, setCommuneInput] = useState('');
  const [communes, setCommunes] = useState([]);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  // 🔄 Extraire le token de l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const t = urlParams.get('token');
    if (!t) {
      alert('Token manquant');
      return navigate('/login');
    }
    localStorage.setItem('token', t);
    setToken(t);
  }, [navigate]);

  // 🔍 Autocomplete des communes
  useEffect(() => {
    if (communeInput.length < 2) {
      setCommunes([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await fetch(`/api/communes?search=${communeInput}`);
        const data = await res.json();
        setCommunes(data);
      } catch (err) {
        console.error('Erreur chargement communes:', err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [communeInput]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nom || !prenom || !communeId) {
      return alert('Veuillez remplir tous les champs');
    }

    try {
      const res = await fetch('/api/auth/complete-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nom, prenom, communeId: Number(communeId) }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Profil complété');
        navigate('/dashboard');
      } else {
        alert(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur réseau');
    }
  };

  const handleCommuneSelect = (commune) => {
    setCommuneInput(commune.nom);
    setCommuneId(commune.id);
    setCommunes([]);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Complétez votre profil</h2>

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
            required
            className="w-full border px-4 py-2 rounded"
          />
          {communes.length > 0 && (
            <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-40 overflow-y-auto">
              {communes.map((c) => (
                <li
                  key={c.id}
                  onClick={() => handleCommuneSelect(c)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {c.nom}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Valider
        </button>
      </form>
    </div>
  );
}

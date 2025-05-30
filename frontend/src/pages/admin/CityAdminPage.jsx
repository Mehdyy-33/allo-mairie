import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function CityAdminPage() {
  const { cityId } = useParams();
  const [city, setCity]     = useState(null);
  const [users, setUsers]   = useState([]);
  const [error, setError]   = useState('');
  const API_URL             = import.meta.env.VITE_API_URL;
  const token               = localStorage.getItem('token');

  useEffect(() => {
    const fetchCityAndUsers = async () => {
      try {
        // 1) Détails de la ville
        const cityRes = await fetch(
          `${API_URL}/admin/cities/${cityId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!cityRes.ok) {
          throw new Error(`Ville non trouvée (${cityRes.status})`);
        }
        const cityData = await cityRes.json();
        setCity(cityData);

        // 2) Citoyens de la ville
        const usersRes = await fetch(
          `${API_URL}/admin/cities/${cityId}/users`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!usersRes.ok) {
          throw new Error(`Impossible de charger les citoyens (${usersRes.status})`);
        }
        const usersData = await usersRes.json();
        setUsers(usersData);
      } catch (err) {
        console.error("Erreur CityAdminPage:", err);
        setError(err.message);
      }
    };

    fetchCityAndUsers();
  }, [API_URL, cityId, token]);

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Erreur : {error}
      </div>
    );
  }

  if (!city) {
    return <p className="p-4">Chargement…</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-lg font-semibold mb-4">Administration de {city.nom}</h2>

      <section className="mb-6">
        <h3 className="font-medium mb-2">Citoyens</h3>
        {users.length === 0 ? (
          <p>Aucun citoyen pour cette commune.</p>
        ) : (
          <ul className="space-y-1">
            {users.map(u => (
              <li key={u.id}>
                <Link
                  to={`/citoyen/${u.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {u.prenom || u.email} {u.nom || ''}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Ajoutez ici d'autres sections (stats, paramètres...) */}
    </div>
  );
}

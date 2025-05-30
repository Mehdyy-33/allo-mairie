import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function CitiesList() {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/cities`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(setCities)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Administration des villes</h2>
      <ul className="space-y-2">
        {cities.map(city => (
          <li key={city.id}>
            <Link to={`${city.id}`} className="text-blue-600 hover:underline">
              {city.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

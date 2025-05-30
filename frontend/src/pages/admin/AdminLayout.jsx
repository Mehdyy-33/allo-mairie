import { Outlet, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function AdminLayout() {
  const [initial, setInitial] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.prenom) {
          setInitial(data.prenom.charAt(0).toUpperCase());
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="admin-layout">
      <header className="flex items-center p-4 bg-white shadow-md">
        <button className="burger mr-4">☰</button>
        <h1 className="text-xl font-semibold flex-grow">Panneau Admin</h1>
        <div className="user-badge w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
          {initial}
        </div>
      </header>

      <nav className="p-4 bg-gray-100">
        <Link to="/admin" className="block mb-2">Villes</Link>
        {/* Ajoutez d'autres liens si nécessaire */}
      </nav>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}

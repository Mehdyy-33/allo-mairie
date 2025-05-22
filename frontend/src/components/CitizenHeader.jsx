import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function CitizenHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('dashboard')) setCurrentPage('Tableau de bord');
    else if (path.includes('nouvelle-demande')) setCurrentPage('Nouvelle demande');
    else if (path.includes('demandes')) setCurrentPage('Mes demandes');
    else if (path.includes('documents')) setCurrentPage('Mes documents');
    else if (path.includes('notifications')) setCurrentPage('Notifications');
    else if (path.includes('profil')) setCurrentPage('Mon profil');
    else if (path.includes('faq')) setCurrentPage('Centre d\'aide');
    else setCurrentPage('Espace Citoyen');
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow p-4 mb-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="text-lg font-bold text-blue-600">
          {currentPage}
        </div>
        <nav className="flex flex-wrap gap-4 text-sm">
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">🏠 Tableau de bord</Link>
          <Link to="/nouvelle-demande" className="text-gray-700 hover:text-blue-600 font-medium">➕ Nouvelle demande</Link>
          <Link to="/demandes" className="text-gray-700 hover:text-blue-600 font-medium">📄 Mes demandes</Link>
          <Link to="/documents" className="text-gray-700 hover:text-blue-600 font-medium">🧾 Mes documents</Link>
          <Link to="/notifications" className="text-gray-700 hover:text-blue-600 font-medium">🔔 Notifications</Link>
          <Link to="/profil" className="text-gray-700 hover:text-blue-600 font-medium">👤 Mon profil</Link>
          <Link to="/faq" className="text-gray-700 hover:text-blue-600 font-medium">❓ Aide</Link>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            🚪 Déconnexion
          </button>
        </nav>
      </div>
    </header>
  );
}

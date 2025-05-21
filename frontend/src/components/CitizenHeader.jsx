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
    else setCurrentPage('');
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow p-4 mb-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="text-lg font-bold text-blue-600">
          {currentPage || 'Espace Citoyen'}
        </div>
        <nav className="flex space-x-4">
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
            Tableau de bord
          </Link>
          <Link to="/nouvelle-demande" className="text-gray-700 hover:text-blue-600 font-medium">
            Nouvelle demande
          </Link>
          <Link to="/demandes" className="text-gray-700 hover:text-blue-600 font-medium">
            Mes demandes
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Déconnexion
          </button>
        </nav>
      </div>
    </header>
  );
}

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

export default function CitizenHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInitial, setUserInitial] = useState('U');
  const menuRef = useRef(null);

  // 🔁 Récupération automatique du prénom depuis /me
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/users/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.prenom) {
            const initial = data.prenom.charAt(0).toUpperCase();
            localStorage.setItem('prenom', data.prenom);
            setUserInitial(initial);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du profil :", err);
      }
    };

    fetchUser();
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow p-4 mb-6">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Titre à gauche */}
        <div className="flex-none text-lg font-bold text-blue-600">
          {currentPage}
        </div>

        {/* Liens centrés */}
        <div className="flex-1 flex justify-center">
          <nav className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap">🏠 Tableau de bord</Link>
            <Link to="/nouvelle-demande" className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap">➕ Nouvelle demande</Link>
            <Link to="/demandes" className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap">📄 Mes demandes</Link>
            <Link to="/documents" className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap">🧾 Mes documents</Link>
            <Link to="/notifications" className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap">🔔 Notifications</Link>
          </nav>
        </div>

        {/* Menu utilisateur à droite */}
        <div className="flex-none relative" ref={menuRef}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full cursor-pointer font-bold"
          >
            {userInitial}
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
              <Link to="/profil" className="block px-4 py-2 hover:bg-gray-100">Mon profil</Link>
              <Link to="/faq" className="block px-4 py-2 hover:bg-gray-100">Aide</Link>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Déconnexion</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// src/components/ProtectedRoute.jsx
import { useEffect, useState, createContext } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Contexte pour partager l'objet user
export const AuthContext = createContext(null);

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // pas de token du tout
        return navigate('/login', { replace: true, state: { from: location } });
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const u = res.data;
        setUser(u);

        // profil incomplet
        if (!u.isComplete) {
          return navigate('/completer-profil', { replace: true });
        }

        // Admin global ? (pas de communeId)
        if (location.pathname === '/admin/invite') {
          if (u.communeId) {
            // un admin de commune n'a pas le droit d'inviter
            return navigate('/admin', { replace: true });
          }
        }

        // Page /admin/:cityId  → si admin de commune, ne laisse passer que sa ville
        if (location.pathname.startsWith('/admin/') && location.pathname !== '/admin/invite') {
          const parts = location.pathname.split('/');
          const cityId = parts[2]; // e.g. "5"
          // si c'est un admin de commune, il ne peut voir que sa propre ville
          if (u.communeId && Number(cityId) !== u.communeId) {
            return navigate('/admin', { replace: true });
          }
        }

        // tout est ok
        setAuthorized(true);
      } catch (err) {
        console.error('❌ Auth error:', err);
        localStorage.removeItem('token');
        return navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname, navigate]);

  if (loading) {
    return <div className="p-4 text-center">Chargement...</div>;
  }

  if (!authorized) {
    // navigations déclenchées dans useEffect, ou on redirige au fallback
    return null;
  }

  // On fournit le user via contexte pour que l'app y accède sans refaire /auth/me
  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  );
}

import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenFromURL = urlParams.get('token');

    if (tokenFromURL) {
      localStorage.setItem('token', tokenFromURL);
      navigate('/dashboard', { replace: true });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token && !tokenFromURL) {
  navigate('/login', { replace: true });
  return;
}


    const checkAuth = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data.isComplete) {
          navigate('/completer-profil', { replace: true });
        } else {
          setAuthorized(true);
        }
      } catch (err) {
        console.error('❌ Auth error:', err);
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location, navigate]);

  if (loading) return <div className="p-4 text-center">Chargement...</div>;

  return authorized ? children : null;
}

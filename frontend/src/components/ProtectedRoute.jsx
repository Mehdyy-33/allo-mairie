import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenFromURL = urlParams.get('token');

    if (tokenFromURL) {
      localStorage.setItem('token', tokenFromURL);
      console.log('✅ Token récupéré via URL dans ProtectedRoute');
      setToken(tokenFromURL);
    } else {
      const storedToken = localStorage.getItem('token');
      console.log('🔍 Token localStorage détecté dans ProtectedRoute :', storedToken);
      setToken(storedToken);
    }

    setLoading(false);
  }, [location.search]);

  if (loading) return null;

  return token ? children : <Navigate to="/login" />;
}

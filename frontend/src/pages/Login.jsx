// src/pages/Login.jsx

import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import axios                   from 'axios';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const navigate                = useNavigate();
  const API_URL                 = import.meta.env.VITE_API_URL;

  // Si on a déjà un token, on décode le payload pour rediriger immédiatement
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.communeId) {
        return navigate(`/admin/${payload.communeId}`, { replace: true });
      }
      if (payload.isAdmin) {
        return navigate('/admin', { replace: true });
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Décodage du token failed:', err);
      // si le token est invalide on reste sur la page login
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1) Authentification
      const { data } = await axios.post(
        `${API_URL}/auth/login`,
        { email, password }
      );
      // 2) Stockage du token
      localStorage.setItem('token', data.token);

      // 3) Décodage du payload pour redirection
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      if (payload.communeId) {
        navigate(`/admin/${payload.communeId}`, { replace: true });
      } else if (payload.isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      alert(err.response?.data?.error || 'Erreur de connexion');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="w-full max-w-sm px-4 space-y-6 mx-auto mt-16">
      <h2 className="text-2xl font-bold text-center">Connexion</h2>

      <button
        onClick={handleGoogleLogin}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
      >
        Se connecter avec Google
      </button>

      <div className="text-gray-400 text-center text-sm">ou</div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Se connecter
        </button>
      </form>

      <p className="text-center text-sm">
        Pas encore de compte ?{' '}
        <a href="/register" className="text-blue-600 hover:underline">
          Inscrivez-vous
        </a>
      </p>

      <button
        onClick={() => navigate('/')}
        className="w-full border border-gray-300 hover:border-gray-500 text-gray-700 py-2 rounded mt-4"
      >
        ⬅ Revenir à l’accueil
      </button>
    </div>
  );
}

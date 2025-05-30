import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const navigate                = useNavigate();
  const API_URL                 = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Si déjà connecté, on récupère le profil pour rediriger automatiquement
    const token = localStorage.getItem('token');
    if (token) {
      (async () => {
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const user = await res.json();
            if (user.communeId == null) {
              return navigate('/admin/invite', { replace: true });
            } else if (user.communeId) {
              return navigate(`/admin/${user.communeId}`, { replace: true });
            }
          }
        } catch {}
        navigate('/dashboard', { replace: true });
      })();
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return alert(data.error || 'Erreur de connexion');
      }

      // 1) Stocke le token
      localStorage.setItem('token', data.token);

      // 2) Récupère le profil pour savoir où rediriger
      const profileRes = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${data.token}` }
      });

      if (profileRes.ok) {
        const user = await profileRes.json();
        if (user.communeId == null) {
          return navigate('/admin/invite', { replace: true });
        } else if (user.communeId) {
          return navigate(`/admin/${user.communeId}`, { replace: true });
        }
      }

      // Par défaut, citoyen
      navigate('/dashboard', { replace: true });

    } catch (err) {
      console.error('Login error:', err);
      alert('Erreur réseau');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="w-full max-w-sm px-4 space-y-6">
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

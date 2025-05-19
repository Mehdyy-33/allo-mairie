import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  // 🔄 Vérifie si un token est passé par Google OAuth
  useEffect(() => {
    const url = new URL(window.location.href)
    const token = url.searchParams.get('token')
    if (token) {
      localStorage.setItem('token', token)
      navigate('/formulaire')
    }
  }, [navigate])

  // 🔐 Connexion email/mot de passe
  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem('token', data.token)
      navigate('/formulaire')
    } else {
      alert(data.error || 'Erreur de connexion')
    }
  }

  // 🔁 Redirige vers Google OAuth
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/google'
  }

  return (
    <div className="max-w-sm mx-auto mt-10 space-y-6">
      <h2 className="text-2xl font-bold text-center">Connexion</h2>

      {/* 🔘 Bouton Google */}
      <button
        onClick={handleGoogleLogin}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
      >
        Se connecter avec Google
      </button>

      <div className="text-gray-400 text-center text-sm">ou</div>

      {/* 🔐 Formulaire classique */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Se connecter
        </button>
      </form>

      <p className="text-sm text-center">
        Pas encore de compte ?{' '}
        <a href="/register" className="text-blue-600 hover:underline">
          Inscrivez-vous
        </a>
      </p>
    </div>
  )
}


import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/formulaire', { replace: true })
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password || !confirm) {
      return alert('Veuillez remplir tous les champs.')
    }

    if (password !== confirm) {
      return alert('Les mots de passe ne correspondent pas.')
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem('token', data.token)
      navigate('/formulaire', { replace: true })
    } else {
      alert(data.error || 'Erreur lors de l’inscription')
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/google'
  }

  return (
    <div className="w-full max-w-sm px-4 space-y-6">
      <h2 className="text-2xl font-bold text-center">Inscription</h2>

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
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Créer un compte
        </button>
      </form>

      <p className="text-center text-sm">
        Déjà un compte ?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Connectez-vous
        </a>
      </p>
    </div>
  )
}
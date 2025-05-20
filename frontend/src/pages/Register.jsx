
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

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold">Inscription</h2>

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

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Créer un compte
      </button>
    </form>
  )
}

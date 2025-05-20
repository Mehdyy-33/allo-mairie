import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const urlParams = new URLSearchParams(location.search)
  const tokenFromURL = urlParams.get('token')

  // Si token dans l’URL (OAuth par ex.), on le stocke direct
  if (tokenFromURL) {
    localStorage.setItem('token', tokenFromURL)
    return <Navigate to="/formulaire" replace />
  }

  const token = localStorage.getItem('token')

  // Vérification immédiate du token, même après un "retour"
  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

import { useNavigate } from 'react-router-dom'

export default function HeaderAuth() {
  const navigate = useNavigate()

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[92%] max-w-6xl bg-white/90 backdrop-blur-lg rounded-full shadow-md px-6 py-3 flex items-center justify-between">
      
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        className="text-xl font-bold text-blue-700 cursor-pointer"
      >
        Citoyen+
      </div>

      {/* Liens à droite */}
      <nav className="flex gap-4 text-sm font-medium text-gray-700">
        <button onClick={() => navigate('/')} className="hover:text-blue-600 transition">
          Accueil
        </button>
        <button onClick={() => navigate('/#contact')} className="hover:text-blue-600 transition">
          Contact
        </button>
        <button onClick={() => navigate('/faq')} className="hover:text-blue-600 transition">
          FAQ
        </button>
      </nav>
    </header>
  )
}

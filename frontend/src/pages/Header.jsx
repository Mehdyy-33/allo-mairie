import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Si on vient d'une autre page
      navigate('/')
      setTimeout(() => {
        const retry = document.getElementById(id)
        if (retry) retry.scrollIntoView({ behavior: 'smooth' })
      }, 200)
    }
  }

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[92%] max-w-7xl bg-white/90 backdrop-blur-lg rounded-full shadow-xl px-6 py-3 flex items-center justify-between">
      
      {/* Logo gauche */}
      <div
        onClick={() => navigate('/')}
        className="text-xl font-bold text-blue-700 cursor-pointer"
      >
        Citoyen+
      </div>

      {/* Liens centraux */}
      <nav className="hidden md:flex gap-6 text-sm font-medium">
        <button
          onClick={() => scrollTo('faire-une-demande')}
          className="text-gray-700 hover:text-blue-600 transition"
        >
          Faire une demande
        </button>
      
        <button
          onClick={() => scrollTo('stats')}
          className="text-gray-700 hover:text-blue-600 transition"
        >
          Statistiques
        </button>
        <button
          onClick={() => scrollTo('contact')}
          className="text-gray-700 hover:text-blue-600 transition"
        >
          Contact
        </button>
        <button
          onClick={() => scrollTo('temoignages')}
          className="text-gray-700 hover:text-blue-600 transition"
        >
          Témoignages
        </button>

  <button
          onClick={() => scrollTo('suivi')}
          className="text-gray-700 hover:text-blue-600 transition"
        >
          Suivi
        </button>

      </nav>

      {/* Bouton Admin à droite */}
      <button
        onClick={() => navigate('/admin')}
        className="text-sm bg-black text-white px-4 py-1.5 rounded-full hover:bg-gray-800 transition"
      >
        Admin
      </button>

      
    </header>
  )
}

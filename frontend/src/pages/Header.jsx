import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white border border-gray-200 shadow-md px-6 py-3 rounded-full flex items-center justify-between w-[95vw] max-w-6xl">
        {/* Logo */}
        <Link
          to="/"
          className="text-lg font-bold  whitespace-nowrap "
        >
          Allo Mairie
        </Link>

        {/* Liens centraux */}
        <nav className="flex-1 flex justify-center gap-6 text-sm md:text-base font-medium text-gray-800">
          {[
            { to: '/formulaire', label: 'Faire une demande' },
            { to: '/suivi', label: 'Suivi' },
            { to: '/stats', label: 'Statistiques' }
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="px-4 py-2 rounded-full hover:bg-blue-100 transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bouton admin */}
        <Link
          to="/admin"
          className="bg-black text-white text-sm px-4 py-2 rounded-full hover:bg-gray-900 transition whitespace-nowrap"
        >
          Admin
        </Link>
      </div>
    </header>
  )
}

export default Header

import { Outlet, useLocation } from 'react-router-dom'

export default function HeaderAuth() {
  const location = useLocation()
  const isLoginOrRegister = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Colonne gauche : branding */}
      <div className="bg-blue-100 flex items-center justify-center">
        <div className="max-w-md text-left px-8">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-2">Allo Maire</h1>
          <p className="text-base text-blue-600">Votre mairie à portée de clic</p>
        </div>
      </div>

      {/* Colonne droite : rendu du formulaire */}
      <div className="flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <Outlet /> {/* C’est ici que <Login /> ou <Register /> sera rendu */}
        </div>
      </div>
    </div>
  )
}
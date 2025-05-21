import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './pages/Header'
import HeaderAuth from './pages/HeaderAuth'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RequestForm from './pages/RequestForm'
import TrackRequest from './pages/TrackRequest'
import Stats from './pages/Stats'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        {/* Page d’accueil avec Header + Footer */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home />
              <footer className="bg-white text-gray-700 text-sm mt-6 px-4 py-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-base font-bold text-blue-700 mb-1">Citoyen+</h3>
                    <p className="text-gray-600 text-xs">
                      Une plateforme pour simplifier la communication entre les citoyens et leur mairie.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-base font-bold mb-1">Informations légales</h3>
                    <ul className="space-y-1 text-xs">
                      <li><a href="/mentions-legales" className="hover:underline">Mentions légales</a></li>
                      <li><a href="/confidentialite" className="hover:underline">Politique de confidentialité</a></li>
                      <li><a href="/cgu" className="hover:underline">Conditions d'utilisation</a></li>
                      <li><a href="/accessibilite" className="hover:underline">Accessibilité</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-base font-bold mb-1">Contact</h3>
                    <p className="text-gray-600 text-xs">Pour toute question ou demande d’assistance :</p>
                    <a href="mailto:contact@citoyenplus.fr" className="text-blue-600 hover:underline text-xs">
                      contact@citoyenplus.fr
                    </a>
                  </div>
                </div>
                <div className="text-center text-xs text-gray-500 mt-4">
                  © {new Date().getFullYear()} Citoyen+. Tous droits réservés.
                </div>
              </footer>
            </>
          }
        />

        {/* Routes /login et /register avec layout HeaderAuth */}
        <Route element={<HeaderAuth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Les autres pages normales */}
        <Route path="/stats" element={<Stats />} />
        <Route path="/suivi" element={<TrackRequest />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route
          path="/formulaire"
          element={
            <ProtectedRoute>
              <RequestForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
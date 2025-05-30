import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './pages/Header';
import HeaderAuth from './pages/HeaderAuth';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TrackRequest from './pages/TrackRequest';
import Stats from './pages/Stats';
// import AdminDashboard from './pages/AdminDashboard'; // supprimé
import ProtectedRoute from './components/ProtectedRoute';
import ModifierDemande from './components/ModifierDemande';
import CitizenDashboard from './pages/CitizenDashboard';
import NouvelleDemande from './pages/NouvelleDemande';
import MesDemandes from './pages/MesDemandes';
import CompleterProfil from './pages/CompleterProfil';
import Profil from './pages/Profil';
import FAQ from './pages/FAQ';
import MesDocuments from './pages/MesDocuents';
import Notifications from './pages/Notification';

// 🆕 Import des nouveaux composants admin
import AdminLayout from './pages/admin/AdminLayout';
import CitiesList from './pages/admin/CitiesList';
import CityAdminPage from './pages/admin/CityAdminPage';
import InviteAdmin from './pages/admin/InviteAdmin';
import ActivateAccount from './pages/admin/ActivateAccount';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes citoyennes protégées */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nouvelle-demande"
          element={
            <ProtectedRoute>
              <NouvelleDemande />
            </ProtectedRoute>
          }
        />
        <Route
          path="/demandes"
          element={
            <ProtectedRoute>
              <MesDemandes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/modifier-demande/:id"
          element={
            <ProtectedRoute>
              <ModifierDemande />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <MesDocuments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profil"
          element={
            <ProtectedRoute>
              <Profil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faq"
          element={
            <ProtectedRoute>
              <FAQ />
            </ProtectedRoute>
          }
        />

        <Route path="/completer-profil" element={<CompleterProfil />} />

        {/* Accueil public avec Header */}
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

        {/* Auth routes avec HeaderAuth */}
        <Route element={<HeaderAuth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Autres pages accessibles */}
        <Route path="/stats" element={<Stats />} />
        <Route path="/suivi" element={<TrackRequest />} />

        {/* Nouvel espace Admin : layout + sous-routes */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* /admin → liste des villes */}
          <Route index element={<CitiesList />} />
          {/* /admin/:cityId → page admin d’une ville */}
          <Route path=":cityId" element={<CityAdminPage />} />
        </Route>

        {/* Route protégée pour inviter un admin de mairie */}
        <Route
          path="/admin/invite"
          element={
            <ProtectedRoute>
              <InviteAdmin />
            </ProtectedRoute>
          }
        />

        {/* Route publique d’activation par token */}
        <Route path="/activate/:token" element={<ActivateAccount />} />

        {/* Fallback vers /admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

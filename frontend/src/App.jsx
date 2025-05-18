import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Header from './pages/Header'
import Home from './pages/Home'
import RequestForm from './pages/RequestForm'
import AdminDashboard from './pages/AdminDashboard'
import TrackRequest from './pages/TrackRequest'
import Stats from './pages/Stats'


function App() {
  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/formulaire" element={<RequestForm />} />
          <Route path="/suivi" element={<TrackRequest />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App

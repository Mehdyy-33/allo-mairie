import React, { useState } from 'react'

export default function TrackRequest() {
  const [email, setEmail] = useState('')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch('/api/requests')
      const data = await res.json()
      const filtered = data.filter((req) => req.email === email)
      setRequests(filtered)
    } catch (err) {
      alert('Erreur lors de la recherche.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-6">Suivre ma demande</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Entrez votre adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Rechercher mes demandes
          </button>
        </form>

        {loading && <p className="mt-4 text-center text-gray-500">Chargement...</p>}

        {searched && !loading && (
          <div className="mt-6 space-y-4">
            {requests.length === 0 ? (
              <p className="text-center text-gray-500">Aucune demande trouvée.</p>
            ) : (
              requests.map((req) => (
                <div
                  key={req.id}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50"
                >
                  <p className="text-sm text-gray-700">
                    <strong>Catégorie :</strong> {req.category}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Description :</strong> {req.description}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 italic">
                    Statut : <span className="font-semibold">{req.status}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = async () => {
    const res = await fetch('/api/requests')
    const data = await res.json()
    setRequests(data)
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    await fetch(`/api/requests/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchRequests()
  }

  const deleteRequest = async (id) => {
    if (confirm('Confirmer la suppression ?')) {
      await fetch(`/api/requests/${id}`, { method: 'DELETE' })
      fetchRequests()
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  if (loading) return <p className="text-center mt-20">Chargement...</p>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Dashboard - Demandes</h1>

      <div className="space-y-6 max-w-4xl mx-auto">
        {requests.map((req) => (
          <div key={req.id} className="bg-white p-6 rounded-xl shadow border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {req.category} — {req.fullName}
              </h2>
              <button
                onClick={() => deleteRequest(req.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Supprimer
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-2">{req.email}</p>
            <p className="text-gray-700 mb-4">{req.description}</p>

            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-600">Statut :</label>
              <select
                value={req.status}
                onChange={(e) => updateStatus(req.id, e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="Reçue">Reçue</option>
                <option value="En cours">En cours</option>
                <option value="Résolue">Résolue</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

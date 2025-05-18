import React, { useState } from 'react'

export default function RequestForm() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    category: '',
    description: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        alert('✅ Demande envoyée avec succès !')
        setForm({ fullName: '', email: '', category: '', description: '' })
      } else {
        alert('❌ Une erreur est survenue.')
      }
    } catch (error) {
      alert('⚠️ Erreur réseau')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white shadow-2xl rounded-xl p-8 md:p-12 lg:p-16 max-w-lg w-full space-y-6 border border-gray-100"
      >
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Soumettre une demande
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nom complet</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Catégorie</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="Voirie">Voirie</option>
            <option value="Déchets">Déchets</option>
            <option value="Éclairage">Éclairage</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
        >
          Envoyer la demande
        </button>
      </form>
    </div>
  )
}

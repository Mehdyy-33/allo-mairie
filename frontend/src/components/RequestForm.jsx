import React, { useState } from 'react';

export default function RequestForm() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    category: '',
    description: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert('✅ Votre demande a été envoyée avec succès !');
        setForm({ fullName: '', email: '', category: '', description: '' });
      } else {
        alert("❌ Une erreur est survenue lors de l'envoi de la demande.");
        console.error("Erreur lors de l'envoi:", response);
      }
    } catch (error) {
      alert('⚠️ Impossible de contacter le serveur. Veuillez réessayer plus tard.');
      console.error('Erreur de réseau:', error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-blue-100 via-white to-blue-200">
      {/* Optionnel : motif SVG en fond décoratif */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-cover bg-no-repeat opacity-10 pointer-events-none" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white shadow-2xl rounded-xl p-8 md:p-12 lg:p-16 max-w-lg w-full space-y-6 border border-gray-100 backdrop-blur-sm"
      >
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Faites-nous part de votre requête
        </h2>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Nom complet
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Votre nom complet"
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Adresse e-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="votre@email.com"
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Catégorie de la demande
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none"
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              <option value="Voirie">Voirie</option>
              <option value="Déchets">Gestion des déchets</option>
              <option value="Éclairage">Éclairage public</option>
              <option value="Autre">Autre</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description détaillée
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Décrivez votre demande en détail..."
            required
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Soumettre ma demande
          </button>
        </div>
      </form>
    </div>
  );
}

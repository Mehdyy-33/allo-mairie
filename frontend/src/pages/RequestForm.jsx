
import React, { useState, useEffect } from 'react';

export default function RequestForm() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    category: '',
    description: '',
  });

  // ✅ Récupérer token depuis l'URL (cas Google login) et sécuriser
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlParams.get('token');

    if (tokenFromURL) {
      localStorage.setItem('token', tokenFromURL);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert('✅ Demande envoyée avec succès !');
        setForm({ fullName: '', email: '', category: '', description: '' });
      } else {
        alert('❌ Une erreur est survenue.');
      }
    } catch (error) {
      alert('⚠️ Erreur réseau');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Se déconnecter
      </button>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-8 bg-white rounded shadow-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Envoyer une demande</h2>
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Nom complet"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Catégorie"
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="w-full p-2 border rounded h-32"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}

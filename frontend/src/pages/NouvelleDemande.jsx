import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CitizenHeader from '../components/CitizenHeader';

export default function NouvelleDemande() {
  const [form, setForm] = useState({
    category: '',
    description: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/requests`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Erreur envoi demande :', err);
      alert("Une erreur est survenue lors de l'envoi de la demande.");
    }
  };

  return (
    <>
      <CitizenHeader />
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">Nouvelle demande</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Catégorie</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full mt-1 border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full mt-1 border p-2 rounded"
              rows={4}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Envoyer
          </button>
        </form>
      </div>
    </>
  );
}

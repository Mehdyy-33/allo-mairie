import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function ModifierDemande() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    category: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/requests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const r = response.data;
        setForm({
  fullName: `${r.user.prenom} ${r.user.nom}`.trim(),
          email: r.email || '',
          category: r.category || '',
          description: r.description || '',
        });
      } catch (error) {
        console.error('Erreur :', error.response?.data || error.message);
        alert("Impossible de charger la demande.");
        navigate('/demandes');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRequest();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
      if (file) formData.append('file', file);

      await axios.put(`${import.meta.env.VITE_API_URL}/requests/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Demande modifiée avec succès');
      navigate('/demandes');
    } catch (error) {
      console.error('Erreur lors de la modification :', error.response?.data || error.message);
      alert("Erreur lors de la modification");
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">✏️ Modifier la demande</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          readOnly
          className="w-full border p-2 bg-gray-100"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          readOnly
          className="w-full border p-2 bg-gray-100"
        />
        <input
          type="text"
          name="category"
          value={form.category}
          readOnly
          className="w-full border p-2 bg-gray-100"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2"
          rows="4"
          required
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          💾 Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}

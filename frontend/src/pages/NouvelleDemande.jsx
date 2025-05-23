import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CitizenHeader from '../components/CitizenHeader';

export default function NouvelleDemande() {
  const [form, setForm] = useState({
    category: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      console.log('📎 Fichier sélectionné :');
      console.log('Nom      :', selectedFile.name);
      console.log('Taille   :', selectedFile.size, 'octets');
      console.log('Type MIME:', selectedFile.type);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('category', form.category);
      formData.append('description', form.description);

      if (file) {
        formData.append('file', file);
      }

      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/requests`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Erreur envoi demande :', err);
      alert("Erreur lors de l'envoi de la demande.");
    }
  };

  return (
    <>
      <CitizenHeader />
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">Nouvelle demande</h1>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Catégorie de la demande
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="border p-2 w-full mb-4"
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="voirie">Voirie</option>
              <option value="éclairage">Éclairage public</option>
              <option value="déchets">Déchets</option>
              <option value="nuisances">Nuisances</option>
              <option value="sécurité">Sécurité</option>
              <option value="urbanisme">Urbanisme</option>
              <option value="autre">Autre</option>
            </select>
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Pièce jointe</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full mt-1"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
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

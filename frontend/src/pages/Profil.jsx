import { useEffect, useState } from 'react';
import axios from 'axios';
import CitizenHeader from '../components/CitizenHeader';

export default function Profil() {
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [isGoogleUser, setIsGoogleUser] = useState(false);

  // 🔁 Fonction indépendante pour charger le profil
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({
        prenom: res.data.prenom || '',
        nom: res.data.nom || '',
        email: res.data.email || '',
      });

      if (res.data.authProvider === 'google') {
        setIsGoogleUser(true);
      }
    } catch (err) {
      console.error('Erreur chargement profil :', err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/user/update`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Réponse API profil :", response.data);

      // 🔄 Recharge les données depuis l’API pour garder l’état à jour
      await fetchUser();

      alert("Profil mis à jour !");
    } catch (err) {
      console.error("Erreur mise à jour profil :", err);
      alert("Erreur lors de la mise à jour du profil.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      return alert("Les mots de passe ne correspondent pas.");
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/user/change-password`,
        passwordData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Mot de passe mis à jour.");
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (err) {
      console.error("Erreur changement mdp :", err);
      alert("Erreur lors du changement de mot de passe.");
    }
  };

  return (
    <>
      <CitizenHeader />
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">👤 Mon profil</h1>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <input
            name="prenom"
            type="text"
            placeholder="Prénom"
            value={form.prenom}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <input
            name="nom"
            type="text"
            placeholder="Nom"
            value={form.nom}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Mettre à jour
          </button>
        </form>

        <h2 className="text-lg font-bold mb-2">Changer mon mot de passe</h2>
        {isGoogleUser && (
          <p className="text-sm text-yellow-600 mb-2">
            Vous êtes connecté via Google. Vous pouvez définir un mot de passe pour vous connecter aussi par email.
          </p>
        )}
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {!isGoogleUser && (
            <input
              type="password"
              name="current"
              placeholder="Mot de passe actuel"
              value={passwordData.current}
              onChange={handlePasswordChange}
              className="border p-2 w-full"
            />
          )}
          <input
            type="password"
            name="new"
            placeholder="Nouveau mot de passe"
            value={passwordData.new}
            onChange={handlePasswordChange}
            className="border p-2 w-full"
          />
          <input
            type="password"
            name="confirm"
            placeholder="Confirmer le nouveau mot de passe"
            value={passwordData.confirm}
            onChange={handlePasswordChange}
            className="border p-2 w-full"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Valider le changement
          </button>
        </form>
      </div>
    </>
  );
}

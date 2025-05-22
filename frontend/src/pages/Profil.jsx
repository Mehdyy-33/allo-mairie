import React, { useState } from "react";

const Profil = () => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Infos mises à jour :", formData);
    // Appel API à ajouter ici
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">👤 Mon profil</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input name="nom" type="text" placeholder="Nom complet" value={formData.nom} onChange={handleChange} className="border p-2 w-full" />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border p-2 w-full" />
        <input name="telephone" type="text" placeholder="Téléphone" value={formData.telephone} onChange={handleChange} className="border p-2 w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Mettre à jour</button>
      </form>
    </div>
  );
};

export default Profil;
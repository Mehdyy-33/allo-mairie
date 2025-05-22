import React from "react";

const FAQ = () => {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">❓ Centre d'aide / FAQ</h1>
      <ul className="space-y-2 list-disc ml-5">
        <li><strong>Comment créer une demande ?</strong> Cliquez sur "Nouvelle demande" dans le menu.</li>
        <li><strong>Où voir mes réponses ?</strong> Dans "Mes demandes", cliquez sur la demande concernée.</li>
        <li><strong>Comment modifier mon profil ?</strong> Allez dans "Mon profil" pour mettre à jour vos informations.</li>
      </ul>
    </div>
  );
};

export default FAQ;
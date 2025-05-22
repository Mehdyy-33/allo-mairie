// ✅ Notifications.jsx
import React from "react";

const Notifications = () => {
  const notifications = [
    { id: 1, message: "Votre demande #123 a été mise à jour." },
    { id: 2, message: "Un agent a répondu à votre signalement." },
    { id: 3, message: "Demande #120 clôturée avec succès." }
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🔔 Notifications</h1>
      <ul className="space-y-2">
        {notifications.map((notif) => (
          <li key={notif.id} className="bg-gray-100 p-3 rounded">
            {notif.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;

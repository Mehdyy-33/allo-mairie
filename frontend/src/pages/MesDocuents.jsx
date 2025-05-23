import { useEffect, useState } from 'react';
import axios from 'axios';
import CitizenHeader from '../components/CitizenHeader';

export default function MesDocuments() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/requests/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const extractedDocs = [];

        response.data.forEach((req) => {
          if (req.filePath && typeof req.filePath === 'string') {
            extractedDocs.push({
              requestId: req.id,
              category: req.category,
              fileName: req.filePath,
              type: 'citoyen',
              createdAt: req.createdAt,
            });
          }

          if (req.responseFile) {
            extractedDocs.push({
              requestId: req.id,
              category: req.category,
              fileName: req.responseFile,
              type: 'mairie',
              createdAt: req.updatedAt || req.createdAt,
            });
          }
        });

        setDocuments(extractedDocs);
      } catch (err) {
        console.error('Erreur chargement documents :', err);
      }
    };

    fetchDocuments();
  }, []);

  const formatDate = (iso) => new Date(iso).toLocaleDateString('fr-FR');

  const handleDownload = async (filename) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/requests/download/${filename}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const blob = new Blob([response.data]);
const url = window.URL.createObjectURL(blob);
const link = document.createElement('a');

// Essaie d'extraire l'extension depuis le type MIME
const mime = response.headers['content-type'];
let extension = '';

if (mime === 'image/jpeg') extension = '.jpg';
else if (mime === 'image/png') extension = '.png';
else if (mime === 'application/pdf') extension = '.pdf';
// ajoute d'autres types si besoin

// Force un nom de fichier correct
const suggestedName = filename.endsWith(extension) ? filename : filename + extension;

link.href = url;
link.setAttribute('download', suggestedName);

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erreur téléchargement :', error);
      alert('Le téléchargement a échoué.');
    }
  };

  return (
    <>
      <CitizenHeader />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">🧾 Mes documents</h1>

        {documents.length === 0 ? (
          <p className="text-gray-600">Aucun document trouvé pour l’instant.</p>
        ) : (
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Demande #</th>
                <th className="p-2 text-left">Catégorie</th>
                <th className="p-2 text-left">Fichier</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">#{doc.requestId}</td>
                  <td className="p-2 capitalize">{doc.category}</td>
                  <td className="p-2">{doc.fileName}</td>
                  <td className="p-2">
                    {doc.type === 'citoyen' ? 'Pièce jointe citoyen' : 'Réponse mairie'}
                  </td>
                  <td className="p-2">{formatDate(doc.createdAt)}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDownload(doc.fileName)}
                      className="text-blue-600 hover:underline"
                    >
                      Télécharger
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

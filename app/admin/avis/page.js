"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '../../components/auth/Button';

export default function AvisAdmin() {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvis = async () => {
      try {
        const res = await fetch('/api/avis', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setAvis(data.data);
        } else {
          console.error("Erreur lors de la récupération des avis:", res.statusText);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des avis:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAvis();
  }, []);

  const deleteAvis = async (avisId) => {
    try {
      const res = await fetch('/api/avis', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avisId }),
      });
      if (res.ok) {
        setAvis(avis.filter(av => av.id !== avisId));
      } else {
        console.error("Erreur lors de la suppression de l'avis:", res.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'avis:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Tableau de bord Admin</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Avis existants</h2>
        {loading && <p className="text-center text-gray-500">Chargement...</p>}
        {avis.length === 0 && !loading && <p className="text-center text-gray-500">Aucun avis trouvé.</p>}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {avis.map((av) => (
            <div key={av.id} className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 animate-fade-in">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Produit: {av.product?.name || 'N/A'}</h3>
              <p className="text-gray-600 mb-2">Utilisateur: {av.user?.username || 'N/A'}</p>
              <p className="text-gray-600 mb-2">Note: {av.note}/5</p>
              <p className="text-gray-600 mb-4">{av.comment}</p>
              <div className="flex space-x-2 justify-center">
                <Button onClick={() => deleteAvis(av.id)} type="button">Supprimer</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

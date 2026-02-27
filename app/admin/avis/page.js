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
    <div className="min-h-screen bg-[#292322] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#F5CC60]">Gestion des Avis</h1>
            <p className="text-[#F5CC60]/70 mt-1">Gérez tous les avis de votre plateforme</p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5CC60]"></div>
          </div>
        )}

        {avis.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="p-4 bg-[#F5CC60]/20 rounded-full inline-block mb-4">
              <svg className="w-12 h-12 text-[#F5CC60]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#F5CC60] mb-2">Aucun avis trouvé</h3>
            <p className="text-[#F5CC60]/70">Les avis apparaîtront ici une fois soumis.</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {avis.map((av) => (
            <div key={av.id} className="bg-[#F5CC60] rounded-xl shadow-sm border border-[#F5CC60]/20 p-6 hover:shadow-md transition-shadow duration-200 group">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-[#292322]/20 rounded-lg group-hover:bg-[#292322]/30 transition-colors duration-200">
                  <svg className="w-6 h-6 text-[#292322]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="flex-1 overflow-auto"> 
                  <h3 className=" text-md font-semibold text-[#292322] truncate">Produit: {av.product?.name || 'N/A'}</h3>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-[#292322]/70">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{av.user?.username || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-[#292322]/70 mr-2">Note:</span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${star <= av.note ? 'text-yellow-400' : 'text-[#292322]/30'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-[#292322]/70">/5</span>
                  </div>
                </div>
                <p className="text-sm text-[#292322]/70 line-clamp-3">{av.comment}</p>
              </div>

              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => deleteAvis(av.id)}
                  className="inline-flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

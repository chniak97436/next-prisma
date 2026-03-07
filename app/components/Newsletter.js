"use client";
import React, { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [couponCode] = useState('WELCOME10');
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage('Veuillez entrer votre email');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Veuillez entrer un email valide');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Merci de votre inscription ! Voici votre code de bienvenue');
        setEmail('');
      } else {
        setMessage(data.echec || 'Une erreur est survenue');
      }
    } catch (error) {
      setMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" bg-[#242124] w-[60%] mx-auto p-6 rounded-lg shadow-md">
      <h3 className="text-[#F5CC60] text-2xl font-bold mb-4">Newsletter</h3>
      <p className="text-gray-300 mb-4">
        Inscrivez-vous pour recevoir nos dernières nouvelles et offres spéciales !
      </p>
      {!isSuccess && message && (
        <div className="mb-4 text-center font-semibold bg-red-300 border border-red-500 text-red-700 px-4 py-3 rounded">
          {message}
        </div>
      )}
      {isSuccess ? (
        <div className="space-y-6">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {message}
          </div>

          {/* Code promo */}

          <div className="bg-[#F5CC60] p-4 rounded-lg text-center">
            <p className="text-[#242124] font-bold text-lg">
              Code promo: <span className="text-2xl">{couponCode}</span>
            </p>
            <p className="text-sm text-[#242124]">10% de réduction sur votre première commande</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F5CC60] text-[#F5CC60] bg-[#242124]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#F5CC60] text-[#242124] font-bold py-2 px-4 rounded-md hover:bg-[#F5CC60]/80 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Inscription...' : "S'inscrire"}
          </button>

        </form>
      )}
    </div>
  );
}

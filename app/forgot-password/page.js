"use client"
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ForgotPasswordContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token'); // Récupère ?token=... depuis l'email

    // ÉTAPE 1 : Demander l'envoi de l'email de récupération
    const forgotSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const response = await fetch('/api/auth/forgotPassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const res = await response.json();
        setLoading(false);

        if (res.ok) {
            alert("Si un compte existe, un email a été envoyé.");
        } else {
            alert(res.error || "Une erreur est survenue.");
        }
    };

    // ÉTAPE 2 : Envoyer le nouveau mot de passe avec le token
    const pwdSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        setLoading(true);
        const response = await fetch('/api/auth/resetPassword', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password }), // On envoie le token de l'URL
        });
        const res = await response.json();
        setLoading(false);

        if (res.ok) {
            alert("Mot de passe réinitialisé avec succès !");
            router.push('/login');
        } else {
            alert(res.error || "Lien invalide ou expiré.");
        }
    };

    return (
        <main className="h-dvh min-w-full flex justify-center items-center bg-[#292322] py-8 px-4 text-black">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md w-full">
                
                {!token ? (
                    /* FORMULAIRE A : DEMANDE D'EMAIL */
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-center">Mot de passe oublié</h2>
                        <form onSubmit={forgotSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Adresse e-mail</label>
                                <input type="email" onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200" placeholder="votre@email.com" />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                                {loading ? "Envoi..." : "Envoyer le lien"}
                            </button>
                        </form>
                    </div>
                ) : (
                    /* FORMULAIRE B : SAISIE DU NOUVEAU MOT DE PASSE (si token présent) */
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-center">Nouveau mot de passe</h2>
                        <form onSubmit={pwdSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Nouveau mot de passe</label>
                                <input type="password" onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200" minLength={8} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Confirmez le mot de passe</label>
                                <input type="password" onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200" />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                                {loading ? "Mise à jour..." : "Réinitialiser"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}

// Wrapper Suspense obligatoire pour useSearchParams dans Next.js
export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={<div className="text-white text-center mt-10">Chargement...</div>}>
            <ForgotPasswordContent />
        </Suspense>
    );
}
"use client"
import React from 'react'
import NavBar from '../components/NavBar';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';



export default function forgotPassword() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({
                    name: decoded.name?.name || decoded.name || '',
                    role: decoded.name?.role || decoded.role || '',
                });
            }
            catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);


    const forgotSubmit = async (e) => {
        e.preventDefault();
        const data = await fetch('/api/auth/forgotPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        const res = await data.json();
        
        if (res.ok) {
            alert(res.message);
            setSuccess(true);
        } else {
            alert("Erreur lors de la demande de réinitialisation du mot de passe. Veuillez réessayer.");
        }
    }


    const pwdSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas. Veuillez réessayer.");
            return;
        }
        const data = await fetch('/api/auth/resetPassword', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const res = await data.json();
        if (res.ok) {
            alert("Mot de passe réinitialisé avec succès !");
            router.push('/login');
        }
    }

    return (
        <main className="h-dvh min-w-full flex justify-center items-center bg-[#292322] py-8 px-4">
            {/* <NavBar user={{ name: user?.name, role: user?.role }} /> */}
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                {!success && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-center">Mot de passe oublié</h2>
                        <form onSubmit={forgotSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Adresse e-mail</label>
                                <input type="email" id="email" onChange={(e) => setEmail(e.target.value)} name="email" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200" />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">Réinitialisation</button>
                        </form>
                    </div>
                )}
                {success && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-center">Nouveau mot de passe</h2>
                        <form onSubmit={pwdSubmit}>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Nouveau mot de passe</label>
                                <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} name="password" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">Confirmez votre mot de passe</label>
                                <input type="password" id="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} name="confirmPassword" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200" />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">Réinitialiser</button>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}

"use client"
import React, { useState, useEffect, useRef } from 'react'
import NavBar from '../components/NavBar'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import { useCart } from './../components/CartContext';
import { User } from 'lucide-react'
import { CommandeStatus } from '@prisma/client'

export default function commande() {
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)
    const dataFetchedRef = useRef(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [first_name, setFirst_name] = useState('')
    const [last_name, setLast_name] = useState('')
    const [address, setAdress] = useState('')
    const [phone, setPhone] = useState('')
    const [succes, setSucces] = useState(false)
    const [message, setMessage] = useState('')
    const [err, setErr] = useState('')
    const {
        removeFromCart,
        getTotalPrice,
        getTotalItems,
      } = useCart();
    const router = useRouter()


    // Gestion du JWT (inchangé)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({
                    id: decoded.userId || decoded.id,
                    name: decoded.name || decoded.username || '',
                    role: decoded.role || '',
                });
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
        setLoading(false);
    }, []);
    //find user data
    useEffect(() => {
        if (!user || dataFetchedRef.current) return;
        const fetchUserData = async () => {
            try {
                const res = await fetch(`/api/users/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.data) {
                        setUser(prev => ({ ...prev, ...data.data }));
                        dataFetchedRef.current = true;
                    }
                } else {
                    console.error('Failed to fetch user data:', res.statusText);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [user]);

    //----------form updateUser----------------
    const updateUser = async (e) => {
        e.preventDefault()
        console.log("é")
        const id = user.id
        const updatedData = {
            username: username || user.username,
            email: email || user.email,
            first_name: first_name || user.first_name,
            last_name: last_name || user.last_name,
            address: address || user.address,
            phone: phone || user.phone,
        };
        const response = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });
        const data = await response.json()
        if (response.ok) {
            setSucces(true)
            setMessage('Vos mise à jour ont été prises en compte.')
        } else {

            setErr('une erreur est survenue verifier vos données')
        }
        console.log("succes : ", response)

    }
    //----------POST COMMANDE BDD-----------------
    const valideCommande = async () => {
        const priceTotal =parseFloat(getTotalPrice().toFixed(2)) 
        const userid = user.id
        const address = user.address
        console.log("click commande")
        
        try {
            const res = await fetch('/api/commande/', {
                method: "POST",
                include : {
                  user : User,
                  status : CommandeStatus ,
                },
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({  userid, address, priceTotal }),
                
                })
                const data = await res.json()
                console.log(data)
                if(data){
                    setMessage('Commande validée....')
                    setTimeout(()=>{
                      router.push(`./commande/recapCommand/`)  
                    },2000)
                }
        } catch (err) {

        }
    }
    return (
        <div className='min-h-screen bg-[#292322]  '>
            <NavBar user={{ name: user?.name || '' }} />

            <div className="pt-20 px-6   text-[#F5CC60]">
                <h1 className="text-3xl text-center font-bold text-[#F5CC60] mb-10">Informations personnelles</h1>
                <div className='max-w-2xl mx-auto'>
                    {user ? (
                        <form onSubmit={updateUser} className="bg-[#F5CC60] text-[#292322] rounded-lg shadow-2xl border border-[#F5CC60] p-8 space-y-6">
                            

                            {/* Nom d'utilisateur */}
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
                                <label className="flex items-center text-sm font-medium">
                                    Nom d'utilisateur :
                                </label>
                                {user.username ? (
                                    <span className="md:col-span-2 font-medium text-sm bg-[#292322] text-[#F5CC60] px-3 py-2 rounded-md">{user.username}</span>
                                ) : (
                                    <input
                                        type="text"
                                        onChange={(e) => setUsername(e.target.value)}
                                        value={username}
                                        className="md:col-span-2 outline-none focus:ring-2 focus:ring-[#292322] px-3 py-2 rounded-md bg-[#292322] text-[#F5CC60] transition-all duration-200"
                                        placeholder="Entrez votre nom d'utilisateur"
                                    />
                                )}
                            </div>

                            {/* Email */}
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
                                <label className="flex items-center text-sm font-medium">
                                    Email :
                                </label>
                                {user.email ? (
                                    <span className="md:col-span-2 font-medium text-sm bg-[#292322] text-[#F5CC60] px-3 py-2 rounded-md">{user.email}</span>
                                ) : (
                                    <input
                                        type="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        className="md:col-span-2 outline-none focus:ring-2 focus:ring-[#292322] px-3 py-2 rounded-md bg-[#292322] text-[#F5CC60] transition-all duration-200"
                                        placeholder="Entrez votre email"
                                    />
                                )}
                            </div>

                            {/* Prénom */}
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
                                <label className="flex items-center text-sm font-medium">
                                    Prénom :
                                </label>
                                {user.first_name ? (
                                    <span className="md:col-span-2 font-medium text-sm bg-[#292322] text-[#F5CC60] px-3 py-2 rounded-md">{user.first_name}</span>
                                ) : (
                                    <input
                                        type="text"
                                        onChange={(e) => setFirst_name(e.target.value)}
                                        value={first_name}
                                        className="md:col-span-2 outline-none focus:ring-2 focus:ring-[#292322] px-3 py-2 rounded-md bg-[#292322] text-[#F5CC60] transition-all duration-200"
                                        placeholder="Entrez votre prénom"
                                    />
                                )}
                            </div>

                            {/* Nom */}
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
                                <label className="flex items-center text-sm font-medium">
                                    Nom :
                                </label>
                                {user.last_name ? (
                                    <span className="md:col-span-2 font-medium text-sm bg-[#292322] text-[#F5CC60] px-3 py-2 rounded-md">{user.last_name}</span>
                                ) : (
                                    <input
                                        onChange={(e) => setLast_name(e.target.value)}
                                        value={last_name}
                                        className="md:col-span-2 outline-none focus:ring-2 focus:ring-[#292322] px-3 py-2 rounded-md bg-[#292322] text-[#F5CC60] transition-all duration-200"
                                        placeholder="Entrez votre nom"
                                    />
                                )}
                            </div>

                            {/* Adresse */}
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
                                <label className="flex items-center text-sm font-medium">
                                    Adresse :
                                </label>
                                {user.address ? (
                                    <span className="md:col-span-2 font-medium text-sm bg-[#292322] text-[#F5CC60] px-3 py-2 rounded-md">{user.address || 'N/A'}</span>
                                ) : (
                                    <input
                                        onChange={(e) => setAdress(e.target.value)}
                                        value={address}
                                        className="md:col-span-2 outline-none focus:ring-2 focus:ring-[#292322] px-3 py-2 rounded-md bg-[#292322] text-[#F5CC60] transition-all duration-200"
                                        placeholder="Entrez votre adresse"
                                    />
                                )}
                            </div>

                            {/* Téléphone */}
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
                                <label className="flex items-center text-sm font-medium">
                                    Téléphone :
                                </label>
                                {user.phone ? (
                                    <span className="md:col-span-2 font-medium text-sm bg-[#292322] text-[#F5CC60] px-3 py-2 rounded-md">{user.phone}</span>
                                ) : (
                                    <input
                                        type="tel"
                                        onChange={(e) => setPhone(e.target.value)}
                                        value={phone}
                                        className="md:col-span-2 outline-none focus:ring-2 focus:ring-[#292322] px-3 py-2 rounded-md bg-[#292322] text-[#F5CC60] transition-all duration-200"
                                        placeholder="Entrez votre téléphone"
                                    />
                                )}
                                
                            </div>
                            {succes && (
                                <div className='flex flex-cols-1 md:flex-cols-3 items-center justify-center py-3 px-4 bg-green-700 text-green-300 rounded-md animate-fade-in'>
                                    {message}
                                </div>
                            )}
                            {/* Boutons */}
                            <div className='flex justify-end space-x-4 pt-4'>
                                {!succes ? (
                                    <button
                                        type="submit"
                                        className='px-6 py-2 bg-[#292322] text-[#F5CC60] font-bold rounded-md hover:bg-opacity-80 transition-all duration-200 focus:ring-2 focus:ring-[#F5CC60]'
                                    >
                                        Mettre à jour
                                    </button>
                                ) : (
                                    <button
                                        className='px-6 py-2 bg-[#292322] text-[#F5CC60] font-bold rounded-md hover:bg-opacity-80 transition-all duration-200 focus:ring-2 focus:ring-[#F5CC60] inline-block text-center'
                                        type='button'
                                        onClick={valideCommande}
                                    >
                                        Valider ma commande.
                                    </button>
                                )}
                            </div>

                        </form>

                    ) : (
                        <div className="text-center py-12">
                            <p className="text-[#F5CC60]">Aucun utilisateur connecté.</p>
                        </div>
                    )}

                </div>
            </div>

        </div>
    )
}

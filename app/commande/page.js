"use client"
import React, { useState, useEffect, useRef } from 'react'
import NavBar from '../components/NavBar'
import Link from 'next/link'
import { jwtDecode } from 'jwt-decode'

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
        }
        console.log("succes : ",response)
        
    }
    return (
        <div className='min-h-screen bg-[#292322]  '>
            <NavBar user={{ name: user?.name || '' }} />

            <div className="pt-20 px-6   text-[#F5CC60]">
                <h1 className="text-2xl text-center font-bold text-[#F5CC60] mb-8">Informations personelles</h1>
                <div className='flex flex-row w-[50%] mx-auto'>
                    {user ? (
                        <form onSubmit={updateUser} className="min-w-full rounded-md shadow-2xl border-x bg-[#F5CC60] text-[#292322] mb-10  py-4">
                            {succes && (
                                <div className='text-center py-2 mx-auto my-5 px-4 text-green-300 bg-green-700 w-90 rounded-md  '>{message}</div>
                            )}
                            <div className='mb-6 '>
                                <label className="px-6 py-4 whitespace-nowrap text-sm font-medium ">Nom d'utilisateur :</label>
                                {user.username ? (
                                    <label className="px-6 py-2 whitespace-nowrap font-medium text-sm ">{user.username}</label>
                                ) : (
                                    <input type="text" onChange={(e) => setUsername(e.target.value)} value={username} className="outline focus px-2 rounded-md bg-[#292322] text-[#f5cc60]" />
                                )}
                            </div>

                            <div className='mb-6'>
                                <label className="px-6 py-4 whitespace-nowrap text-sm font-medium ">Email :</label>
                                {user.email ? (
                                    <label className="px-6 py-4 whitespace-nowrap font-medium text-sm ">{user.email}</label>) : (
                                    <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} className="outline focus px-2 rounded-md bg-[#292322] text-[#f5cc60]" />
                                )}
                            </div>

                            <div className='mb-6'>
                                <label className="px-6 py-4 whitespace-nowrap text-sm font-medium ">Prénom :</label>
                                {user.first_name ? (
                                    <label className="px-6 py-4 whitespace-nowrap font-medium text-sm ">{user.first_name}</label>) : (
                                    <input type="text" onChange={(e) => setFirst_name(e.target.value)} value={first_name} className="outline focus px-2 rounded-md bg-[#292322] text-[#f5cc60]" />
                                )}
                            </div>

                            <div className='mb-6'>
                                <label className="px-6 py-4 whitespace-nowrap text-sm font-medium ">Nom :</label>
                                {user.last_name ? (
                                    <label className="px-6 py-4 whitespace-nowrap text-sm font-medium ">{user.last_name}</label>) :
                                    (<input onChange={(e) => setLast_name(e.target.value)} className="outline focus px-2 rounded-md bg-[#292322] text-[#f5cc60]" value={last_name} />)}
                            </div>

                            <div className='mb-6'>
                                <label className="px-6 py-4 whitespace-nowrap text-sm font-medium ">Adresse :</label>
                                {user.address ?
                                    (<label className="px-6 py-4 whitespace-nowrap font-medium text-sm ">{user.address || 'N/A'}</label>) : (
                                        <input onChange={(e) => setAdress(e.target.value)} className="outline focus px-2 rounded-md bg-[#292322] text-[#f5cc60]" value={address} />
                                    )}
                            </div>

                            <div className='mb-8'>
                                <label className="px-6 py-4 whitespace-nowrap text-sm font-medium ">Téléphone :</label>
                                {user.phone ?
                                    (<label className="px-6 py-4 whitespace-nowrap font-medium text-sm ">{user.phone}</label>) : (
                                        <input type="number" onChange={(e) => setPhone(e.target.value)} className="outline focus px-2 rounded-md bg-[#292322] text-[#f5cc60]" value={phone} />
                                    )}
                            </div>
                            {!succes ?(
                                <div className='flex w-full justify-end px-6 '>
                                    <button className='rounded-md px-6 bg-[#292322] text-[#f5cc60]  py-1  font-bold'>Mettre a jour.</button>
                                </div>
                            ) : (
                                <div className='flex w-full justify-end px-6'>
                                    <Link className='px-4 py-2 rounded bg-[#292322] text-[#f5cc60] font-bold' href="/#">aller</Link>
                                </div>
                            )}
                            
                        </form>

                    ) : (
                        <div className="text-center py-12">
                            <p className="text-white">Aucun utilisateur connecté.</p>
                        </div>
                    )}

                </div>
            </div>

        </div>
    )
}

"use client"
import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './../components/CartContext';

export default function products() {
    const [product, setProduct] = useState([]);
    const [user, setUser] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwt.decode(token);
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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                setProduct(data.data || []);
                console.log("data : ", product)
            }
            catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);
    //console.log(products)
    //ADDTOCART---------------
    const handleAddToCart = (item) => {
  if (!item) return;

  // On crée un objet propre avec TOUTES les infos
  const itemToAdd = {
    id: item.id,
    name: item.name,
    price: parseFloat(item.price), // On s'assure que c'est un nombre
    image_url: item.image_url,
  };

  console.log("J'envoie ceci au CartContext :", itemToAdd);
  addToCart(itemToAdd);
};
    return (
        <main className="min-h-screen bg-gray-50 py-8 px-4">
            <NavBar user={{ name: user?.name, role: user?.role }} />
            <div className="max-w-7xl mt-10 mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Tous nos produits</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {product.map((prod) => (
                        <div key={prod.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 hover:border-gray-300 h-96 flex flex-col">
                            <div className="bg-gray-100 h-48 flex items-center justify-center">
                                <Image src={prod.image_url} alt={prod.name} width={400} height={192} className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="p-6 grid grid-rows-[auto_1fr_auto_auto] gap-4 h-full">
                                <h2 className="text-xl font-semibold text-gray-900 overflow-hidden">{prod.name}</h2>
                                <p className="text-gray-600 text-sm overflow-hidden">{prod.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-indigo-600">{prod.price} €</span>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleAddToCart(prod)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center whitespace-nowrap">
                                        <svg className="w-5 h-5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
                                        </svg>
                                        Ajouter au panier
                                    </button>
                                    <Link href={`/products/${prod.id}`} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                                        Détails
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

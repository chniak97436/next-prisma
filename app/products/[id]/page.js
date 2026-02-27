"use client"
import React, { use, useState, useEffect } from 'react'
import Image from 'next/image';
import NavBar from '@/app/components/NavBar';
import { jwtDecode } from 'jwt-decode'
import { useCart } from '../../components/CartContext';
import { CloudLightning } from 'lucide-react';
import { abortOnSynchronousPlatformIOAccess } from 'next/dist/server/app-render/dynamic-rendering';
export default function productId({ params }) {
    const { id } = use(params);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewAvis, setViewAvis] = useState(false);
    const [avisList, setAvisList] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async (id) => {
            try {
                const data = await fetch(`/api/products/${id}`);
                if (!data.ok) {
                    throw new Error('Failed to fetch product');
                }
                const result = await data.json();
                console.log("response : ", result)
                setProduct(result.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct(id);
    }, [id]);

    const [user, setUser] = useState(null);

    const fetchAvisData = async () => {
        try {
            const res = await fetch(`/api/avis?productId=${id}`);
            if (!res.ok) {
                throw new Error('Failed to fetch avis');
            }
            const data = await res.json();
            console.log("Avis data : ", data);
            if (data.data.length > 0) {
                setViewAvis(true);

                setAvisList(data.data);
            }
        } catch (err) {
            console.error('Error fetching avis:', err);
        }
    };

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
        fetchAvisData();
    }, [id]);

    //ADDTOCART---------------
    const handleAddToCart = () => {
        // Petit check de sécurité pour voir ce qu'il y a dans "product"
        console.log("Tentative d'ajout du produit :", product);

        if (!product) return;
        addToCart({
            id: product.id || product._id, // Sécurité si l'ID vient de MongoDB/Prisma
            name: product.name,
            price: product.price,
            image_url: product.image_url,
        });
    }
    //-----------------------VOIR AVIS-----------------------
    const voirAvis = () => {
        setIsOpen(!isOpen);
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div className='text-red-600 text-3xl font-bold'>Error: {error}</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <>
            <main className='mt-0 w-full relative h-dvh flex items-center justify-center bg-[#292322]'>
                <NavBar user={{ name: user?.name, role: user?.role }} />
                <div className=' w-[90%] my-auto bg-[#F5CC60] '>
                    <div className='mt-20 w-full'>
                        <h1 className='text-center text-[#292322] text-4xl font-bold '>{product.name}</h1>
                    </div>
                    <div className=' w-[80%]  bg-[#F5CC60] mb-10  mx-auto'>
                        <div className='flex mx-auto mt-8 rounded-md   w-auto bg-transparent'>
                            <Image src={product.image_url} alt={product.name} width={400} height={300} className='shadow-[#292322] shadow-md w-[50%] autofill bg-cover mx-auto' />
                        </div>

                        {isOpen && (
                            <div className='w-[90%] mt-0 mx-auto bg-[#F5CC60] p-2 rounded-lg '>
                                <h2 className='text-2xl font-bold text-[#292322] mb-2 mt-4'>Avis des clients :</h2>

                                {avisList.map((avis) => (
                                    <div key={avis.id} className='mb-4 p-4 bg-[#292322]/10 rounded-lg'>
                                        <p className='text-sm italic text-[#292322]/70'>Par : <strong>{avis.user.username}</strong></p>
                                        <p className='text-[#292322]'>{avis.comment}</p>
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= avis.note ? 'text-yellow-400' : 'text-[#292322]/30'}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                            <span className="ml-1 text-sm text-[#292322]/70">/5</span>
                                        </div>
                                        <p className='text-[#292322]'>Note : {avis.note} / 5</p>
                                    </div>
                                ))}

                            </div>
                        )}

                        <div className='flex text-[#292322]  relative flex-col items-start p-4'>
                            {/* <h1>Catégorie : {product.category?.name || 'Aucune'}</h1> */}
                            <p className='px-4 py-4'>Description : {product.description}</p>
                            {product.stock_quantity > 0 ? <h1 className='px-4 py-4 text-green-800'>Stock : {product.stock_quantity}</h1> : <h1 className='px-4 py-4 text-red-800 font-extrabold'>Épuisé :</h1>}
                            <h2 className='px-4 py-4 absolute bottom-0 right-0 font-bold text-[#292322] text-4xl'>Prix : {product.price} €</h2>
                            {/* Add more product fields as needed */}
                            <p className='px-4 py-4 text-xs italic'>Ref : {product.id}.</p>

                            <button onClick={handleAddToCart}
                                className={`
                                            ${product.stock_quantity <= 0 ?
                                        "disabled flex-1 bg-[#5c5c5c]  text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center whitespace-nowrap"
                                        :
                                        "flex-1 bg-[#242124] hover:bg-[#3e3e3e] text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center whitespace-nowrap"}
                                            `}>
                                <svg className=" w-5 h-5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
                                </svg>
                                Ajouter au panier
                            </button>
                            {!viewAvis &&
                                <p className='px-4 py-4 text-sm italic text-red-500'>Il n'y a pas encore d'avis sur ce produit.</p>
                            }

                            {viewAvis &&
                                <button onClick={voirAvis}
                                    className="mt-4 bg-[#242124] hover:bg-[#3e3e3e] text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center whitespace-nowrap">
                                    Voir les avis
                                </button>
                            }
                        </div>


                    </div>
                </div>
            </main>
        </>

    )
}

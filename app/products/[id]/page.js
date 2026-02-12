"use client"
import React, { use, useState, useEffect } from 'react'
import Image from 'next/image';
import NavBar from '@/app/components/NavBar';
import { jwtDecode } from 'jwt-decode'
import { useCart } from '../../components/CartContext';
export default function productId({ params }) {
    const { id } = use(params);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
    };

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
                            <Image src={product.image_url} alt={product.name} width={400} height={300} className='w-[50%] autofill bg-cover   mx-auto' />

                        </div>
                        <div className='flex text-[#292322] relative flex-col items-start p-4'>
                            {/* <h1>Catégorie : {product.category?.name || 'Aucune'}</h1> */}
                            <h1 className='px-4 py-4'>Description : {product.description}</h1>
                            {product.stock_quantity > 0 ? <h1 className='px-4 py-4 text-green-800'>Stock : {product.stock_quantity}</h1> : <h1 className='px-4 py-4 text-red-800 font-extrabold'>Épuisé</h1>}
                            <h2 className='px-4 py-4 absolute bottom-0 right-0 font-bold text-[#292322] text-4xl'>Prix : {product.price} €</h2>
                            {/* Add more product fields as needed */}
                            <p className='px-4 py-4 text-xs italic'>Ref : {product.id}.</p>
                            <button onClick={handleAddToCart} className="px-4 py-4 bg-[#292322] hover:bg-[#2b2827] text-white font-medium   rounded-lg transition-colors duration-200 flex items-center justify-center whitespace-nowrap">
                                <svg className=" w-5 h-5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
                                </svg>
                                Ajouter au panier
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

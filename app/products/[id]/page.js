"use client"
import React, { use, useState, useEffect } from 'react'

export default function productId({ params }) {
    const { id } = use(params);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div>
            <h1>Product Details</h1>
            <div>Product ID: {product.id}</div>
            <div>Name: {product.name}</div>
            {/* Add more product fields as needed */}
        </div>
    )
}

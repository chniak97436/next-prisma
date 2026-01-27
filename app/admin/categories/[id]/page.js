'use client';
import React, { useState, useEffect, use } from 'react';

export default function categoriesId({ params }) {
    const { id } = use(params);
    const categoryId = parseInt(id, 10);

    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    if (isNaN(categoryId)) {
        return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">ID de catégorie invalide.</div>;
    }

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await fetch(`/api/categories/${categoryId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setCategory(data.data);
                } else {
                    console.error("Erreur lors de la récupération de la catégorie:", res.statusText);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de la catégorie:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [categoryId]);

    if (loading) {
        return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">Chargement...</div>;
    }

    if (!category) {
        return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">Catégorie non trouvée.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Détails de la Catégorie</h1>
                <div className="p-6 border rounded-lg shadow-lg bg-white">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{category.name}</h2>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <p className="text-sm text-gray-500">ID: {category.id}</p>
                    {category.parent_id && <p className="text-sm text-gray-500">Parent ID: {category.parent_id}</p>}
                </div>
            </div>
        </div>
    );
}

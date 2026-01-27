"use client"
import React from 'react'
import { useState,useEffect } from 'react'

export default function createProduct() {

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [stock_Quantity, setStock_Quantity] = useState('')
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const createdAt = new Date().toISOString()

    useEffect(() => {
        categoryOptions();
    }, []);
    const categoryOptions = async () => {
        const response = await fetch('/api/categories', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
         const data = await response.json();
        setCategories(data.data);

    }
    

    const productSubmit = async (e) => {
        e.preventDefault()
        if (!name || !description || !price || !stock_Quantity || !selectedCategory) {
            alert('Tous les champs sont requis');
            return;
        }
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('stock_Quantity', stock_Quantity);
        formData.append('category', selectedCategory);
        formData.append('createdAt', createdAt);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        const res = await fetch('/api/products', {
            method: 'POST',
            body: formData
        });
        if (res.ok) {
            console.log("Produit créé avec succès");
        } else {
            console.error("Erreur lors de la création du produit:", res.statusText);
        }
    };

  return (
    <div className="w-[70%] mx-auto mt-20 p-4">
      <h1 className="text-2xl font-bold mb-4">Créer un nouveau produit</h1>
      <form onSubmit={productSubmit} encType="multipart/form-data" className="space-y-4 border p-4 rounded shadow-md bg-zinc-100">
        <div className="space-y-4 border p-4 rounded shadow-md">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="space-y-4 border p-4 rounded shadow-md">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="space-y-4 border p-4 rounded shadow-md">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Prix</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="space-y-4 border p-4 rounded shadow-md">
          <label htmlFor="stock_Quantity" className="block text-sm font-medium text-gray-700">Quantité en stock</label>
          <input
            type="number"
            id="stock_Quantity"
            value={stock_Quantity}
            onChange={(e) => setStock_Quantity(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="space-y-4 border p-4 rounded shadow-md">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Catégorie</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Sélectionner une catégorie</option>
           { categories.map((cate) => (
                <option key={cate.id} value={cate.id}>{cate.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-4 border p-4 rounded shadow-md">
          <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">Image du produit</label>
          <input
            type="file"
            id="imageFile"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <button type='submit' className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
          Créer le produit
        </button>

      </form>
    </div>
  )
}

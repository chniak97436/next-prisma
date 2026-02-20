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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Créer un nouveau produit</h1>
          <p className="text-gray-600 mt-1">Ajoutez un nouveau produit à votre plateforme</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={productSubmit} encType="multipart/form-data" className="space-y-6">
            
            {/* Nom */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#F5CC60] mb-2">Nom du produit</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-[#F5CC60]/30 bg-[#292322]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5CC60] focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md text-[#F5CC60] placeholder-[#F5CC60]/50"
                placeholder="Entrez le nom du produit"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[#F5CC60] mb-2">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="4"
                className="w-full px-4 py-3 border border-[#F5CC60]/30 bg-[#292322]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5CC60] focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md text-[#F5CC60] placeholder-[#F5CC60]/50"
                placeholder="Entrez la description du produit"
              ></textarea>
            </div>

            {/* Prix */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-[#F5CC60] mb-2">Prix (€)</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-[#F5CC60]/30 bg-[#292322]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5CC60] focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md text-[#F5CC60] placeholder-[#F5CC60]/50"
                placeholder="Entrez le prix"
              />
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock_quantity" className="block text-sm font-medium text-[#F5CC60] mb-2">Quantité en stock</label>
              <input
                type="number"
                id="stock_quantity"
                value={stock_Quantity}
                onChange={(e) => setStock_Quantity(e.target.value)}
                required
                min="0"
                className="w-full px-4 py-3 border border-[#F5CC60]/30 bg-[#292322]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5CC60] focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md text-[#F5CC60] placeholder-[#F5CC60]/50"
                placeholder="Entrez la quantité"
              />
            </div>

            {/* Catégorie */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-[#F5CC60] mb-2">Catégorie</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
                className="w-full px-4 py-3 border border-[#F5CC60]/30 bg-[#292322]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5CC60] focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md text-[#F5CC60]"
              >
                <option value="" className="bg-[#292322]">Sélectionnez une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[#292322]">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-[#F5CC60] mb-2">Image du produit</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full px-4 py-3 border border-[#F5CC60]/30 bg-[#292322]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5CC60] focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md text-[#F5CC60]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#F5CC60] text-[#292322] font-semibold py-3 px-6 rounded-lg hover:bg-[#F5CC60]/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Créer le produit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


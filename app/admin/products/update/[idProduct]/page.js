"use client"
import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';

export default function updateProduct({ params }) {
  const { idProduct } = use(params);
  const productId = parseInt(idProduct, 10);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock_quantity, setStock_quantity] = useState('');
  const [category_id, setCategory_id] = useState('');
  const [image_url, setImage_url] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true);
      try {
        // Fetch product data
        const productRes = await fetch(`/api/products/${productId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (productRes.ok) {
          const productData = await productRes.json();
          const product = productData.data;
          setName(product.name || '');
          setDescription(product.description || '');
          setPrice(product.price?.toString() || '');
          setStock_quantity(product.stock_quantity?.toString() || '');
          setCategory_id(product.category_id?.toString() || '');
          setImage_url(product.image_url || '');
        }

        // Fetch categories
        const categoriesRes = await fetch('/api/categories', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData.data || []);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const updateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Form submitted for productId:', productId);
    console.log('Form data:', { name, description, price, stock_quantity, category_id, image_url });

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          stock_quantity: parseInt(stock_quantity, 10),
          category_id: category_id ? parseInt(category_id, 10) : null,
          image_url
        }),
      });

      console.log('PUT response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('PUT success data:', data);
        alert("Produit modifié avec succès.");
        router.push('/admin/products');
      } else {
        const data = await response.json();
        console.error("Erreur lors de la modification du produit:", data.message || response.statusText);
        alert("Erreur lors de la modification du produit: " + (data.message || response.statusText));
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert("Erreur lors de la modification du produit");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Modifier le Produit</h1>
        
        <form className="p-6 border rounded-lg shadow-lg bg-white" onSubmit={updateProduct}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Nom du produit</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Prix</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Quantité en stock</label>
              <input
                type="number"
                value={stock_quantity}
                onChange={(e) => setStock_quantity(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Catégorie</label>
            <select
              value={category_id}
              onChange={(e) => setCategory_id(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">URL de l'image</label>
            <input
              type="text"
              value={image_url}
              onChange={(e) => setImage_url(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {image_url && (
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Aperçu de l'image</label>
              <img 
                src={image_url} 
                alt="Aperçu du produit" 
                className="w-48 h-48 object-cover border rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/192x192?text=Image+non+disponible';
                }}
              />
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
            
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

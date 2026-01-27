"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '../../components/auth/Button';
import Image from 'next/image';
import { Package, Euro, Archive, Eye, Edit, Trash2, Plus, Tag } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setProducts(data.data);
        } else {
          console.error("Erreur lors de la récupération des produits:", res.statusText);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const deleteProduct = async (productId) => {
    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        console.log(products)
        setProducts(products.filter(prod => prod.id !== productId));
      } else {
        console.error("Erreur lors de la suppression du produit:", res.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);
    }
  };

  const update = (productId) => {
    // Placeholder for update functionality
    console.log('Update product:', productId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
            <p className="text-gray-600 mt-1">Gérez tous les produits de votre plateforme</p>
          </div>
          <Link
            href="/admin/products/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter Produit
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 group">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-200">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Archive className="w-4 h-4 mr-1" />
                    <span>Stock: {product.stock_quantity}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <Image
                  src={product.image_url || '/placeholder.jpg'}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                <div className="flex items-center text-lg font-semibold text-gray-900">
                  <Euro className="w-4 h-4 mr-1" />
                  <span>{product.price}€</span>
                </div>
                {product.category && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag className="w-4 h-4 mr-1" />
                    <span>{product.category.name}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  as={Link}
                  href={`/admin/products/update/${product.id}`}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Voir
                </Button>
                <Button
                  onClick={() => update(product.id)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors duration-200"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Modifier
                </Button>
                <Button
                  onClick={() => deleteProduct(product.id)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600">Commencez par ajouter votre premier produit.</p>
          </div>
        )}
      </div>
    </div>
  );
}

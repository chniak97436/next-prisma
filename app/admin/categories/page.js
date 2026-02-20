"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '../../components/auth/Button';
import { Tag, Eye, Edit, Trash2, Plus } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setCategories(data.data);
        } else {
          console.error("Erreur lors de la récupération des catégories:", res.statusText);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const deleteCategory = async (categoryId) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryId }),
      });
      if (res.ok) {
        setCategories(categories.filter(cat => cat.id !== categoryId));
      } else {
        console.error("Erreur lors de la suppression de la catégorie:", res.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie:", error);
    }
  };

  const update = (categoryId) => {
    // Placeholder for update functionality
    console.log('Update category:', categoryId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5CC60]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#292322] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#F5CC60]">Gestion des Catégories</h1>
            <p className="text-[#F5CC60]/70 mt-1">Gérez toutes les catégories de votre plateforme</p>
          </div>
          <Link
            href="/admin/categories/create"
            className="inline-flex items-center px-4 py-2 bg-[#F5CC60] text-[#292322] font-semibold rounded-lg hover:bg-[#F5CC60]/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter Catégorie
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-[#F5CC60] rounded-xl shadow-sm border border-[#F5CC60]/20 p-6 hover:shadow-md transition-shadow duration-200 group">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-[#292322]/20 rounded-lg group-hover:bg-[#292322]/30 transition-colors duration-200">
                  <Tag className="w-6 h-6 text-[#292322]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#292322]">{category.name}</h3>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-[#292322]/70">{category.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button
                  as={Link}
                  href={`/admin/categories/${category.id}`}
                  className="flex-1 inline-flex items-center justify-center p-3 bg-[#292322]/20 text-[#292322] font-medium rounded-lg hover:bg-[#292322]/30 transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Voir"
                >
                  <Eye className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => update(category.id)}
                  className="flex-1 inline-flex items-center justify-center p-3 bg-[#292322] text-[#F5CC60] font-medium rounded-lg hover:bg-[#292322]/90 transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Modifier"
                >
                  <Edit className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => deleteCategory(category.id)}
                  className="flex-1 inline-flex items-center justify-center p-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-16 h-16 text-[#F5CC60]/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#F5CC60] mb-2">Aucune catégorie trouvée</h3>
            <p className="text-[#F5CC60]/70">Commencez par ajouter votre première catégorie.</p>
          </div>
        )}
      </div>
    </div>
  );
}

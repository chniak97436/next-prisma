"use client"
import { useState, useEffect } from 'react';
import AuthForm from '../../../components/auth/AuthForm';
import Button from '../../../components/auth/Button';
import Link from 'next/link';

export default function addCategories() {

  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

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
        setLoadingCategories(false);
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
  const formSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsSuccess(null);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ catName, catDesc }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setIsSuccess(true);
        setCatName('');
        setCatDesc('');
      } else {
        setMessage(data.message || 'Une erreur inconnue s\'est produite.');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Erreur de réseau. Veuillez réessayer.');
      setIsSuccess(false);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <AuthForm
            title="Ajouter une nouvelle catégorie"
            onSubmit={formSubmit}
            errorMessage={isSuccess === false ? message : ''}
            successMessage={isSuccess === true ? message : ''}
        >
            <div className='animate-fade-in'>
                <label className='block text-gray-700 mb-2 font-medium' htmlFor="catName">Nom de la catégorie</label>
                <input
                  type="text"
                  id="catName"
                  name="catName"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md'
                  placeholder="Entrez le nom de la catégorie"
                />
              </div>
              <div className='animate-fade-in' style={{animationDelay: '0.1s'}}>
                <label className='block text-gray-700 mb-2 font-medium' htmlFor="catDesc">Description de la catégorie</label>
                <textarea
                  id="catDesc"
                  name="catDesc"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md resize-none'
                  rows="4"
                  placeholder="Entrez la description de la catégorie"
                />
              </div>
            <Button disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Enregistrement...
                  </div>
                ) : (
                  'Ajouter la catégorie'
                )}
            </Button>
        </AuthForm>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Catégories existantes</h2>
          {loadingCategories && <p className="text-center text-gray-500">Chargement...</p>}
          {categories.length === 0 && !loadingCategories && <p className="text-center text-gray-500">Aucune catégorie trouvée.</p>}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={category.id} className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex space-x-2 justify-center">
                  <Button onClick={() => deleteCategory(category.id)} type="button">Supprimer</Button>
                  <Button onClick={() => update(category.id)} type="button">Modifier</Button>
                  <Button as={Link} href={`/admin/categories/${category.id}`} type="button">Voir</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

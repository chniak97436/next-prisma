"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  Tag,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    categories: 0,
    orders: 0,
    reviews: 0,
    payments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching stats - replace with actual API calls
    const fetchStats = async () => {
      try {
        // Fetch users count
        const usersRes = await fetch('/api/users');
        const usersData = await usersRes.json();
        const usersCount = usersData.data.length || 0;

        // Fetch products count
        const productsRes = await fetch('/api/products');
        const productsData = await productsRes.json();
        const productsCount = productsData.data.length || 0;

        // Fetch categories count
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();
        const categoriesCount = categoriesData.data.length || 0;

        // Fetch reviews count
        const reviewsRes = await fetch('/api/avis');
        const reviewsData = await reviewsRes.json();
        const reviewsCount = reviewsData.data.length || 0;

        setStats({
          users: usersCount,
          products: productsCount,
          categories: categoriesCount,
          orders: 0, // Placeholder
          reviews: reviewsCount,
          payments: 0 // Placeholder
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Utilisateurs',
      value: stats.users,
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Produits',
      value: stats.products,
      icon: Package,
      href: '/admin/products',
      color: 'bg-green-500'
    },
    {
      title: 'Catégories',
      value: stats.categories,
      icon: Tag,
      href: '/admin/categories',
      color: 'bg-purple-500'
    },
    {
      title: 'Commandes',
      value: stats.orders,
      icon: ShoppingCart,
      href: '/admin/commandes',
      color: 'bg-orange-500'
    },
    {
      title: 'Paiements',
      value: stats.payments,
      icon: CreditCard,
      href: '/admin/payments',
      color: 'bg-red-500'
    },
    {
      title: 'Avis',
      value: stats.reviews,
      icon: MessageSquare,
      href: '/admin/avis',
      color: 'bg-indigo-500'
    }
  ];
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Bienvenue dans votre panneau d'administration</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Activity className="w-4 h-4" />
            <span>Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">+12%</span>
                <span className="text-gray-500 ml-1">vs mois dernier</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/products/create"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Package className="w-5 h-5 text-blue-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">Nouveau produit</span>
          </Link>
          <Link
            href="/admin/categories/create"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Tag className="w-5 h-5 text-purple-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">Nouvelle catégorie</span>
          </Link>
          <Link
            href="/admin/users/create"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Users className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">Nouvel utilisateur</span>
          </Link>
          <Link
            href="/admin/commandes"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <ShoppingCart className="w-5 h-5 text-orange-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">Voir commandes</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Activité récente</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm text-gray-600">Nouveau produit ajouté: "iPhone 15"</p>
            <span className="text-xs text-gray-400">il y a 2h</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm text-gray-600">Nouvel utilisateur inscrit: john@example.com</p>
            <span className="text-xs text-gray-400">il y a 4h</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <p className="text-sm text-gray-600">Commande #1234 passée</p>
            <span className="text-xs text-gray-400">il y a 6h</span>
          </div>
        </div>
      </div>
    </div>
  );
}

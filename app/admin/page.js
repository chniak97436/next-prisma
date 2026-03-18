"use client"
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  Tag,
  MailCheck,
  Activity,
  LogOut
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    categories: 0,
    commande: 0,
    reviews: 0,
    payments: 0,
    newsletter: 0
  });

  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [oauthProcessed, setOauthProcessed] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  console.log('=== COMPOSANT RENDU ===');
  console.log('authLoading:', authLoading, 'loading:', loading, 'user:', user, 'oauthProcessed:', oauthProcessed);

  // Gestion du token depuis l'URL (Google OAuth)
  useEffect(() => {
    console.log('=== PREMIER USEEFFECT - Traitement OAuth ===');
    console.log('URL complète:', window.location.href);
    
    // Récupérer les paramètres de l'URL
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const role = searchParams.get('role');
    const idUser = searchParams.get('id')
    
    console.log('Données de l\'URL:', { 
      token: token ? token.substring(0, 20) + '...' : null, 
      email, 
      name, 
      role,
      idUser 
    });

    // Si pas de token dans l'URL, marquer comme traité immédiatement
    if (!token) {
      console.log('Pas de token OAuth dans l\'URL');
      setOauthProcessed(true);
      return;
    }

    // Stocker le token si présent
    console.log('STOCKAGE DANS LOCALSTORAGE');
    localStorage.setItem('token', token);
    if (email) localStorage.setItem('email', email);
    if (name) localStorage.setItem('name', name);
    if (role) localStorage.setItem('role', role);
    if (idUser) localStorage.setItem('id', idUser)
    
    console.log('Vérification après stockage:');
    console.log('localStorage token:', localStorage.getItem('token')?.substring(0, 20) + '...');
    console.log('localStorage email:', localStorage.getItem('email'));
    console.log('localStorage role:', localStorage.getItem('role'));
    
    // Marquer comme traité AVANT la redirection
    setOauthProcessed(true);
    
    // Nettoyer l'URL après un court délai
    setTimeout(() => {
      
      router.replace('/admin');
    }, 100);
  }, [searchParams, router]);

  // Vérification de l'authentification - attend que oauthProcessed soit true
  useEffect(() => {
    // Attendre que le traitement OAuth soit terminé
    if (!oauthProcessed) {
      console.log('En attente du traitement OAuth...');
      return;
    }

    console.log('=== DEUXIÈME USEEFFECT - Vérification Auth ===');
    
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const email = localStorage.getItem('email');
      const idUser = localStorage.getItem('id')
      console.log('Vérification auth - token:', !!token, 'role:', role, 'email:', email, 'id:',idUser);

      if (!token) {
        console.log('Pas de token, redirection vers login');
        router.push('/login');
        return;
      }

      // Vérifier si l'utilisateur est admin OU si c'est votre email
      if (role !== 'admin' && email !== 'urbaniak.n78@gmail.com') {
        console.log('Accès non autorisé - redirection vers accueil');
        router.push('/');
        return;
      }

      // Récupérer les infos de l'utilisateur
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        console.log('Token décodé:', tokenData);
        setUser({
          email: tokenData.email || email,
          role: tokenData.role || role
        });
      } catch (e) {
        console.error('Error decoding token:', e);
        // Fallback aux données du localStorage
        setUser({
          email: email,
          role: role
        });
      }

      setAuthLoading(false);
    };

    checkAuth();
  }, [oauthProcessed, router]);

  // Fetch des statistiques
  useEffect(() => {
    if (authLoading) return;

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        console.log('Fetching stats with token:', !!token);

        // Fetch users count
        const usersRes = await fetch('/api/users', { headers });
        if (!usersRes.ok) throw new Error(`HTTP ${usersRes.status}`);
        const usersData = await usersRes.json();
        const usersCount = usersData.data?.length || 0;

        // Fetch products count
        const productsRes = await fetch('/api/products', { headers });
        const productsData = await productsRes.json();
        const productsCount = productsData.data?.length || 0;

        // Fetch categories count
        const categoriesRes = await fetch('/api/categories', { headers });
        const categoriesData = await categoriesRes.json();
        const categoriesCount = categoriesData.data?.length || 0;

        // Fetch commandes count
        const commandesRes = await fetch('/api/commande', { headers });
        const commandesData = await commandesRes.json();
        const commandesCount = commandesData?.data?.length || 0;

        // Fetch payment count
        const paymentRes = await fetch('/api/payment', { headers });
        const paymentData = await paymentRes.json();
        const paymentsCount = paymentData?.data?.length || 0;

        // Fetch avis count
        const reviewsRes = await fetch('/api/avis', { headers });
        const reviewsData = await reviewsRes.json();
        const reviewsCount = reviewsData.data?.length || 0;

        // Fetch newsletter count
        const newsletterRes = await fetch('/api/newsletter', { headers });
        const newsletterData = await newsletterRes.json();
        const newsletterCount = newsletterData.data?.length || 0;

        setStats({
          users: usersCount,
          products: productsCount,
          categories: categoriesCount,
          commande: commandesCount,
          reviews: reviewsCount,
          payments: paymentsCount,
          newsletter: newsletterCount
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Si erreur 401, rediriger vers login
        if (error.message.includes('401')) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('email');
          localStorage.removeItem('name');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [authLoading, router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5CC60]"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Utilisateurs',
      value: stats.users,
      icon: Users,
      href: '/admin/users',
      color: 'bg-primary'
    },
    {
      title: 'Produits',
      value: stats.products,
      icon: Package,
      href: '/admin/products',
      color: 'bg-secondary'
    },
    {
      title: 'Catégories',
      value: stats.categories,
      icon: Tag,
      href: '/admin/categories',
      color: 'bg-secondary'
    },
    {
      title: 'Commandes',
      value: stats.commande,
      icon: ShoppingCart,
      href: '/admin/commandes',
      color: 'bg-accent'
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
      color: 'bg-primary'
    },
    {
      title: 'Newsletter',
      value: stats.newsletter,
      icon: MailCheck,
      href: '/admin/newsletter',
      color: 'bg-green-500'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header avec informations utilisateur */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#F5CC60]">Tableau de bord</h1>
          <p className="text-[#F5CC60]/70 mt-1">
            Bienvenue, {user?.email || 'Administrateur'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-[#F5CC60]/70">
            <Activity className="w-4 h-4" />
            <span>Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
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
              className="bg-[#F5CC60] rounded-xl shadow-sm border border-[#F5CC60]/20 p-6 hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#292322]/70">{card.title}</p>
                  <p className="text-3xl font-bold text-[#292322] mt-2">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-[#292322] group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6 text-[#F5CC60]" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
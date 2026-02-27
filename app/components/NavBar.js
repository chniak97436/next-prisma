"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin, isCustomer } from '../../lib/utils/auth';
import { useCart } from './CartContext';
import { jwtDecode } from 'jwt-decode';

export default function NavBar({ user: propUser }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    categories: []
  });
  const [user, setUser] = useState(null);
  const { getTotalItems, clearCart } = useCart();

  // Check localStorage for user on mount and when propUser changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.id || decoded.userId || decoded.sub,
          name: decoded.name?.name || decoded.name || '',
          role: decoded.name?.role || decoded.role || '',
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [propUser]);

  const GoToCart = () => {
    router.push("/cart")
  }

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', { method: 'GET' });
      
      // Clear localStorage (cart and any other client-side data)
      localStorage.clear();
      
      // Clear user state
      setUser(null);
      // Clear cart context
      clearCart();
      // Redirect to login
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch categories 
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();
        const categoriesNav = categoriesData.data || [];
        // use categoriesNav as needed
        setStats({
          categories: categoriesNav
        });
        console.log("categoriesStats : ", categoriesNav);

      } catch (error) {
        console.error('Error fetching categories for NavBar:', error);
      }
    };

    fetchAllData();
  }, []);

  const admin = isAdmin(user?.role);

  return (
    <nav className="glass-strong text-white shadow-2xl animate-slide-in-left fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold hover:text-yellow-300 transition-all duration-300 transform hover:scale-110 animate-glow">
              <div className=" rounded p-1">
                <img src="/logo.png" alt="Logo" className="h-12 rounded-full -p-4 w-full bg-[#242124]" />
              </div>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:bg-white hover:bg-opacity-10">
              Accueil
            </Link>
            <Link href="/products" className="hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:bg-white hover:bg-opacity-10">
              Tous les produits
            </Link>
            {/* {(!user || isCustomer(user?.role)) && (
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    router.push(`/categories/${e.target.value}`);
                  }
                }}
                className="bg-transparent text-white border border-white  px-3 py-2 text-sm font-medium transition-all duration-300"
                defaultValue=""
              >
                <option className="text-black bg-transparent " value="" disabled>Choisir une catégorie</option>

                {stats.categories.map((category) => (
                  <option key={category.id} value={category.name} className='text-black border-none bg-transparent'>
                    {category.name}
                  </option>
                ))}
              </select>
            )} */}
            {!user ? (
              <>
                <Link href="/login" className="hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:bg-white hover:bg-opacity-10">
                  Connexion
                </Link>
                <Link href="/register" className="hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:bg-white hover:bg-opacity-10">
                  Inscription
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm animate-pulse-custom bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-semibold">
                  Bienvenue, {user?.name || 'Utilisateur'}
                </span>
                {admin ? (
                  <div>
                    <Link href="/admin" className="hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:bg-white hover:bg-opacity-10">
                      Admin
                    </Link>
                    <button onClick={handleLogout} className="hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:bg-white hover:bg-opacity-10">
                      Deconnexion
                    </button>
                  </div>
                ) : (
                  <button onClick={handleLogout} className="hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:bg-white hover:bg-opacity-10">
                    Deconnexion
                  </button>
                )}
                {getTotalItems() > 0 && (
                  <div className="relative">
                    <button onClick={GoToCart}>
                      <svg className="h-6 w-6 text-white hover:text-yellow-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
                      </svg>
                    </button>
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-yellow-300 focus:outline-none focus:text-yellow-300 transition-colors duration-300"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path fillRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 0 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
                ) : (
                  <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden animate-slide-in-left">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white bg-opacity-10 rounded-lg mt-2 backdrop-blur-sm">
              <Link href="/" className="block text-gray-500 hover:text-black px-3 py-2  text-base font-medium transition-all duration-300">
                Accueil
              </Link>
              <Link href="/products" className="text-gray-500 hover:text-black px-3 py-2  text-sm font-medium transition-all duration-300 transform hover:scale-105 ">
                Tous les produits
              </Link>
              {(!user || isCustomer(user?.role)) && (
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      router.push(`/categories/${e.target.value}`);
                    }
                  }}
                  className="block w-full bg-transparent text-white border border-white rounded-md px-3 py-2 text-base font-medium hover:bg-white hover:bg-opacity-10 transition-all duration-300"
                  defaultValue=""
                >
                  <option value="" disabled>Choisir une catégorie</option>
                  {stats.categories.map((category) => (
                    <option key={category.id} value={category.id} className="text-black">
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
              {!user ? (
                <>
                  <Link href="/login" className="block hover:text-yellow-300 px-3 py-2 rounded-md text-base font-medium transition-all duration-300">
                    Connexion
                  </Link>
                  <Link href="/register" className="block hover:text-yellow-300 px-3 py-2 rounded-md text-base font-medium transition-all duration-300">
                    Inscription
                  </Link>
                </>
              ) : (
                <>
                  <span className="block px-3 py-2 text-base font-medium text-green-300">
                    Bienvenue, {user?.name || 'Utilisateur'}
                  </span>
                  {admin && (
                    <Link href="/admin" className="block hover:text-yellow-300 px-3 py-2 rounded-md text-base font-medium transition-all duration-300">
                      Admin
                    </Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left hover:text-yellow-300 px-3 py-2 rounded-md text-base font-medium transition-all duration-300">
                    Deconnexion
                  </button>
                  {getTotalItems() > 0 && (
                    <div className="flex items-center px-3 py-2">
                      <svg className="h-6 w-6 text-gray-500 hover:text-black transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
                      </svg>
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

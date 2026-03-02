'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import NavBar from '../components/NavBar';
import AdminSidebar from '../components/AdminSidebar';
import { isAdmin } from '../../lib/utils/auth';

export default function AdminLayout({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Gestion du token depuis l'URL (Google OAuth) - copie du token vers localStorage
  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const role = searchParams.get('role');

    if (token) {
      console.log('=== LAYOUT: Stockage token OAuth ===');
      localStorage.setItem('token', token);
      if (email) localStorage.setItem('email', email);
      if (name) localStorage.setItem('name', name);
      if (role) localStorage.setItem('role', role);
    }
  }, [searchParams]);

  // Vérification de l'authentification
  useEffect(() => {
    // Petit délai pour laisser le temps au token d'être stocké
    const timer = setTimeout(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const decoded = jwtDecode(token);
        if (decoded && isAdmin(decoded.role)) {
          setIsAuthorized(true);
          setUser(decoded);
        } else {
          // Non-admin users are redirected to home page, not login
          router.push('/');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#292322]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5CC60]"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // This shouldn't happen due to redirect, but just in case
  }

  return (
    <div className="min-h-screen bg-[#292322]">
      <NavBar user={user} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-64 mt-16 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { isAdmin } from '../../lib/utils/auth';

export default function HandleAuth({ setAuth, setLoading, setUser }) {
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
            setAuth(true);
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
  }, [router, setAuth, setLoading, setUser]);

  return null;
}
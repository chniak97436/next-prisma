'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';
import NavBar from '../components/NavBar';
import AdminSidebar from '../components/AdminSidebar';
import { isAdmin } from '../../lib/utils/auth';

export default function AdminLayout({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded = jwt.decode(token);
      if (decoded && isAdmin(decoded.role)) {
        setIsAuthorized(true);
        setUser(decoded);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // This shouldn't happen due to redirect, but just in case
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

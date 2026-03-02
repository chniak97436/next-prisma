'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '../components/NavBar';
import AdminSidebar from '../components/AdminSidebar';
import HandleAuth from './HandleAuth';


export default function AdminLayout({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#292322]">
       <Suspense fallback={<div>Loading...</div>}>
        <HandleAuth setAuth={setIsAuthorized} setLoading={setLoading} setUser={setUser} />
      </Suspense>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5CC60]"></div>
        </div>
      ) : isAuthorized ? (
        <>
          <NavBar user={user} />
          <div className="flex">
            <AdminSidebar />
            <main className="flex-1 ml-64 mt-16 p-8">
              {children}
            </main>
          </div>
        </>
      ) : null}
    </div>
  );
}

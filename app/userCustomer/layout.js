'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '../components/NavBar';
import UserSideBar from '../components/UserSideBar';


export default function UserCustomerLayout({ children }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#292322]">
            <NavBar />
            <div className="flex">
                <UserSideBar />
                <main className="flex-1 ml-64 mt-16 p-8">
                    { children }
                </main>
            </div>
        </div>
    );
}

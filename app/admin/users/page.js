"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Button from '@/app/components/auth/Button';
import { User, Mail, Shield, Eye, Edit, Trash2, Plus } from 'lucide-react';
export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                
                if (data.data) {
                    setUsers(data.data);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);



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
                        <h1 className="text-3xl font-bold text-[#F5CC60]">Gestion des Utilisateurs</h1>
                        <p className="text-[#F5CC60]/70 mt-1">Gérez tous les utilisateurs de votre plateforme</p>
                    </div>
                    <Link
                        href="/admin/users/create"
                        className="inline-flex items-center px-4 py-2 bg-[#F5CC60] text-[#292322] font-semibold rounded-lg hover:bg-[#F5CC60]/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Ajouter Utilisateur
                    </Link>
                </div>

                {/* Users Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map(user => (
                        <div key={user.id} className="bg-[#F5CC60] rounded-xl shadow-sm border border-[#F5CC60]/20 p-6 hover:shadow-md transition-shadow duration-200 group">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="p-3 bg-[#292322]/20 rounded-lg group-hover:bg-[#292322]/30 transition-colors duration-200">
                                    <User className="w-6 h-6 text-[#292322]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-[#292322]">{user.username}</h3>
                                    <div className="flex items-center text-sm text-[#292322]/70">
                                        <Shield className="w-4 h-4 mr-1" />
                                        <span className="capitalize">{user.role}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-[#292322]/70">
                                    <Mail className="w-4 h-4 mr-2" />
                                    <span>{user.email}</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                <Button
                                    as={Link}
                                    href={`/admin/users/${user.id}`}
                                    className="flex-1 inline-flex items-center justify-center p-3 bg-[#292322]/20 text-[#292322] font-medium rounded-lg hover:bg-[#292322]/30 transition-all duration-200 shadow-sm hover:shadow-md"
                                    title="Voir"
                                >
                                    <Eye className="w-5 h-5" />
                                </Button>
                                <Button
                                    as={Link}
                                    href={`/admin/users/put/${user.id}`}
                                    className="flex-1 inline-flex items-center justify-center p-3 bg-[#292322] text-[#F5CC60] font-medium rounded-lg hover:bg-[#292322]/90 transition-all duration-200 shadow-sm hover:shadow-md"
                                    title="Modifier"
                                >
                                    <Edit className="w-5 h-5" />
                                </Button>
                                <Button
                                    as={Link}
                                    href={`/admin/users/${user.id}`}
                                    className="flex-1 inline-flex items-center justify-center p-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                                    title="Supprimer"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {users.length === 0 && (
                    <div className="text-center py-12">
                        <User className="w-16 h-16 text-[#F5CC60]/40 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-[#F5CC60] mb-2">Aucun utilisateur trouvé</h3>
                        <p className="text-[#F5CC60]/70">Commencez par ajouter votre premier utilisateur.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

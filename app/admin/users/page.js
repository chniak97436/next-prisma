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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
                        <p className="text-gray-600 mt-1">Gérez tous les utilisateurs de votre plateforme</p>
                    </div>
                    <Link
                        href="/admin/users/create"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Ajouter Utilisateur
                    </Link>
                </div>

                {/* Users Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map(user => (
                        <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 group">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Shield className="w-4 h-4 mr-1" />
                                        <span className="capitalize">{user.role}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Mail className="w-4 h-4 mr-2" />
                                    <span>{user.email}</span>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <Button
                                    as={Link}
                                    href={`/admin/users/${user.id}`}
                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Voir
                                </Button>
                                <Button
                                    as={Link}
                                    href={`/admin/users/put/${user.id}`}
                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Modifier
                                </Button>
                                <Button
                                    as={Link}
                                    href={`/admin/users/${user.id}`}
                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors duration-200"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Supprimer
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {users.length === 0 && (
                    <div className="text-center py-12">
                        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
                        <p className="text-gray-600">Commencez par ajouter votre premier utilisateur.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

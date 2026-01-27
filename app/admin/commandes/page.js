
"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Button from '@/app/components/auth/Button';
import { ShoppingCart, Eye, Edit, Trash2, Plus } from 'lucide-react';

export default function Commandes() {
    const [commandes, setCommandes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCommandes = async () => {
            try {
                // TODO: Implement API call when /api/commandes is available
                // const response = await fetch('/api/commandes');
                // const data = await response.json();
                // setCommandes(data.data || []);
                setCommandes([]); // Placeholder
            } catch (error) {
                console.error('Error fetching commandes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCommandes();
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
                        <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
                        <p className="text-gray-600 mt-1">Gérez toutes les commandes de votre plateforme</p>
                    </div>
                    <Link
                        href="/admin/commandes/create"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Ajouter Commande
                    </Link>
                </div>

                {/* Commandes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {commandes.map(commande => (
                        <div key={commande.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 group">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-200">
                                    <ShoppingCart className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Commande #{commande.id}</h3>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="capitalize">{commande.status}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="text-sm text-gray-600">
                                    Total: {commande.total_amount} €
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <Button
                                    as={Link}
                                    href={`/admin/commandes/${commande.id}`}
                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Voir
                                </Button>
                                <Button
                                    as={Link}
                                    href={`/admin/commandes/${commande.id}/edit`}
                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Modifier
                                </Button>
                                <Button
                                    as={Link}
                                    href={`/admin/commandes/${commande.id}/delete`}
                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors duration-200"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Supprimer
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {commandes.length === 0 && (
                    <div className="text-center py-12">
                        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande trouvée</h3>
                        <p className="text-gray-600">Les commandes apparaîtront ici une fois créées.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

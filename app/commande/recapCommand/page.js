"use client"
import React, { useState, useEffect } from 'react'
import NavBar from '../../components/NavBar'
import { jwtDecode } from 'jwt-decode'
import { useCart } from '@/app/components/CartContext'
import { useRouter } from 'next/navigation'


export default function RecapCommande() {
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)
    const [commande, setCommande] = useState(null)
    const [paymentStatus, setPaymentStatus] = useState(null) // 'success', 'error', or null
    const [errorMessage, setErrorMessage] = useState('')
    const [message, setMessage] = useState('')
    const router = useRouter()
    const numCommande = Math.floor(Math.random() * 1000000) + 1; // Génère un numéro de commande aléatoire
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({
                    id: decoded.userId || decoded.id,
                    name: decoded.name || decoded.username || '',
                    role: decoded.role || '',
                    email: decoded.email || '',
                });
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!user) return;
        const fetchLastCommande = async () => {
            try {
                // recuperer l API pour user's commandes
                const res = await fetch(`/api/commande?userId=${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.data && data.data.length > 0) {
                        // Get la derniere commandee de l'utilisateur
                        setCommande(data.data[data.data.length - 1]);
                    }
                }
            } catch (error) {
                console.error('Error fetching commande:', error);
            }
        };
        fetchLastCommande();
    }, [user]);

    //----------------DATAIL PANIER------------
    const {
        cart,
        getTotalPrice,
        getTotalItems,
        clearCart
    } = useCart()
    console.log("recap-cart : ", cart.map((item) => {

        return item;
    }))

    //----------------POST COMMANDE----------------

    const commandeSubmit = async (e) => {
        e.preventDefault();

        try {
            const comandeId = commande.id.length > 0 ? commande.id[0] : commande.id; // Handle both array and single value
            const productId = cart.map((item) => item.id)
            const productQuantite = cart.map((item) => item.quantite)
            const priceUnique = cart.map((item) => item.price)
            const totalAmount = getTotalPrice().toFixed(2)
            console.log("productId : ", productId)
            console.log("priceUnique : ", priceUnique)
            console.log("productQuantite : ", productQuantite)
            console.log("commandeID : ", comandeId)
            const res = await fetch('/api/commandeItems/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comandeId, productId, productQuantite, priceUnique, totalAmount }),

            })
            const data = await res.json();
            if (res.ok) {
                console.log('Commande items créés avec succès:', data);
                setPaymentStatus('success');
                clearCart()
                setMessage('Votre paiement a été effectué avec succès ! Merci pour votre commande.');
                
                // Envoyer un email de confirmation (sans bloquer le processus)
                try {
                    const emailRes = await fetch('/api/send-payment-email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: user.email,
                            subject: 'Confirmation de votre commande ref : ' + numCommande,
                            text: `Bonjour ${user.name},\n\n Identifiant commande : ${comandeId}\n\n Merci pour votre commande !\n\n Votre paiement de ${totalAmount} € a été reçu avec succès. \n\nVotre commande est en cours de traitement.\n\nCordialement,\nL'équipe de votre boutique`
                        }),
                    });
                    if (!emailRes.ok) {
                        console.warn('Email de confirmation non envoyé (service SMTP non configuré)');
                    }
                } catch (emailErr) {
                    console.warn('Erreur lors de l\'envoi de l\'email:', emailErr);
                }
                
                setTimeout(() => {
                    router.push('/');
                }, 3000);


            } else {
                console.error('Erreur lors de la création des items de commande:', data);
                setErrorMessage(data.error || 'Une erreur est survenue lors de la création des items de commande.');
                setPaymentStatus('error');
            }
        } catch (err) {
            console.error('Error submitting payment:', err);
            setErrorMessage('Une erreur est survenue lors du paiement. Veuillez réessayer.');
            setPaymentStatus('error');
            return;
        }

        console.log("Paiement soumis pour la commande:", commande.length > 0 ? commande[0].id : commande.id);

    }
    //----------------UPDATE STOCK----------------
    const updateStock = async (productId, quantite) => {
        if (!productId) return;
        try {
            // First get the current product to know the current stock
            const getRes = await fetch(`/api/products/${productId}`);
            if (!getRes.ok) {
                console.error('Erreur lors de la récupération du produit:', getRes.status);
                return;
            }
            const productData = await getRes.json();
            const currentStock = productData.data.stock_quantity || 0;
            
            // Calculate new stock (current - ordered quantity)
            const newStock = currentStock - quantite;
            
            // Update with the new stock value
            const res = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stock_quantity: newStock }),
            });
            const data = await res.json();
            if (res.ok) {
                console.log('Stock mis à jour avec succès:', data);
            } else {
                console.error('Erreur lors de la mise à jour du stock:', data);
            }
        } catch (err) {
            console.error('Error updating stock:', err);
        }
    }

    if (loading) return <div className="min-h-screen bg-[#292322] flex items-center justify-center"><div className="text-[#F5CC60] text-xl">Chargement...</div></div>

    return (
        <div className='min-h-screen bg-[#292322]'>
            <NavBar user={{ name: user?.name || '' }} />
            <div className="pt-20 px-6">
                <h1 className="text-3xl text-center font-bold text-[#F5CC60] mb-10">Récapitulatif de votre commande</h1>
                {commande ? (
                    <form onSubmit={commandeSubmit} className='max-w-2xl mx-auto'>
                        {/* Card principale avec les informations de commande */}
                        <div className='bg-[#F5CC60] text-[#292322] rounded-lg shadow-2xl p-8 mb-6'>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-[#292322]/70">REF Commande</p>
                                    <p className="font-bold text-lg">#{numCommande}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-[#292322]/70">Date</p>
                                    <p className="font-medium">{new Date(commande.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-[#292322]/70">Statut</p>
                                    <span className="inline-block px-3 py-1 bg-[#292322] text-[#F5CC60] text-sm font-medium rounded-full">
                                        {commande.status}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-[#292322]/70">Montant Total</p>
                                    <p className="font-bold text-2xl text-[#292322]">{commande.total_amount} €</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-[#292322]/20">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-[#292322]/70">Nom du client</p>
                                        <p className="font-medium">{user?.name}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-[#292322]/70">Adresse de Livraison</p>
                                        <p className="font-medium">{commande.shipping_address || 'Non spécifiée'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {message ? (<div className="h-[20%] border-[#F5CC60]/70 bg-[#292322] flex items-center justify-center">
                            <div className="text-green-400 text-center text-xl">
                                {message}
                                </div>
                        </div>) : null}

                        {/* Card pour les articles */}
                        <div className='bg-[#F5CC60] text-[#292322] rounded-lg shadow-2xl p-8'>
                            <h2 className='text-xl font-bold text-center mb-6'>ARTICLES</h2>

                            {/* En-têtes du tableau */}
                            <div className='grid grid-cols-4 gap-2 pb-3 border-b-2 border-[#292322] font-bold text-sm'>
                                <div className="text-center">Article</div>
                                <div className="text-center">Prix Unit.</div>
                                <div className="text-center">Quantité</div>
                                <div className="text-center">Total</div>
                            </div>

                            {/* Liste des articles */}
                            <div className="divide-y divide-[#292322]/20">
                                {cart.map((item) => (
                                    <div key={item.id}
                                        className='grid grid-cols-4 gap-2 py-3 items-center'>
                                        <div className="font-medium text-sm">{item.name}</div>
                                        <div className="text-center text-sm">{item.price} €</div>
                                        <div className="text-center text-sm">x{item.quantite}</div>
                                        <div className="text-center font-bold text-sm">{(item.price * item.quantite).toFixed(2)} €</div>
                                    </div>
                                ))}
                            </div>

                            {/* Total général */}
                            <div className="mt-6 pt-4 border-t-2 border-[#292322] flex justify-between items-center">
                                <span className="font-bold text-lg">Total à payer</span>
                                <span className="font-bold text-2xl">{getTotalPrice().toFixed(2)} €</span>
                            </div>
                        </div>

                        {/* Bouton Payer */}
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={() => cart.forEach(item => updateStock(item.id, item.quantite))}
                                type="submit"
                                className='w-full mb-20 md:w-auto px-12 py-4 bg-[#F5CC60] text-[#292322] font-bold text-lg rounded-lg shadow-lg hover:bg-[#F5CC60]/90 hover:scale-105 transition-all duration-200 focus:ring-4 focus:ring-[#F5CC60]/50'
                            >
                                Payer
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-[#F5CC60] text-xl mb-4">Aucune commande trouvée.</p>
                        <a href="/cart" className="text-[#F5CC60] underline hover:text-[#F5CC60]/80">
                            Retour au panier
                        </a>
                    </div>
                )}

            </div>
        </div>
    )
}

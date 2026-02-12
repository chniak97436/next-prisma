"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image';
import NavBar from '@/app/components/NavBar';
import jwt from 'jsonwebtoken'
import { useCart } from './../components/CartContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const [user, setUser] = useState("");
  const router = useRouter();
  // On récupère tout ce dont on a besoin depuis le contexte
  const {
    cart,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    getTotalPrice,
    getTotalItems,
    clearCart
  } = useCart();

  // Gestion du JWT (inchangé)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt.decode(token);
        setUser({
          name: decoded.name?.name || decoded.name || '',
          role: decoded.name?.role || decoded.role || '',
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);
  console.log("Contenu du panier :", cart);

  // switch commande
  const goToPay = () => {
    router.push("/commande")
  }
  return (

      <main className="h-dvh min-w-full bg-[#242124] py-8 px-4">
        <NavBar user={{ name: user?.name, role: user?.role }} />
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Votre Panier : {user.name}</h1>

          {cart.length === 0 ? (
            <div className="text-center bg-white p-10 rounded-xl shadow">
              <p className="text-gray-600 mb-4">Votre panier est vide.</p>
              <a href="/" className="text-indigo-600 font-medium hover:underline">Continuer mes achats</a>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Liste des articles */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {cart.map((item) => (
                  /* 1. ON AJOUTE LA KEY ICI (identifiant unique de ton produit) */
                  <div key={item.id} className="flex items-center p-6 border-b last:border-b-0">

                    <div className="relative h-24 w-24 flex-shrink-0">
                      <Image
                        src={item.image_url || '/placeholder.png'}
                        /* 2. ON S'ASSURE QUE ALT EST BIEN PRÉSENT ET NON VIDE */
                        alt={`Image de ${item.name}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    {/* Détails du produit */}
                    <div className="ml-6 flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <p className="text-gray-500 text-sm">Prix unitaire : {item.price} €</p>

                      {/* Contrôles de quantité */}
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >-</button>
                        <span className="mx-4 font-medium">{item.quantite}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >+</button>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-6 text-red-500 text-sm hover:underline"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>

                    {/* Prix Total par Article */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-indigo-600">
                        {(item.price * item.quantite).toFixed(2)} €
                      </p>
                      <p className="text-xs text-gray-400">Total ligne</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Résumé du panier */}
              <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center">
                <button
                  onClick={clearCart}
                  className="text-gray-400 hover:text-red-500 text-sm mb-4 md:mb-0"
                >
                  Vider le panier
                </button>

                <div className="text-right">
                  <p className="text-gray-600">Total ({getTotalItems()} articles) :</p>
                  <p className="text-3xl font-extrabold text-gray-900">{getTotalPrice().toFixed(2)} €</p>
                  <button onClick={goToPay} className="mt-4 w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition">
                    Passer à la caisse
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

  )
}

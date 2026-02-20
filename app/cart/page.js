"use client"
import { useState, useEffect, use } from 'react'
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

  //--------------------------------------------------------------------------------------------------
  // ETAPE 1: État pour stocker le stock de chaque produit
  //--------------------------------------------------------------------------------------------------
  // On utilise un objet (ou Map) pour stocker le stock de chaque produit
  // Clé = id du produit, Valeur = quantité en stock
  // Exemple: { 1: 10, 2: 5, 3: 0 } signifie:
  //   - Produit ID 1: 10 en stock
  //   - Produit ID 2: 5 en stock
  //   - Produit ID 3: 0 en stock (épuisé)
  const [stockMap, setStockMap] = useState({});

  //--------------------------------------------------------------------------------------------------
  // ETAPE 2: Décodage du JWT pour récupérer les infos utilisateur
  //--------------------------------------------------------------------------------------------------
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

  //--------------------------------------------------------------------------------------------------
  // ETAPE 3: Fonction pour récupérer le stock de TOUS les produits du panier
  //--------------------------------------------------------------------------------------------------
  // BUG CORRIGÉ: Avant, le code faisait `cart.id` mais cart est un TABLEAU (array), pas un objet!
  // Donc cart.id était undefined → l'API retournait une erreur 400
  // 
  // Maintenant, on parcourt chaque item du panier et on récupère son stock individuellement
  const fetchStock = async () => {
    // On crée un objet vide pour stocker les stocks
    const stocks = {};

    // On parcourt chaque produit dans le panier
    for (const item of cart) {
      try {
        // On utilise l'ID de l'item (item.id) pour appeler l'API
        const response = await fetch(`./api/products/${item.id}`);

        // Si la réponse n'est pas OK, on lance une erreur
        if (!response.ok) {
          console.warn(`Erreur pour le produit ${item.id}: ${response.status}`);
          continue; // On passe au produit suivant
        }

        // On récupère les données JSON
        const data = await response.json();

        // L'API retourne { data: { ..., stock_quantity: X } }
        // On vérifie que le produit existe et qu'il a un stock_quantity
        if (data && data.data && data.data.stock_quantity !== undefined) {
          // On stocke le stock dans notre objet, en utilisant l'ID du produit comme clé
          stocks[item.id] = data.data.stock_quantity;
          console.log(`Stock du produit ${item.id} (${item.name}): ${data.data.stock_quantity}`);
        } else {
          console.warn(`Produit ${item.id} n'a pas de stock_quantity`);
        }
      } catch (error) {
        console.error(`Erreur lors de la récupération du stock pour ${item.id}:`, error);
      }
    }

    // On met à jour l'état avec tous les stocks récupérés
    setStockMap(stocks);
  };

  //--------------------------------------------------------------------------------------------------
  // ETAPE 4: useEffect pour appeler fetchStock quand le panier change
  //--------------------------------------------------------------------------------------------------
  // AVANT: fetchStock() était appelé directement dans le composant
  // → Ça causait un appel à chaque render (boucle infinie potentielle!)
  // 
  // APRÈS: On utilise useEffect qui s'exécute seulement quand 'cart' change
  useEffect(() => {
    // On n'appelle l'API que si le panier n'est pas vide
    if (cart && cart.length > 0) {
      fetchStock();
    }
  }, [cart]); // Dépendance: on re-exécute si cart change

  //--------------------------------------------------------------------------------------------------
  // ETAPE 5: Fonction pour vérifier le stock d'un produit spécifique
  //--------------------------------------------------------------------------------------------------
  // Cette fonction retourne le stock d'un produit en utilisant son ID
  // Elle retourne undefined si le stock n'est pas encore chargé
  const getProductStock = (productId) => {
    return stockMap[productId];
  };

  //--------------------------------------------------------------------------------------------------
  // ETAPE 6: Affichage des logs pour le débogage
  //--------------------------------------------------------------------------------------------------
  console.log("Contenu du panier :", cart);
  console.log("StockMap (stock de chaque produit) :", stockMap);

  //--------------------------------------------------------------------------------------------------
  // ETAPE 7: Vérification du stock pour chaque produit du panier
  //--------------------------------------------------------------------------------------------------
  // On utilise useEffect pour vérifier le stock APRÈS qu'il soit chargé
  // Cela garantit que stockMap contient les données avant la vérification

  // État pour stocker les produits avec problème de stock
  const [stockWarnings, setStockWarnings] = useState([]);

  useEffect(() => {
    // On ne vérifie que si le panier n'est pas vide et qu'on a des données de stock
    if (!cart || cart.length === 0) return;

    // Vérifier si on a au moins un produit avec un stock chargé
    const hasStockData = cart.some(item => stockMap[item.id] !== undefined);
    if (!hasStockData) return;

    // Parcourir chaque produit du panier pour vérifier le stock
    const warnings = [];

    for (const item of cart) {
      const productStock = getProductStock(item.id);
      console.log("productStock-------------------:", productStock);
      console.log("productQTE-------------------:", item.quantite);

      // On vérifie que le stock est défini et valide
      if (productStock !== undefined && productStock !== null && !isNaN(productStock)) {
        // Si la quantité dans le panier dépasse le stock disponible
        const isToMuch = item.quantite > productStock;
        if (isToMuch) {
          warnings.push({
            id: item.id,
            name: item.name,
            quantite: item.quantite,
            stock: productStock
          });
        }
      }
    }

    setStockWarnings(warnings);
  }, [cart, stockMap]); // Déclenché quand cart ou stockMap change

  // Fonction pour ajuster automatiquement la quantité au stock disponible
  const adjustQuantityToStock = (itemId) => {
    const warning = stockWarnings.find(w => w.id === itemId);
    if (warning) {
      decreaseQuantity(itemId);
    }
  };


  const goToPay = () => {
    router.push("/commande")
  }
  return (

    <main className="h-dvh min-w-full bg-[#292322] py-8 px-4">
      <NavBar user={{ name: user?.name, role: user?.role }} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#F5CC60] mb-8">Votre Panier : {user.name}</h1>

        {cart.length === 0 ? (
          <div className="text-center bg-[#F5CC60] p-10 rounded-xl shadow">
            <p className="text-[#F5CC60]/70 mb-4">Votre panier est vide.</p>
            <a href="/" className="text-[#292322] font-medium hover:underline">Continuer mes achats</a>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Liste des articles */}
            <div className="bg-[#F5CC60] rounded-xl shadow-sm overflow-hidden">
              {cart.map((item) => (
                /* 1. ON AJOUTE LA KEY ICI (identifiant unique de ton produit) */
                <div key={item.id} className="flex items-center p-6 border-b last:border-b-0 border-[#292322]/20">

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
                    <h3 className="text-lg font-bold text-[#292322]">{item.name}</h3>
                    <p className="text-[#292322]/70 text-sm">Prix unitaire : {item.price} €</p>

                    {/* Contrôles de quantité avec gestion du stock */}
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="px-2 py-1 bg-[#292322]/20 rounded hover:bg-[#292322]/30 text-[#292322]"
                      >-</button>
                      <span className="mx-4 font-medium text-[#292322]">{item.quantite}</span>

                      {/* 
                        === GESTION DU BOUTON + ET DU STOCK ===
                        - Si le produit est épuisé (stock = 0): on désactive le bouton +
                        - Si la quantité dans le panier >= au stock disponible: on désactive le bouton +
                        - Sinon: le bouton + fonctionne normalement
                      */}
                      {(() => {
                        // Récupérer le stock du produit depuis stockMap
                        const productStock = getProductStock(item.id);

                        // Vérifier si le produit est épuisé (stock = 0)
                        const isOutOfStock = productStock === 0;

                        // Vérifier si la quantité demandée atteint la limite du stock
                        // Si productStock est défini et que la quantité >= stock, on désactive
                        const isStockLimitReached = productStock !== undefined && item.quantite >= productStock;

                        // Le bouton est désactivé si épuisé OU si limite de stock atteinte
                        const isDisabled = isOutOfStock || isStockLimitReached;

                        return (
                          <>
                            <button
                              onClick={() => addToCart(item)}
                              disabled={isDisabled}
                              className={`px-2 py-1 rounded ${isDisabled
                                  ? 'bg-[#292322]/10 text-[#292322]/50 cursor-not-allowed'
                                  : 'bg-[#292322]/20 hover:bg-[#292322]/30 text-[#292322]'
                                }`}
                            >
                              +
                            </button>

                            {/* Affichage du stock disponible */}
                            <span className={`ml-3 text-sm ${isOutOfStock ? 'text-red-600 font-bold' : 'text-[#292322]/70'}`}>
                              {isOutOfStock
                                ? 'Épuisé'
                                : productStock !== undefined
                                  ? `Stock: ${productStock}`
                                  : ''
                              }
                            </span>
                          </>
                        );
                      })()}

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
                    <p className="text-lg font-bold text-[#292322]">
                      {(item.price * item.quantite).toFixed(2)} €
                    </p>
                    <p className="text-xs text-[#292322]/70">Total ligne</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé du panier */}
            <div className="bg-[#F5CC60] rounded-xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center">
              <button
                onClick={clearCart}
                className="text-[#292322]/70 hover:text-red-500 text-sm mb-4 md:mb-0"
              >
                Vider le panier
              </button>

              <div className="text-right">
                <p className="text-[#292322]/70">Total ({getTotalItems()} articles) :</p>
                <p className="text-3xl font-extrabold text-[#292322]">{getTotalPrice().toFixed(2)} €</p>
                <button onClick={goToPay} className="mt-4 w-full md:w-auto px-8 py-3 bg-[#292322] text-[#F5CC60] font-bold rounded-lg hover:bg-[#292322]/80 transition">
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

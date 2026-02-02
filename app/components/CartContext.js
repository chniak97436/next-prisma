"use client";
import { createContext, useContext, useState, useEffect } from 'react';

// Créer le contexte
const CartContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé dans un CartProvider');
  }
  return context;
};

// Fournisseur du contexte
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Fonction pour ajouter un article au panier
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // Incrémenter la quantité si l'article existe
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantite: item.quantite + 1 }
            : item
        );
      } else {
        // Ajouter un nouvel article
        return [...prevCart, { ...product, quantite: 1 }];
      }
    });
  };

  // Fonction pour supprimer un article du panier
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Fonction pour diminuer la quantité d'un article
  const decreaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && item.quantite > 1
          ? { ...item, quantite: item.quantite - 1 }
          : item
      ).filter((item) => item.quantite > 0)
    );
  };

  // Fonction pour obtenir le nombre total d'articles
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantite, 0);
  };

  // Fonction pour obtenir le total du panier
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantite, 0);
  };

  // Fonction pour vider le panier
  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

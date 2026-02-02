# Étapes pour créer une session panier dans Next.js

## 1. Comprendre les exigences
- Créer une fonctionnalité de panier qui enregistre les produits ajoutés (nom, prix, image).
- Afficher un icône de panier dans la barre de navigation avec le nombre d'articles.
- Utiliser le stockage local (localStorage) pour persister les données côté client.

## 2. Préparer la structure des données
- Définir un format pour les articles du panier : { id, name, price, image_url, quantity }.
- Stocker le panier sous forme de tableau JSON dans localStorage avec la clé 'cart'.

### Explication du localStorage
Le localStorage est un moyen de stocker des données côté client dans le navigateur web. Contrairement aux cookies, les données persistent même après la fermeture du navigateur et ne sont pas envoyées au serveur à chaque requête.

**Avantages :**
- Persiste les données localement
- Facile à utiliser avec JavaScript
- Stocke jusqu'à 5-10 Mo par domaine

**Inconvénients :**
- Stockage limité
- Données en texte brut (pas sécurisé pour les données sensibles)
- Synchrone (peut bloquer le thread principal)

**Exemples d'utilisation :**

```javascript
// Sauvegarder un tableau d'articles dans localStorage
const cart = [
  { id: 1, name: 'Produit A', price: 10.99, image_url: '/img/a.jpg', quantity: 2 },
  { id: 2, name: 'Produit B', price: 15.50, image_url: '/img/b.jpg', quantity: 1 }
];
localStorage.setItem('cart', JSON.stringify(cart));

// Récupérer le panier depuis localStorage
const savedCart = JSON.parse(localStorage.getItem('cart')) || [];

// Ajouter un article au panier existant
const newItem = { id: 3, name: 'Produit C', price: 8.75, image_url: '/img/c.jpg', quantity: 1 };
savedCart.push(newItem);
localStorage.setItem('cart', JSON.stringify(savedCart));

// Supprimer tout le panier
localStorage.removeItem('cart');
```

## 3. Implémenter la fonction AddToCart
- Dans le composant produit (page.js), récupérer les données du produit actuel.
- Vérifier si le produit existe déjà dans le panier.
- Si oui, incrémenter la quantité ; sinon, ajouter un nouvel article.
- Sauvegarder le panier mis à jour dans localStorage.
- Mettre à jour l'état local pour refléter les changements immédiatement.

## 4. Créer un hook ou un contexte pour gérer le panier

### Étape 4.1 : Créer le fichier CartContext.js ✅
Créez un nouveau fichier `app/components/CartContext.js` avec le code suivant :

```javascript
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
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Ajouter un nouvel article
        return [...prevCart, { ...product, quantity: 1 }];
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
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter((item) => item.quantity > 0)
    );
  };

  // Fonction pour obtenir le nombre total d'articles
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Fonction pour obtenir le total du panier
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
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
```

### Étape 4.2 : Envelopper l'application avec le CartProvider ✅
Modifiez `app/layout.js` pour importer et utiliser le CartProvider :

```javascript
import { CartProvider } from './components/CartContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
```

### Étape 4.3 : Utiliser le contexte dans les composants ✅
Dans `app/components/NavBar.js`, importez et utilisez le hook `useCart` :

```javascript
import { useCart } from './CartContext';

// Dans le composant NavBar
const { getTotalItems } = useCart();

// Afficher l'icône du panier avec le nombre d'articles
<div className="relative">
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {/* Icône de panier SVG */}
  </svg>
  {getTotalItems() > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1">
      {getTotalItems()}
    </span>
  )}
</div>
```

### Étape 4.4 : Intégrer l'ajout au panier dans les pages produits ✅
Dans `app/products/[id]/page.js`, utilisez le hook pour ajouter des produits :

```javascript
import { useCart } from '../../components/CartContext';

// Dans le composant de la page produit
const { addToCart } = useCart();

const handleAddToCart = () => {
  addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    image_url: product.image_url,
  });
};
```

### Explication détaillée :
- **CartContext** : Utilise `createContext` pour créer un contexte partagé.
- **CartProvider** : Composant qui fournit l'état et les fonctions aux enfants.
- **useCart** : Hook personnalisé pour accéder facilement au contexte.
- **localStorage** : Synchronisé avec `useEffect` pour persister les données.
- **Fonctions utilitaires** : `addToCart`, `removeFromCart`, etc., pour gérer le panier.

## 5. Modifier la barre de navigation (NavBar)
- Importer le contexte du panier dans NavBar.
- Afficher un icône de panier (SVG ou icône) avec un badge montrant le nombre total d'articles.
- Rendre l'icône cliquable pour naviguer vers une page de panier (optionnel).

## 6. Gérer les quantités et les suppressions
- Permettre d'ajouter plusieurs exemplaires du même produit.
- Ajouter des fonctions pour diminuer la quantité ou supprimer un article.
- Mettre à jour le localStorage à chaque modification.

## 7. Tester la fonctionnalité
- Ajouter des produits au panier et vérifier que le compteur s'incrémente.
- Vérifier la persistance après rechargement de la page.
- Tester avec différents produits et quantités.

## 8. Améliorations optionnelles
- Ajouter une page dédiée au panier pour voir et modifier les articles.
- Calculer le total du panier.
- Intégrer avec l'authentification pour synchroniser le panier côté serveur.

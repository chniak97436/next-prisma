# Documentation du Système de Commandes et Avis

## Table des Matières
1. [Introduction](#introduction)
2. [Comment un utilisateur passe une commande](#comment-un-utilisateur-passe-une-commande)
3. [Récupération de la dernière commande sur la page d'accueil](#récupération-de-la-dernière-commande-sur-la-page-daccueil)
4. [Système d'avis produits](#système-davis-produits)
5. [Explication technique détaillée](#explication-technique-détaillée)
6. [Schéma de la base de données](#schéma-de-la-base-de-données)
7. [Flux des données](#flux-des-données)

---

## Introduction

Ce document explique comment fonctionne le système de commandes et d'avis dans ton application Next.js. L'objectif était de permettre aux utilisateurs de :
1. Passer une commande
2. Voir leur dernière commande sur la page d'accueil
3. Laisser un avis sur les produits de cette commande

---

## Comment un Utilisateur Passe une Commande

### 1. Ajout au panier
L'utilisateur ajoute des produits dans son panier (via le contexte React `CartContext`).

### 2. Validation de la commande
Quand l'utilisateur clique sur "Valider ma commande" :
1. Une requête POST est envoyée vers `/api/commande/` pour créer la commande
2. La commande est créée dans la table `commande` avec :
   - `user_id` : ID de l'utilisateur
   - `total_amount` : Prix total
   - `shipping_address` : Adresse de livraison

### 3. Sauvegarde des produits
**C'est là que beaucoup de problèmes sont survenus !**

Après la création de la commande, on doit sauvegarder les produits dans la table `commande_items`. Voici ce qui se passe :

```
javascript
// Dans app/commande/page.js
// On récupère les infos de la commande créée
const response = await fetch('/api/commande/', { ... });
const data = await response.json();
const commandeId = data.data.id; // Ex: 58

// Ensuite on appelle l'API pour sauvegarder les produits
await fetch('/api/commandeItems/', {
  method: 'POST',
  body: JSON.stringify({
    comandeId: 58,
    productId: [13, 12],      // IDs des produits
    productQuantite: [1, 2],  // Quantités
    priceUnique: [1024, 855.6] // Prix unitaires
  })
});
```

### Tables concernées

#### Table `commande`
| Champ | Description |
|-------|-------------|
| id | ID unique de la commande |
| user_id | ID de l'utilisateur qui passe la commande |
| total_amount | Prix total |
| status | Statut (pending, delivered, etc.) |
| shipping_address | Adresse de livraison |
| created_at | Date de création |

#### Table `commande_items`
| Champ | Description |
|-------|-------------|
| id | ID unique |
| commande_id | ID de la commande (lien vers table commande) |
| product_id | ID du produit (lien vers table product) |
| quantity | Quantité commandée |
| unit_price | Prix unitaire au moment de la commande |

---

## Récupération de la Dernière Commande sur la Page d'Accueil

### Le Problème Initial
Tu avais plusieurs erreurs dans ton code original :

1. **Mauvaise syntaxe fetch** :
```
javascript
// ❌ INCORRECT - Tu mélangeais deux objets
fetch('/api/commande/recapCommand/', {
  where: { username: user.id }
}, {
  method: 'GET',
  headers: { ... }
})

// ✅ CORRECT
fetch(`/api/commande/?userId=${userId}`, {
  method: 'GET',
  headers: { ... }
})
```

2. **Mauvais endpoint** : `/api/commande/recapCommand/` n'existe pas

3. **Paramètre mal placé** : Le `where` n'existe pas dans une requête GET - il faut utiliser les query params (`?userId=13`)

4. **Problème de timing** : `user` était null quand tu appelais la fonction car le state n'était pas encore mis à jour

### Le Code Correct

```
javascript
// Dans app/page.js

// 1. On récupère le token JWT
const token = localStorage.getItem('token');
const decoded = jwtDecode(token);
const userId = decoded.userId; // Ex: 13

// 2. On appelle l'API pour récupérer les commandes de l'utilisateur
const response = await fetch(`/api/commande/?userId=${userId}`);
const data = await response.json();

// 3. On prend la première commande (car elles sont triées par date décroissante)
const lastCommande = data.data[0]; // Ex: { id: 58, user_id: 13, ... }
```

### L'API `/api/commande/`

```
javascript
// Dans app/api/commande/route.js

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId'); // Récupère ?userId=13
  
  // Cherche les commandes de cet utilisateur, triées par date
  const commandes = await prisma.commande.findMany({
    where: { user_id: parseInt(userId) },
    orderBy: { created_at: 'desc' } // La plus récente en premier
  });
  
  return success({ data: commandes });
}
```

---

## Système d'Avis Produits

### 1. Récupération des produits de la commande

Une fois qu'on a la dernière commande, on récupère les produits :

```
javascript
// Appel API pour avoir les produits de la commande
const response = await fetch(`/api/commandeItems/?commandeId=${commandeId}`);
const data = await response.json();
// Retourne les produits avec les détails du produit
```

### 2. L'API `/api/commandeItems/`

```
javascript
export async function GET(request) {
  const commandeId = searchParams.get('commandeId');
  
  // Cherche les items de cette commande
  const commandeItems = await prisma.commandeItem.findMany({
    where: { commande_id: parseInt(commandeId) },
    include: { product: true } // Inclut les infos du produit
  });
  
  return success({ data: commandeItems });
}
```

### 3. Vérification des avis existants

Avant d'afficher le formulaire, on vérifie si l'utilisateur a déjà laissé un avis :

```
javascript
// Appel API pour vérifier si un avis existe
const response = await fetch(`/api/avis/?userId=${userId}&productId=${productId}`);
const data = await response.json();

if (data.data.length > 0) {
  // L'utilisateur a déjà laissé un avis
  // On affiche "Avis déjà soumis"
} else {
  // On affiche le formulaire d'avis
}
```

### 4. Soumission d'un avis

```
javascript
// Quand l'utilisateur soumet le formulaire
await fetch('/api/avis', {
  method: 'POST',
  body: JSON.stringify({
    userId: 13,        // ID de l'utilisateur
    productId: 12,     // ID du produit
    note: 5,           // Note de 1 à 5
    comment: "Super produit !"  // Commentaire (optionnel)
  })
});
```

---

## Explication Technique Détaillée

### Le Token JWT

Quand un utilisateur se connecte, le serveur crée un "token" (jeton) qui contient les informations de l'utilisateur :

```
javascript
// Dans app/api/auth/login/route.js
const token = signToken({ 
  userId: existingUser.id,    // 13
  name: existingUser.username, // "chniak974"
  email: existingUser.email,   // "chniak974@gmail.com"
  role: existingUser.role      // "customer"
});
```

Ce token est stocké dans le navigateur (`localStorage`) et est utilisé pour identifier l'utilisateur.

### Décodage du token

Sur la page d'accueil, on décode ce token pour obtenir l'ID utilisateur :

```
javascript
const token = localStorage.getItem('token');
const decoded = jwtDecode(token);
const userId = decoded.userId; // 13
```

### La Base de Données

Voici comment les données sont liées :

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     users      │       │   commande     │       │ commande_items │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id: 13         │◄──────│ user_id: 13    │       │ commande_id: 58│
│ username: ...  │       │ id: 58         │◄──────│ product_id: 13  │
└─────────────────┘       │ total_amount:  │       │ quantity: 1     │
                          │   2735.2       │       └─────────────────┘
                          └─────────────────┘              │
                                  │                          │
                                  ▼                          ▼
                          ┌─────────────────┐       ┌─────────────────┐
                          │    products     │       │      avis       │
                          ├─────────────────┤       ├─────────────────┤
                          │ id: 13          │◄──────│ user_id: 13     │
                          │ name: "Portable │       │ product_id: 13  │
                          │   HP"          │       │ note: 5         │
                          └─────────────────┘       └─────────────────┘
```

---

## Flux des Données

### Quand un utilisateur passe une commande :

1. **Panier** → Choix des produits
2. **Page commande** → Création de la commande (`/api/commande/`)
3. **Sauvegarde des produits** → `commande_items` (`/api/commandeItems/`)
4. **Création du paiement** → `payments`

### Quand l'utilisateur voit sa dernière commande :

1. **Page d'accueil** → Récupère le token
2. **Appel API** → `/api/commande/?userId=13`
3. **Récupère les produits** → `/api/commandeItems/?commandeId=58`
4. **Vérifie les avis** → `/api/avis/?userId=13&productId=13`
5. **Affiche** → Formulaire ou "Avis déjà soumis"

### Quand l'utilisateur soumet un avis :

1. **Formulaire** → Envoi des données
2. **API** → `/api/avis/` (POST)
3. **Base de données** → Table `avis`
4. **Mise à jour** → Affichage "Avis déjà soumis"

---

## Résumé des Fichiers Modifiés

| Fichier | Description |
|---------|-------------|
| `app/page.js` | Page d'accueil avec affichage de la commande et formulaire d'avis |
| `app/api/commande/route.js` | API pour créer et récupérer les commandes |
| `app/api/commandeItems/route.js` | API pour sauvegarder et récupérer les produits d'une commande |
| `app/api/avis/route.js` | API pour créer et vérifier les avis |
| `app/commande/page.js` | Page de validation de commande |

---

## Commandes Utiles

### Tester l'API des commandes
```
bash
curl "http://localhost:3001/api/commande/?userId=13"
```

### Tester l'API des produits de commande
```
bash
curl "http://localhost:3001/api/commandeItems/?commandeId=58"
```

### Tester l'API des avis
```
bash
curl "http://localhost:3001/api/avis/?userId=13&productId=12"

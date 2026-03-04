# Requêtes SQL et Prisma pour le Projet Next.js avec Prisma et SQLite

Ce fichier contient toutes les requêtes SQL possibles pour les modèles définis dans le schéma Prisma, adaptées à SQLite, ainsi que leurs équivalents en Prisma. Les requêtes sont basées sur les opérations Prisma utilisées dans le projet. Chaque section inclut des exemples de requêtes SELECT, INSERT, UPDATE, DELETE avec des clauses WHERE, ORDER BY, JOIN, LIMIT, etc., en SQL et en Prisma, ainsi que des explications détaillées.

Les modèles principaux sont :
- User
- Category
- Product
- Commande
- CommandeItem
- Payment
- Avis

## 1. Modèle User

### SELECT Queries

#### Récupérer tous les utilisateurs
```sql
SELECT id, username, email, emailVerified, password_hash, first_name, last_name, address, phone, role, created_at
FROM users;
```
```prisma
await prisma.user.findMany()
```
**Explication :** Sélectionne tous les champs de tous les utilisateurs. Équivalent à `prisma.user.findMany()`.

#### Récupérer un utilisateur par ID
```sql
SELECT id, username, email, emailVerified, password_hash, first_name, last_name, address, phone, role, created_at
FROM users
WHERE id = ?;
```
```prisma
await prisma.user.findUnique({
  where: { id: parseInt(id) }
})
```
**Explication :** Sélectionne un utilisateur spécifique par son ID. Équivalent à `prisma.user.findUnique({ where: { id: parseInt(id) } })`.

#### Récupérer un utilisateur par email
```sql
SELECT id, username, email, emailVerified, password_hash, first_name, last_name, address, phone, role, created_at
FROM users
WHERE email = ?;
```
```prisma
await prisma.user.findUnique({
  where: { email }
})
```
**Explication :** Utilisé pour vérifier si un email existe lors de l'inscription ou de la connexion. Équivalent à `prisma.user.findUnique({ where: { email } })`.

#### Récupérer les utilisateurs triés par date de création (ORDER BY)
```sql
SELECT id, username, email, role, created_at
FROM users
ORDER BY created_at DESC;
```
**Explication :** Liste les utilisateurs les plus récents en premier. Utile pour l'administration.

#### Récupérer les utilisateurs avec un rôle spécifique (WHERE + ORDER BY)
```sql
SELECT id, username, email, role, created_at
FROM users
WHERE role = 'admin'
ORDER BY username ASC;
```
**Explication :** Filtre les administrateurs et les trie par nom d'utilisateur.

#### Compter le nombre d'utilisateurs
```sql
SELECT COUNT(*) AS total_users
FROM users;
```
**Explication :** Retourne le nombre total d'utilisateurs.

### INSERT Queries

#### Insérer un nouvel utilisateur
```sql
INSERT INTO users (username, email, password_hash, first_name, last_name, address, phone, role)
VALUES (?, ?, ?, ?, ?, ?, ?);
```
```prisma
await prisma.user.create({
  data: {
    username: 'example',
    email: 'example@example.com',
    password_hash: 'hashed_password',
    first_name: 'John',
    last_name: 'Doe',
    address: '123 Main St',
    phone: '123-456-7890',
    role: 'customer'
  }
})
```
**Explication :** Crée un nouvel utilisateur. Équivalent à `prisma.user.create({ data: { ... } })`. Les champs comme `id` et `created_at` sont auto-générés.

### UPDATE Queries

#### Mettre à jour un utilisateur
```sql
UPDATE users
SET first_name = ?, last_name = ?, address = ?, phone = ?
WHERE id = ?;
```
**Explication :** Met à jour les informations d'un utilisateur. Équivalent à `prisma.user.update({ where: { id: parseInt(id) }, data: body })`.

#### Vérifier l'email d'un utilisateur
```sql
UPDATE users
SET emailVerified = ?
WHERE id = ?;
```
**Explication :** Marque l'email comme vérifié. Utilisé dans la vérification d'email.

### DELETE Queries

#### Supprimer un utilisateur
```sql
DELETE FROM users
WHERE id = ?;
```
**Explication :** Supprime un utilisateur. Attention : cela peut casser les relations avec commandes et avis à cause des contraintes de clés étrangères.

## 2. Modèle Category

### SELECT Queries

#### Récupérer toutes les catégories
```javascript
const response = await fetch('/api/categories')
const sql = SELECT id, name, description
FROM categories
ORDER BY name ASC;
```
```prisma
await prisma.category.findMany()
```
**Explication :** Liste toutes les catégories. Équivalent à `prisma.category.findMany()`.

#### Récupérer une catégorie par ID
```sql
SELECT id, name, description, parent_id
FROM categories
WHERE id = ?;
```
**Explication :** Sélectionne une catégorie spécifique. Équivalent à `prisma.category.findUnique({ where: { id: parseInt(id) } })`.

#### Récupérer une catégorie par nom
```sql
SELECT id, name, description, parent_id
FROM categories
WHERE name = ?;
```
**Explication :** Vérifie si une catégorie existe par nom. Équivalent à `prisma.category.findUnique({ where: { name: catName } })`.

#### Récupérer les catégories avec leurs enfants (JOIN récursif)
```sql
SELECT c1.id, c1.name, c1.description, c2.name AS parent_name
FROM categories c1
LEFT JOIN categories c2 ON c1.parent_id = c2.id;
```
**Explication :** Affiche les catégories avec leur parent. Utile pour la hiérarchie.

#### Récupérer les catégories triées par nom
```sql
SELECT id, name, description
FROM categories
ORDER BY name ASC;
```
**Explication :** Liste les catégories alphabétiquement.

### INSERT Queries

#### Insérer une nouvelle catégorie
```sql
INSERT INTO categories (name, description, parent_id)
VALUES (?, ?, ?);
```
**Explication :** Crée une nouvelle catégorie. Équivalent à `prisma.category.create({ data: { ... } })`.

### UPDATE Queries

#### Mettre à jour une catégorie
```sql
UPDATE categories
SET name = ?, description = ?, parent_id = ?
WHERE id = ?;
```
**Explication :** Modifie une catégorie existante.

### DELETE Queries

#### Supprimer une catégorie
```sql
DELETE FROM categories
WHERE id = ?;
```
**Explication :** Supprime une catégorie. Les produits liés auront leur `category_id` mis à NULL à cause de `onDelete: SetNull`.

## 3. Modèle Product

### SELECT Queries

#### Récupérer tous les produits avec leur catégorie (JOIN)
```sql
SELECT p.id, p.name, p.description, p.price, p.stock_quantity, p.image_url, p.created_at, c.name AS category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;
```
```prisma
await prisma.product.findMany({
  include: { category: true }
})
```
**Explication :** Liste tous les produits avec le nom de leur catégorie. Équivalent à `prisma.product.findMany({ include: { category: true } })`.

#### Récupérer un produit par ID avec catégorie
```sql
SELECT p.id, p.name, p.description, p.price, p.stock_quantity, p.image_url, p.created_at, c.name AS category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.id = ?;
```
**Explication :** Détails d'un produit spécifique. Équivalent à `prisma.product.findUnique({ where: { id: parseInt(id) }, include: { category: true } })`.

#### Récupérer les produits par nom
```sql
SELECT id, name, description, price, stock_quantity
FROM products
WHERE name = ?;
```
**Explication :** Vérifie si un produit existe par nom. Équivalent à `prisma.product.findFirst({ where: { name: name } })`.

#### Récupérer les produits triés par prix croissant
```sql
SELECT id, name, price, stock_quantity
FROM products
ORDER BY price ASC;
```
**Explication :** Liste les produits du moins cher au plus cher.

#### Récupérer les produits en stock (WHERE)
```sql
SELECT id, name, price, stock_quantity
FROM products
WHERE stock_quantity > 0
ORDER BY stock_quantity DESC;
```
**Explication :** Produits disponibles, triés par quantité en stock décroissante.

#### Compter les produits par catégorie
```sql
SELECT c.name, COUNT(p.id) AS product_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name;
```
**Explication :** Nombre de produits par catégorie.

### INSERT Queries

#### Insérer un nouveau produit
```sql
INSERT INTO products (name, description, price, stock_quantity, category_id, image_url, created_at)
VALUES (?, ?, ?, ?, ?, ?, ?);
```
**Explication :** Crée un nouveau produit. Équivalent à `prisma.product.create({ data: { ... } })`.

### UPDATE Queries

#### Mettre à jour un produit
```sql
UPDATE products
SET name = ?, description = ?, price = ?, stock_quantity = ?
WHERE id = ?;
```
**Explication :** Modifie les détails d'un produit.

### DELETE Queries

#### Supprimer un produit
```sql
DELETE FROM products
WHERE id = ?;
```
**Explication :** Supprime un produit. Cela affecte les commandes et avis liés.

## 4. Modèle Commande

### SELECT Queries

#### Récupérer toutes les commandes avec utilisateur
```sql
SELECT c.id, c.total_amount, c.status, c.shipping_address, c.created_at, u.username, u.email
FROM commande c
JOIN users u ON c.user_id = u.id;
```
**Explication :** Liste toutes les commandes avec les détails de l'utilisateur.

#### Récupérer une commande par ID
```sql
SELECT id, user_id, total_amount, status, shipping_address, created_at
FROM commande
WHERE id = ?;
```
**Explication :** Détails d'une commande spécifique.

#### Récupérer les commandes d'un utilisateur
```sql
SELECT id, total_amount, status, created_at
FROM commande
WHERE user_id = ?
ORDER BY created_at DESC;
```
**Explication :** Historique des commandes d'un utilisateur.

#### Récupérer les commandes par statut
```sql
SELECT id, user_id, total_amount, status, created_at
FROM commande
WHERE status = 'pending'
ORDER BY created_at ASC;
```
**Explication :** Commandes en attente, triées par date.

### INSERT Queries

#### Insérer une nouvelle commande
```sql
INSERT INTO commande (user_id, total_amount, status, shipping_address)
VALUES (?, ?, ?, ?);
```
**Explication :** Crée une nouvelle commande.

### UPDATE Queries

#### Mettre à jour le statut d'une commande
```sql
UPDATE commande
SET status = ?
WHERE id = ?;
```
**Explication :** Change le statut (e.g., de pending à shipped).

### DELETE Queries

#### Supprimer une commande
```sql
DELETE FROM commande
WHERE id = ?;
```
**Explication :** Supprime une commande et ses items associés.

## 5. Modèle CommandeItem

### SELECT Queries

#### Récupérer les items d'une commande avec produits
```sql
SELECT ci.id, ci.quantity, ci.unit_price, p.name, p.price
FROM commande_items ci
JOIN products p ON ci.product_id = p.id
WHERE ci.commande_id = ?;
```
**Explication :** Détails des produits dans une commande.

#### Récupérer tous les items
```sql
SELECT ci.id, ci.commande_id, ci.product_id, ci.quantity, ci.unit_price
FROM commande_items ci;
```
**Explication :** Liste tous les items de commande.

### INSERT Queries

#### Insérer un item de commande
```sql
INSERT INTO commande_items (commande_id, product_id, quantity, unit_price)
VALUES (?, ?, ?, ?);
```
**Explication :** Ajoute un produit à une commande.

### UPDATE Queries

#### Mettre à jour la quantité d'un item
```sql
UPDATE commande_items
SET quantity = ?
WHERE id = ?;
```
**Explication :** Modifie la quantité d'un item.

### DELETE Queries

#### Supprimer un item de commande
```sql
DELETE FROM commande_items
WHERE id = ?;
```
**Explication :** Retire un produit d'une commande.

## 6. Modèle Payment

### SELECT Queries

#### Récupérer tous les paiements avec commande
```sql
SELECT p.id, p.payment_method, p.amount, p.status, p.transaction_id, p.created_at, c.id AS commande_id
FROM payments p
JOIN commande c ON p.commande_id = c.id;
```
**Explication :** Liste tous les paiements avec leur commande.

#### Récupérer un paiement par commande
```sql
SELECT id, payment_method, amount, status, transaction_id, created_at
FROM payments
WHERE commande_id = ?;
```
**Explication :** Détails du paiement pour une commande.

### INSERT Queries

#### Insérer un nouveau paiement
```sql
INSERT INTO payments (commande_id, payment_method, amount, status, transaction_id)
VALUES (?, ?, ?, ?, ?);
```
**Explication :** Enregistre un paiement.

### UPDATE Queries

#### Mettre à jour le statut d'un paiement
```sql
UPDATE payments
SET status = ?
WHERE id = ?;
```
**Explication :** Change le statut du paiement.

### DELETE Queries

#### Supprimer un paiement
```sql
DELETE FROM payments
WHERE id = ?;
```
**Explication :** Supprime un paiement.

## 7. Modèle Avis

### SELECT Queries

#### Récupérer tous les avis avec utilisateur et produit
```sql
SELECT a.id, a.note, a.comment, a.created_at, u.username, p.name AS product_name
FROM avis a
JOIN users u ON a.user_id = u.id
JOIN products p ON a.product_id = p.id;
```
```prisma
await prisma.avis.findMany({
  include: {
    user: true,
    product: true
  }
})
```
**Explication :** Liste tous les avis avec détails. Équivalent à `prisma.avis.findMany({ include: { user: true, product: true } })`.

#### Récupérer les avis d'un produit
```sql
SELECT a.id, a.note, a.comment, a.created_at, u.username
FROM avis a
JOIN users u ON a.user_id = u.id
WHERE a.product_id = ?
ORDER BY a.created_at DESC;
```
**Explication :** Avis pour un produit spécifique, triés par date.

#### Moyenne des notes par produit
```sql
SELECT product_id, AVG(note) AS average_note, COUNT(*) AS review_count
FROM avis
GROUP BY product_id;
```
**Explication :** Statistiques des avis par produit.

### INSERT Queries

#### Insérer un nouvel avis
```sql
INSERT INTO avis (user_id, product_id, note, comment)
VALUES (?, ?, ?, ?);
```
**Explication :** Ajoute un avis.

### UPDATE Queries

#### Mettre à jour un avis
```sql
UPDATE avis
SET note = ?, comment = ?
WHERE id = ?;
```
**Explication :** Modifie un avis existant.

### DELETE Queries

#### Supprimer un avis
```sql
DELETE FROM avis
WHERE id = ?;
```
**Explication :** Supprime un avis. Équivalent à `prisma.avis.delete({ where: { id: parseInt(avisId) } })`.

## Requêtes Avancées et Utiles

### Jointures Complexes

#### Commandes avec items et produits
```sql
SELECT c.id AS commande_id, c.total_amount, c.status, ci.quantity, p.name, p.price
FROM commande c
JOIN commande_items ci ON c.id = ci.commande_id
JOIN products p ON ci.product_id = p.id
WHERE c.user_id = ?
ORDER BY c.created_at DESC;
```
**Explication :** Détails complets des commandes d'un utilisateur.

#### Produits avec avis et moyenne
```sql
SELECT p.id, p.name, AVG(a.note) AS avg_note, COUNT(a.id) AS review_count
FROM products p
LEFT JOIN avis a ON p.id = a.product_id
GROUP BY p.id, p.name
ORDER BY avg_note DESC;
```
**Explication :** Produits triés par note moyenne.

### Agrégations

#### Ventes totales par mois
```sql
SELECT strftime('%Y-%m', c.created_at) AS month, SUM(c.total_amount) AS total_sales
FROM commande c
WHERE c.status = 'delivered'
GROUP BY month
ORDER BY month DESC;
```
**Explication :** Statistiques des ventes mensuelles.

#### Top produits vendus
```sql
SELECT p.name, SUM(ci.quantity) AS total_sold
FROM products p
JOIN commande_items ci ON p.id = ci.product_id
JOIN commande c ON ci.commande_id = c.id
WHERE c.status = 'delivered'
GROUP BY p.id, p.name
ORDER BY total_sold DESC
LIMIT 10;
```
**Explication :** Les 10 produits les plus vendus.

## Exemples de Code pour les Requêtes

Cette section fournit des exemples de code pour implémenter les requêtes dans différents contextes : API Next.js, SQLite direct, et Prisma.

### 1. Modèle User - Récupérer tous les utilisateurs

#### API Next.js (avec Prisma)
```javascript
// Dans votre fonction API
const users = await prisma.user.findMany();
```

#### SQLite Direct
```javascript
// Exemple d'utilisation directe de SQLite (avec sqlite3)
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.all('SELECT id, username, email, emailVerified, password_hash, first_name, last_name, address, phone, role, created_at FROM users;', (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log(rows); // Résultats de la requête SQL
  }
});
```

#### Prisma (déjà couvert)
```javascript
await prisma.user.findMany()
```

### 2. Modèle Product - Récupérer tous les produits avec catégorie

#### API Next.js (avec Prisma)
```javascript
// app/api/products/route.js
import { prisma } from '@/lib/prisma';
import { success } from '@/lib/utils/response';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true } // Inclut la catégorie liée
    });
    return success({ data: products });
  } catch (error) {
    return internalServerError('Erreur lors de la récupération des produits');
  }
}
```

#### SQLite Direct
```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.all(`
  SELECT p.id, p.name, p.description, p.price, p.stock_quantity, p.image_url, p.created_at, c.name AS category_name
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id;
`, (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log(rows); // Produits avec catégorie
  }
});
```

#### Prisma (déjà couvert)
```javascript
await prisma.product.findMany({
  include: { category: true }
})
```

### 3. Modèle Avis - Récupérer tous les avis avec utilisateur et produit

#### API Next.js (avec Prisma)
```javascript
const avis = await prisma.avis.findMany({
  include: {
    user: true,
    product: true
  }
});
```

#### SQLite Direct
```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.all(`
  SELECT a.id, a.note, a.comment, a.created_at, u.username, p.name AS product_name
  FROM avis a
  JOIN users u ON a.user_id = u.id
  JOIN products p ON a.product_id = p.id;
`, (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log(rows); // Avis avec utilisateur et produit
  }
});
```

#### Prisma (déjà couvert)
```javascript
await prisma.avis.findMany({
  include: {
    user: true,
    product: true
  }
})
```

Ces exemples montrent comment implémenter les requêtes dans une API Next.js en utilisant Prisma pour la simplicité, ou directement avec SQLite pour un contrôle fin. Les requêtes Prisma sont plus sûres et faciles à maintenir, tandis que SQLite direct offre une performance brute mais nécessite une gestion manuelle des erreurs et des injections SQL.

Ces requêtes couvrent toutes les opérations possibles sur votre base de données SQLite. Elles sont adaptées aux opérations Prisma utilisées dans votre projet Next.js. Pour les exécuter, utilisez un client SQLite comme DB Browser for SQLite ou via le terminal avec `sqlite3`.

---

# Annexe: Liste des appels API (fetch) dans Next.js

Cette section recense tous les appels `fetch('/api/...')` utilisés dans le projet Next.js avec leur utilité et explication.

## Table des Matières
1. [Auth API](#auth-api)
2. [Products API](#products-api)
3. [Categories API](#categories-api)
4. [Users API](#users-api)
5. [Avis API](#avis-api)
6. [Commande API](#commande-api)
7. [CommandeItems API](#commandeitems-api)
8. [Newsletter API](#newsletter-api)
9. [Payment API](#payment-api)
10. [Email API](#email-api)

---

## 1. Auth API

### `/api/auth/register`
- **Méthode:** `POST`
- **Utilité:** Inscription d'un nouvel utilisateur
- **Paramètres:** `username`, `email`, `password`
- **Action:** Crée un nouvel utilisateur avec un mot de passe hashé, génère un token de vérification d'email et envoie un email de confirmation
- **Fichier:** `app/api/auth/register/route.js`
- **Exemple d'appel:**
```
javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, email, password })
});
```

### `/api/auth/login`
- **Méthode:** `POST`
- **Utilité:** Connexion utilisateur
- **Paramètres:** `email`, `password`
- **Action:** Vérifie les identifiants, compare le mot de passe hashé, génère un JWT token et retourne les infos utilisateur (rôle admin détecté)
- **Fichier:** `app/api/auth/login/route.js`
- **Exemple d'appel:**
```
javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

### `/api/auth/logout`
- **Méthode:** `GET`
- **Utilité:** Déconnexion utilisateur
- **Action:** Efface tous les cookies d'authentification (token, userId, userRole, userEmail, userName, cart) et redirige vers /login
- **Fichier:** `app/api/auth/logout/route.js`
- **Exemple d'appel:**
```
javascript
await fetch('/api/auth/logout', { method: 'GET' });
```

### `/api/auth/forgotPassword`
- **Méthode:** `POST`
- **Utilité:** Demande de réinitialisation de mot de passe
- **Paramètres:** `email`
- **Action:** Vérifie si l'email existe dans la base de données
- **Fichier:** `app/api/auth/forgotPassword/route.js`
- **Exemple d'appel:**
```
javascript
const data = await fetch('/api/auth/forgotPassword', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email })
});
```

### `/api/auth/resetPassword`
- **Méthode:** `PUT`
- **Utilité:** Réinitialisation du mot de passe
- **Paramètres:** `email`, `password`
- **Action:** Hash le nouveau mot de passe et met à jour l'utilisateur
- **Fichier:** `app/api/auth/resetPassword/route.js`
- **Exemple d'appel:**
```
javascript
const data = await fetch('/api/auth/resetPassword', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password: hashedPassword })
});
```

### `/api/auth/google`
- **Méthode:** `GET`
- **Utilité:** Initiation de l'authentification Google OAuth
- **Action:** Redirige vers la page d'autorisation Google
- **Fichier:** `app/api/auth/google/route.js`
- **Exemple d'appel:**
```
javascript
// Redirect vers /api/auth/google pour lancer OAuth
window.location.href = '/api/auth/google';
```

### `/api/auth/google-callback`
- **Méthode:** `GET`
- **Utilité:** Callback après authentification Google OAuth
- **Paramètres:** `code` (authorization code de Google)
- **Action:** Échange le code contre un token Google, crée/met à jour l'utilisateur local, génère un JWT et redirige vers /admin avec les infos
- **Fichier:** `app/api/auth/google-callback/route.js`

### `/api/auth/check-google`
- **Méthode:** `GET`
- **Utilité:** Vérification de la configuration Google OAuth
- **Action:** Retourne le statut de la configuration (présence des variables d'environnement)
- **Fichier:** `app/api/auth/check-google/route.js`
- **Exemple d'appel:**
```
javascript
const response = await fetch('/api/auth/check-google');
```

### `/api/auth/verify-email`
- **Méthode:** `GET`
- **Utilité:** Vérification de l'email via token
- **Paramètres:** `token` (JWT de vérification)
- **Action:** Décode le token, marque l'email comme vérifié dans la base de données, redirige vers /login
- **Fichier:** `app/api/auth/verify-email/route.js`
- **Exemple d'appel:**
```
javascript
// Lien envoyé par email
const verificationUrl = `http://localhost:3001/api/auth/verify-email?token=${verificationToken}`;
```

---

## 2. Products API

### `/api/products`
- **Méthodes:** `GET`, `POST`, `DELETE`
- **GET - Utilité:** Récupérer tous les produits avec leur catégorie
- **Action:** Retourne un tableau de produits avec les détails de leur catégorie
- **Fichier:** `app/api/products/route.js`
- **Exemple d'appel:**
```
javascript
const res = await fetch('/api/products');
const data = await res.json();
```

- **POST - Utilité:** Créer un nouveau produit
- **Paramètres:** `name`, `description`, `price`, `stock_Quantity`, `category` (categoryId), `createdAt`, `image` (fichier)
- **Action:** Upload l'image, crée le produit dans la base de données
- **Exemple d'appel:**
```javascript
const formData = new FormData();
formData.append('name', productName);
formData.append('description', description);
formData.append('price', price);
formData.append('stock_Quantity', stock);
formData.append('category', categoryId);
formData.append('createdAt', new Date().toISOString());
formData.append('image', imageFile);

const res = await fetch('/api/products', {
  method: 'POST',
  body: formData
});
```

- **DELETE - Utilité:** Supprimer un produit
- **Paramètres:** `productId`
- **Exemple d'appel:**
```
javascript
const res = await fetch('/api/products', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ productId })
});
```

### `/api/products/[id]`
- **Méthodes:** `GET`, `PUT`
- **GET - Utilité:** Récupérer un produit par ID avec sa catégorie
- **Paramètres:** `id` (identifiant du produit dans l'URL)
- **Action:** Retourne les détails complets du produit
- **Fichier:** `app/api/products/[id]/route.js`
- **Exemple d'appel:**
```
javascript
const data = await fetch(`/api/products/${id}`);
```

- **PUT - Utilité:** Mettre à jour un produit
- **Paramètres:** `name`, `description`, `price`, `stock_quantity`, `category_id`, `image_url`
- **Exemple d'appel:**
```
javascript
const res = await fetch(`/api/products/${productId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, description, price, stock_quantity, category_id })
});
```

---

## 3. Categories API

### `/api/categories`
- **Méthodes:** `GET`, `POST`, `DELETE`
- **GET - Utilité:** Récupérer toutes les catégories
- **Action:** Retourne un tableau de toutes les catégories
- **Fichier:** `app/api/categories/route.js`
- **Exemple d'appel:**
```
javascript
const categoriesRes = await fetch('/api/categories');
const categoriesData = await categoriesRes.json();
```

- **POST - Utilité:** Créer une nouvelle catégorie
- **Paramètres:** `catName`, `catDesc`, `parent_id` (optionnel)
- **Exemple d'appel:**
```
javascript
const res = await fetch('/api/categories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ catName, catDesc, parent_id })
});
```

- **DELETE - Utilité:** Supprimer une catégorie
- **Paramètres:** `categoryId`
- **Exemple d'appel:**
```
javascript
const res = await fetch('/api/categories', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ categoryId })
});
```

### `/api/categories/[id]`
- **Méthode:** `GET`
- **Utilité:** Récupérer une catégorie par ID
- **Paramètres:** `id` (identifiant de la catégorie dans l'URL)
- **Fichier:** `app/api/categories/[id]/route.js`
- **Exemple d'appel:**
```
javascript
const res = await fetch(`/api/categories/${categoryId}`);
```

---

## 4. Users API

### `/api/users`
- **Méthodes:** `GET`, `PUT`
- **GET - Utilité:** Récupérer tous les utilisateurs (admin)
- **Action:** Retourne un tableau de tous les utilisateurs
- **Fichier:** `app/api/users/route.js`
- **Exemple d'appel:**
```
javascript
const response = await fetch('/api/users');
const data = await response.json();
```

- **PUT - Utilité:** Mettre à jour le mot de passe d'un utilisateur
- **Paramètres:** `email`, `password`
- **Exemple d'appel:**
```
javascript
const response = await fetch('/api/users', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

### `/api/users/[id]`
- **Méthodes:** `GET`, `PUT`
- **GET - Utilité:** Récupérer un utilisateur par ID
- **Paramètres:** `id` (identifiant utilisateur dans l'URL)
- **Fichier:** `app/api/users/[id]/route.js`
- **Exemple d'appel:**
```
javascript
const res = await fetch(`/api/users/${user.id}`);
```

- **PUT - Utilité:** Mettre à jour un utilisateur
- **Paramètres:** données utilisateur à mettre à jour
- **Exemple d'appel:**
```
javascript
const response = await fetch(`/api/users/${userId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ /* données à mettre à jour */ })
});
```

### `/api/users/check-admin`
- **Méthodes:** `POST`, `GET`
- **Utilité:** Vérifier si un email est admin
- **Paramètres:** `email`
- **Action:** Vérifie si l'email est dans la liste des admins (codée en dur)
- **Fichier:** `app/api/users/check-admin/route.js`
- **Exemple d'appel:**
```
javascript
const response = await fetch('/api/users/check-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email })
});
```

---

## 5. Avis API

### `/api/avis`
- **Méthodes:** `GET`, `POST`, `DELETE`
- **GET - Utilité:** Récupérer les avis avec filtres optionnels
- **Paramètres de query:** `userId`, `productId`, `userName`
- **Action:** Retourne les avis avec les détails de l'utilisateur et du produit
- **Fichier:** `app/api/avis/route.js`
- **Exemple d'appel:**
```
javascript
// Avis pour un produit spécifique
const res = await fetch(`/api/avis?productId=${id}`);

// Avis pour un utilisateur spécifique
const response = await fetch(`/api/avis/?userId=${user.id}&productId=${productId}`);
```

- **POST - Utilité:** Créer un nouvel avis
- **Paramètres:** `userId`, `productId`, `note`, `comment` (optionnel)
- **Exemple d'appel:**
```
javascript
const response = await fetch('/api/avis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId, productId, note, comment })
});
```

- **DELETE - Utilité:** Supprimer un avis
- **Paramètres:** `avisId`
- **Exemple d'appel:**
```
javascript
const res = await fetch('/api/avis', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ avisId })
});
```

---

## 6. Commande API

### `/api/commande`
- **Méthodes:** `GET`, `POST`
- **GET - Utilité:** Récupérer les commandes
- **Paramètres de query:** `userId` (optionnel)
- **Action:** Si userId fourni, retourne les commandes de cet utilisateur. Sinon retourne toutes les commandes (admin)
- **Fichier:** `app/api/commande/route.js`
- **Exemple d'appel:**
```
javascript
// Commandes d'un utilisateur
const res = await fetch(`/api/commande?userId=${user.id}`);

// Toutes les commandes (admin)
const response = await fetch('/api/commande');
```

- **POST - Utilité:** Créer une nouvelle commande
- **Paramètres:** `userid`, `address`, `priceTotal`
- **Exemple d'appel:**
```
javascript
const res = await fetch('/api/commande/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userid, address, priceTotal })
});
```

---

## 7. CommandeItems API

### `/api/commandeItems`
- **Méthodes:** `GET`, `POST`
- **GET - Utilité:** Récupérer les éléments d'une commande avec les produits
- **Paramètres de query:** `commandeId`
- **Action:** Retourne les items de commande avec les détails des produits
- **Fichier:** `app/api/commandeItems/route.js`
- **Exemple d'appel:**
```
javascript
const res = await fetch(`/api/commandeItems/?commandeId=${lastCommande.id}`);
```

- **POST - Utilité:** Créer des éléments de commande
- **Paramètres:** `comandeId`, `productId` (ou tableau), `productQuantite` (ou tableau), `priceUnique` (ou tableau), `totalAmount`
- **Action:** Crée les items, le paiement et met à jour le statut de la commande
- **Exemple d'appel:**
```
javascript
const itemsRes = await fetch('/api/commandeItems/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    comandeId,
    productId,
    productQuantite,
    priceUnique,
    totalAmount
  })
});
```

---

## 8. Newsletter API

### `/api/newsletter`
- **Méthodes:** `GET`, `POST`, `DELETE`
- **GET - Utilité:** Récupérer tous les abonnés
- **Action:** Retourne la liste des abonnés actifs
- **Fichier:** `app/api/newsletter/route.js`
- **Exemple d'appel:**
```
javascript
const response = await fetch('/api/newsletter');
```

- **POST - Utilité:** Ajouter un nouvel abonné
- **Paramètres:** `email`
- **Exemple d'appel:**
```
javascript
const response = await fetch('/api/newsletter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email })
});
```

- **DELETE - Utilité:** Se désabonner
- **Paramètres de query:** `email`
- **Exemple d'appel:**
```
javascript
const res = await fetch(`/api/newsletter?email=${email}`, {
  method: 'DELETE'
});
```

### `/api/newsletter/send/[id]`
- **Méthode:** `POST`
- **Utilité:** Envoyer une newsletter à un abonné spécifique
- **Paramètres:** `id` (identifiant de l'abonné dans l'URL)
- **Fichier:** `app/api/newsletter/send/[id]/route.js`
- **Exemple d'appel:**
```
javascript
const res = await fetch(`/api/newsletter/send/${id}`, {
  method: 'POST'
});
```

---

## 9. Payment API

### `/api/payment`
- **Méthode:** `GET`
- **Utilité:** Récupérer tous les paiements
- **Action:** Retourne la liste de tous les paiements avec leurs commandes
- **Fichier:** `app/api/payment/route.js`
- **Exemple d'appel:**
```
javascript
const response = await fetch("/api/payment");
```

---

## 10. Email API

### `/api/send-payment-email`
- **Méthode:** `POST`
- **Utilité:** Envoyer un email (ex: confirmation de paiement)
- **Paramètres:** `email`, `subject`, `text`
- **Action:** Envoie un email via SMTP (Gmail). Retourne un succès même si SMTP non configuré (pour ne pas bloquer le processus)
- **Fichier:** `app/api/send-payment-email/route.js`
- **Exemple d'appel:**
```
javascript
const emailRes = await fetch('/api/send-payment-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: userEmail,
    subject: 'Confirmation de votre commande',
    text: 'Votre commande a été confirmée...'
  })
});
```

---

## Récapitulatif des Méthodes HTTP par Endpoint

| Endpoint | GET | POST | PUT | DELETE |
|----------|-----|------|-----|--------|
| `/api/auth/register` | - | ✅ | - | - |
| `/api/auth/login` | - | ✅ | - | - |
| `/api/auth/logout` | ✅ | - | - | - |
| `/api/auth/forgotPassword` | - | ✅ | - | - |
| `/api/auth/resetPassword` | - | - | ✅ | - |
| `/api/auth/google` | ✅ | - | - | - |
| `/api/auth/google-callback` | ✅ | - | - | - |
| `/api/auth/check-google` | ✅ | - | - | - |
| `/api/auth/verify-email` | ✅ | - | - | - |
| `/api/products` | ✅ | ✅ | - | ✅ |
| `/api/products/[id]` | ✅ | - | ✅ | - |
| `/api/categories` | ✅ | ✅ | - | ✅ |
| `/api/categories/[id]` | ✅ | - | - | - |
| `/api/users` | ✅ | - | ✅ | - |
| `/api/users/[id]` | ✅ | - | ✅ | - |
| `/api/users/check-admin` | ✅ | ✅ | - | - |
| `/api/avis` | ✅ | ✅ | - | ✅ |
| `/api/commande` | ✅ | ✅ | - | - |
| `/api/commandeItems` | ✅ | ✅ | - | - |
| `/api/newsletter` | ✅ | ✅ | - | ✅ |
| `/api/newsletter/send/[id]` | - | ✅ | - | - |
| `/api/payment` | ✅ | - | - | - |
| `/api/send-payment-email` | - | ✅ | - | - |

---

## Notes Importantes

1. **Headers d'authentification:** Pour les routes admin, il faut souvent inclure les headers d'authentification:
```
javascript
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
const response = await fetch('/api/users', { headers });
```

2. **Gestion des erreurs:** Toujours vérifier `response.ok` ou le statut de la réponse:
```
javascript
if (!res.ok) {
  throw new Error(`Erreur: ${res.status}`);
}
```

3. **Tokens JWT:** Certains appels nécessitent un token JWT dans les cookies ou headers.

4. **FormData:** Pour les uploads de fichiers (images), utiliser `FormData` au lieu de JSON.

---

# Annexe 2: Endpoints API supplémentaires (relations entre tables)

Cette section liste des endpoints API supplémentaires utiles qui pourraient être créés ou qui exploitent les relations entre tables du schéma Prisma.

## Relations du Schéma Prisma

```
User (1) ──────< (N) Commande
User (1) ──────< (N) Avis
Category (1) ─< (N) Product
Category (1) ─< (N) Category (self-referencing)
Product (1) ───< (N) CommandeItem
Product (1) ───< (N) Avis
Commande (1) ──< (N) CommandeItem
Commande (1) ──| (1) Payment
CommandeItem (N) ─> (1) Product
CommandeItem (N) ─> (1) Commande
```

## Endpoints avec Relations

### 1. Products avec Catégories et Avis

#### `GET /api/products?include=category,avis`
- **Méthode:** `GET`
- **Utilité:** Récupérer tous les produits avec leur catégorie et leurs avis
- **Relations:** Product -> Category, Product -> Avis
- **Paramètres de query:** `include` (optionnel: category, avis)
- **Exemple Prisma:**
```
javascript
const products = await prisma.product.findMany({
  include: {
    category: true,
    avis: {
      include: { user: true }
    }
  }
});
```

#### `GET /api/products/[id]?include=category,avis`
- **Méthode:** `GET`
- **Utilité:** Récupérer un produit avec catégorie, avis et notes moyennes
- **Relations:** Product -> Category, Product -> Avis
- **Exemple Prisma:**
```
javascript
const product = await prisma.product.findUnique({
  where: { id: parseInt(id) },
  include: {
    category: true,
    avis: {
      include: { user: true }
    }
  }
});
// Calculer la moyenne des notes
const averageNote = product.avis.reduce((sum, a) => sum + a.note, 0) / product.avis.length;
```

### 2. Categories avec Produits

#### `GET /api/categories?include=products`
- **Méthode:** `GET`
- **Utilité:** Récupérer toutes les catégories avec leurs produits
- **Relations:** Category -> Product
- **Exemple Prisma:**
```
javascript
const categories = await prisma.category.findMany({
  include: {
    products: true
  }
});
```

#### `GET /api/categories/[id]?include=products`
- **Méthode:** `GET`
- **Utilité:** Récupérer une catégorie avec ses produits
- **Relations:** Category -> Product
- **Exemple Prisma:**
```
javascript
const category = await prisma.category.findUnique({
  where: { id: parseInt(id) },
  include: {
    products: true
  }
});
```

### 3. Users avec Commandes et Avis

#### `GET /api/users/[id]?include=commandes,avis`
- **Méthode:** `GET`
- **Utilité:** Récupérer un utilisateur avec ses commandes et avis
- **Relations:** User -> Commande, User -> Avis
- **Exemple Prisma:**
```
javascript
const user = await prisma.user.findUnique({
  where: { id: parseInt(id) },
  include: {
    commande: {
      include: {
        commande_items: {
          include: { product: true }
        },
        payment: true
      }
    },
    avis: {
      include: { product: true }
    }
  }
});
```

### 4. Commandes avec Détails Complets

#### `GET /api/commande/[id]?include=user,items,payment`
- **Méthode:** `GET`
- **Utilité:** Récupérer une commande avec utilisateur, items et paiement
- **Relations:** Commande -> User, Commande -> CommandeItem -> Product, Commande -> Payment
- **Exemple Prisma:**
```
javascript
const commande = await prisma.commande.findUnique({
  where: { id: parseInt(id) },
  include: {
    user: {
      select: { id: true, username: true, email: true, address: true }
    },
    commande_items: {
      include: {
        product: {
          select: { id: true, name: true, image_url: true }
        }
      }
    },
    payment: true
  }
});
```

#### `GET /api/commande?userId=X&include=user,items`
- **Méthode:** `GET`
- **Utilité:** Récupérer les commandes d'un utilisateur avec tous les détails
- **Relations:** Commande -> User, Commande -> CommandeItem -> Product
- **Exemple Prisma:**
```
javascript
const commandes = await prisma.commande.findMany({
  where: { user_id: parseInt(userId) },
  include: {
    user: {
      select: { id: true, username: true, email: true }
    },
    commande_items: {
      include: {
        product: true
      }
    },
    payment: true
  },
  orderBy: { created_at: 'desc' }
});
```

### 5. Avis avec Utilisateur et Produit

#### `GET /api/avis?productId=X&include=user,product`
- **Méthode:** `GET`
- **Utilité:** Récupérer les avis d'un produit avec les détails utilisateur
- **Relations:** Avis -> User, Avis -> Product
- **Exemple Prisma:**
```
javascript
const avis = await prisma.avis.findMany({
  where: { product_id: parseInt(productId) },
  include: {
    user: {
      select: { id: true, username: true }
    },
    product: {
      select: { id: true, name: true }
    }
  },
  orderBy: { created_at: 'desc' }
});
```

### 6. Endpoints Statistiques (Agrégations)

#### `GET /api/stats/dashboard`
- **Méthode:** `GET`
- **Utilité:** Statistiques globales pour le dashboard admin
- **Relations:** Agrégation sur User, Product, Category, Commande, Payment, Avis
- **Exemple Prisma:**
```
javascript
const [usersCount, productsCount, categoriesCount, commandesCount, paymentsTotal, avisCount] = await Promise.all([
  prisma.user.count(),
  prisma.product.count(),
  prisma.category.count(),
  prisma.commande.count(),
  prisma.payment.aggregate({ _sum: { amount: true } }),
  prisma.avis.count()
]);
```

#### `GET /api/stats/sales?period=month`
- **Méthode:** `GET`
- **Utilité:** Statistiques des ventes
- **Relations:** Commande -> Payment
- **Paramètres:** `period` (day, week, month, year)
- **Exemple Prisma:**
```
javascript
const startDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);

const sales = await prisma.commande.findMany({
  where: {
    created_at: { gte: startDate },
    status: 'delivered'
  },
  include: { payment: true }
});
const totalSales = sales.reduce((sum, c) => sum + c.total_amount, 0);
```

#### `GET /api/stats/top-products`
- **Méthode:** `GET`
- **Utilité:** Top produits les plus vendus
- **Relations:** CommandeItem -> Product -> Commande
- **Exemple Prisma:**
```
javascript
const topProducts = await prisma.commandeItem.groupBy({
  by: ['product_id'],
  _sum: { quantity: true },
  orderBy: { _sum: { quantity: 'desc' } },
  take: 10
});
// Puis récupérer les détails des produits
```

#### `GET /api/stats/top-users`
- **Méthode:** `GET`
- **Utilité:** Top utilisateurs par nombre de commandes
- **Relations:** Commande -> User
- **Exemple Prisma:**
```
javascript
const topUsers = await prisma.commande.groupBy({
  by: ['user_id'],
  _count: { id: true },
  _sum: { total_amount: true },
  orderBy: { _sum: { total_amount: 'desc' } },
  take: 10
});
```

### 7. Categories Hiérarchiques

#### `GET /api/categories/tree`
- **Méthode:** `GET`
- **Utilité:** Récupérer toutes les catégories en structure hiérarchique
- **Relations:** Category (self-referencing: parent_id)
- **Exemple Prisma:**
```
javascript
const categories = await prisma.category.findMany({
  include: {
    children: {
      include: { children: true }
    }
  },
  where: { parent_id: null }
});
```

#### `GET /api/categories/[id]/children`
- **Méthode:** `GET`
- **Utilité:** Récupérer les sous-catégories d'une catégorie
- **Relations:** Category (self-referencing)
- **Exemple Prisma:**
```
javascript
const children = await prisma.category.findMany({
  where: { parent_id: parseInt(id) },
  include: { products: true }
});
```

### 8. Recherches et Filtres Avancés

#### `GET /api/products/search?q=...&categoryId=...&minPrice=...&maxPrice=...&inStock=...`
- **Méthode:** `GET`
- **Utilité:** Recherche produits avec multiples filtres
- **Relations:** Product -> Category
- **Paramètres:** `q` (nom/description), `categoryId`, `minPrice`, `maxPrice`, `inStock` (boolean)
- **Exemple Prisma:**
```javascript
const products = await prisma.product.findMany({
  where: {
    name: { contains: searchQuery, mode: 'insensitive' },
    category_id: categoryId ? parseInt(categoryId) : undefined,
    price: { gte: minPrice, lte: maxPrice },
    stock_quantity: inStock === 'true' ? { gt: 0 } : undefined
  },
  include: { category: true }
});
```

#### `GET /api/commandes/search?status=...&dateFrom=...&dateTo=...`
- **Méthode:** `GET`
- **Utilité:** Rechercher des commandes par statut et date
- **Relations:** Commande -> User
- **Exemple Prisma:**
```
javascript
const commandes = await prisma.commande.findMany({
  where: {
    status: status,
    created_at: {
      gte: dateFrom ? new Date(dateFrom) : undefined,
      lte: dateTo ? new Date(dateTo) : undefined
    }
  },
  include: { user: true },
  orderBy: { created_at: 'desc' }
});
```

### 9. Gestion des Stocks

#### `GET /api/products/low-stock?threshold=10`
- **Méthode:** `GET`
- **Utilité:** Produits en rupture de stock ou stock faible
- **Relations:** Product -> Category
- **Exemple Prisma:**
```
javascript
const lowStockProducts = await prisma.product.findMany({
  where: {
    stock_quantity: { lte: parseInt(threshold) }
  },
  include: { category: true },
  orderBy: { stock_quantity: 'asc' }
});
```

#### `PUT /api/products/[id]/stock`
- **Méthode:** `PUT`
- **Utilité:** Mettre à jour le stock d'un produit
- **Paramètres:** `stock_quantity` (increment ou decrement)
- **Exemple Prisma:**
```
javascript
const product = await prisma.product.update({
  where: { id: parseInt(id) },
  data: {
    stock_quantity: { increment: parseInt(quantity) }
  }
});
```

### 10. Payments avec Commandes

#### `GET /api/payment/[commandeId]`
- **Méthode:** `GET`
- **Utilité:** Récupérer le paiement d'une commande spécifique
- **Relations:** Payment -> Commande -> User
- **Exemple Prisma:**
```
javascript
const payment = await prisma.payment.findUnique({
  where: { commande_id: parseInt(commandeId) },
  include: {
    commande: {
      include: { user: true }
    }
  }
});
```

#### `GET /api/payment?status=...`
- **Méthode:** `GET`
- **Utilité:** Lister les paiements par statut
- **Relations:** Payment -> Commande
- **Exemple Prisma:**
```
javascript
const payments = await prisma.payment.findMany({
  where: { status: status },
  include: {
    commande: {
      include: { user: true }
    }
  },
  orderBy: { created_at: 'desc' }
});
```

---

## Récapitulatif des Relations API

| Source | Relation | Cible | Endpoint typique |
|--------|----------|-------|------------------|
| User | hasMany | Commande | GET /api/commande?userId=X |
| User | hasMany | Avis | GET /api/avis?userId=X |
| Category | hasMany | Product | GET /api/products?categoryId=X |
| Category | self | Category (children) | GET /api/categories/tree |
| Product | hasMany | CommandeItem | GET /api/commandeItems?productId=X |
| Product | hasMany | Avis | GET /api/avis?productId=X |
| Commande | belongsTo | User | Inclus dans Commande |
| Commande | hasMany | CommandeItem | Inclus dans Commande |
| Commande | hasOne | Payment | GET /api/payment/[commandeId] |
| CommandeItem | belongsTo | Commande | Inclus |
| CommandeItem | belongsTo | Product | Inclus |
| Payment | belongsTo | Commande | Inclus |
| Avis | belongsTo | User | Inclus |
| Avis | belongsTo | Product | Inclus |

---

# Annexe 3: Récupérer les paramètres dans Next.js API Routes

Cette section explique comment récupérer les données (IDs, paramètres) dans les routes API Next.js.

## 1. Récupérer les données du body (POST, PUT)

### Format JSON
```
javascript
// Dans votre route API
export async function POST(request) {
  // Récupérer le body
  const body = await request.json();
  
  // Extraire les variables
  const { email, id, userId, productId } = body;
  
  console.log('Email:', email);
  console.log('ID:', id);
}
```

### Exemple d'appel avec fetch
```
javascript
// Frontend - Appel avec JSON
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    id: 123,
    userId: 456,
    productId: 789
  })
});
```

### Format FormData (pour les fichiers)
```
javascript
// Route API avec FormData
export async function POST(request) {
  const formData = await request.formData();
  
  // Récupérer les champs
  const name = formData.get('name');
  const email = formData.get('email');
  const id = formData.get('id');
  const image = formData.get('image'); // Fichier
  
  console.log('Name:', name);
  console.log('ID:', id);
}

// Frontend - Appel avec FormData
const formData = new FormData();
formData.append('name', 'Mon produit');
formData.append('email', 'test@example.com');
formData.append('id', '123');
formData.append('image', fileInput.files[0]);

const response = await fetch('/api/products', {
  method: 'POST',
  body: formData
});
```

## 2. Récupérer l'ID depuis l'URL (route dynamique)

### Pour les routes comme `/api/users/[id]`

```
javascript
// app/api/users/[id]/route.js
export async function GET(request, { params }) {
  // Récupérer l'ID depuis les paramètres de route
  const { id } = await params;
  
  console.log('ID récupéré:', id);
  
  // Utiliser l'ID
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) }
  });
  
  return success({ data: user });
}
```

### Pour les routes avec query strings `/api/products?categoryId=5`

```
javascript
// app/api/products/route.js
export async function GET(request) {
  // Récupérer les query params
  const { searchParams } = new URL(request.url);
  
  const categoryId = searchParams.get('categoryId');
  const userId = searchParams.get('userId');
  const productId = searchParams.get('productId');
  
  console.log('categoryId:', categoryId);
  console.log('userId:', userId);
  
  // Utiliser dans la requête
  const where = {};
  if (categoryId) {
    where.category_id = parseInt(categoryId);
  }
  if (userId) {
    where.user_id = parseInt(userId);
  }
  
  const products = await prisma.product.findMany({ where });
  
  return success({ data: products });
}
```

### Appel frontend avec query strings
```
javascript
// Frontend - Avec query strings
const res = await fetch(`/api/avis?productId=${productId}&userId=${userId}`);

// ou
const res = await fetch(`/api/products?categoryId=5&minPrice=10&maxPrice=100`);
```

## 3. Combiner body et query params

```
javascript
export async function POST(request) {
  // Récupérer le body
  const body = await request.json();
  const { name, description, price } = body;
  
  // Récupérer les query params
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');
  const action = searchParams.get('action'); // ex: 'create' ou 'update'
  
  console.log('Action:', action);
  console.log('Category ID:', categoryId);
  console.log('Name:', name);
}
```

## 4. Récupérer les IDs dans les autres méthodes HTTP

### PUT (Mise à jour)
```
javascript
export async function PUT(request, { params }) {
  // ID depuis l'URL (params)
  const { id } = await params;
  
  // Données depuis le body
  const body = await request.json();
  const { username, email, address } = body;
  
  // Mise à jour
  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { username, email, address }
  });
  
  return success({ data: user });
}
```

### DELETE
```
javascript
export async function DELETE(request) {
  const body = await request.json();
  const { productId, categoryId, avisId } = body;
  
  // OU avec query params
  // const { searchParams } = new URL(request.url);
  // const id = searchParams.get('id');
  
  if (productId) {
    await prisma.product.delete({
      where: { id: parseInt(productId) }
    });
  }
  
  return success({ message: 'Supprimé avec succès' });
}
```

## 5. Récapitulatif des méthodes de récupération

| Source | Méthode | Code |
|--------|---------|------|
| Body JSON | POST/PUT | `const body = await request.json()` |
| Body FormData | POST | `const formData = await request.formData()` |
| Route param [id] | GET/PUT/DELETE | `const { id } = await params` |
| Query string | GET | `searchParams.get('paramName')` |

## 6. Exemple complet avec toutes les sources

```
javascript
// app/api/exemple/route.js
export async function POST(request, { params }) {
  try {
    // 1. Récupérer les query params
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action'); // ex: 'create', 'update'
    const format = searchParams.get('format'); // ex: 'json', 'csv'
    
    // 2. Récupérer le body (JSON)
    const body = await request.json();
    const { 
      email,           // from body
      id,              // from body
      name,            // from body
      userId,          // from body
      productId,       // from body
      categoryId       // from body
    } = body;
    
    // 3. Si route dynamique comme /api/exemple/[id]
    // const { id } = await params;
    
    console.log('Action:', action);
    console.log('Email:', email);
    console.log('ID:', id);
    console.log('User ID:', userId);
    console.log('Product ID:', productId);
    
    // Utiliser les données...
    
    return success({ 
      message: 'Données reçues',
      data: { email, id, userId, productId }
    });
    
  } catch (error) {
    console.error('Erreur:', error);
    return badRequest('Données invalides');
  }
}
```

---

# Annexe 3: Récupérer les paramètres dans Next.js API Routes

Cette section explique comment récupérer les données (IDs, paramètres) dans les routes API Next.js.

## 1. Récupérer les données du body (POST, PUT)

### Format JSON
```
javascript
// Dans votre route API
export async function POST(request) {
  // Récupérer le body
  const body = await request.json();
  
  // Extraire les variables
  const { email, id, userId, productId } = body;
  
  console.log('Email:', email);
  console.log('ID:', id);
}
```

### Exemple d'appel avec fetch
```
javascript
// Frontend - Appel avec JSON
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    id: 123,
    userId: 456,
    productId: 789
  })
});
```

### Format FormData (pour les fichiers)
```
javascript
// Route API avec FormData
export async function POST(request) {
  const formData = await request.formData();
  
  // Récupérer les champs
  const name = formData.get('name');
  const email = formData.get('email');
  const id = formData.get('id');
  const image = formData.get('image'); // Fichier
  
  console.log('Name:', name);
  console.log('ID:', id);
}

// Frontend - Appel avec FormData
const formData = new FormData();
formData.append('name', 'Mon produit');
formData.append('email', 'test@example.com');
formData.append('id', '123');
formData.append('image', fileInput.files[0]);

const response = await fetch('/api/products', {
  method: 'POST',
  body: formData
});
```

## 2. Récupérer l'ID depuis l'URL (route dynamique)

### Pour les routes comme `/api/users/[id]`

```
javascript
// app/api/users/[id]/route.js
export async function GET(request, { params }) {
  // Récupérer l'ID depuis les paramètres de route
  const { id } = await params;
  
  console.log('ID récupéré:', id);
  
  // Utiliser l'ID
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) }
  });
  
  return success({ data: user });
}
```

### Pour les routes avec query strings `/api/products?categoryId=5`

```
javascript
// app/api/products/route.js
export async function GET(request) {
  // Récupérer les query params
  const { searchParams } = new URL(request.url);
  
  const categoryId = searchParams.get('categoryId');
  const userId = searchParams.get('userId');
  const productId = searchParams.get('productId');
  
  console.log('categoryId:', categoryId);
  console.log('userId:', userId);
  
  // Utiliser dans la requête
  const where = {};
  if (categoryId) {
    where.category_id = parseInt(categoryId);
  }
  if (userId) {
    where.user_id = parseInt(userId);
  }
  
  const products = await prisma.product.findMany({ where });
  
  return success({ data: products });
}
```

### Appel frontend avec query strings
```
javascript
// Frontend - Avec query strings
const res = await fetch(`/api/avis?productId=${productId}&userId=${userId}`);

// ou
const res = await fetch(`/api/products?categoryId=5&minPrice=10&maxPrice=100`);
```

## 3. Combiner body et query params

```
javascript
export async function POST(request) {
  // Récupérer le body
  const body = await request.json();
  const { name, description, price } = body;
  
  // Récupérer les query params
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');
  const action = searchParams.get('action'); // ex: 'create' ou 'update'
  
  console.log('Action:', action);
  console.log('Category ID:', categoryId);
  console.log('Name:', name);
}
```

## 4. Récupérer les IDs dans les autres méthodes HTTP

### PUT (Mise à jour)
```
javascript
export async function PUT(request, { params }) {
  // ID depuis l'URL (params)
  const { id } = await params;
  
  // Données depuis le body
  const body = await request.json();
  const { username, email, address } = body;
  
  // Mise à jour
  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { username, email, address }
  });
  
  return success({ data: user });
}
```

### DELETE
```
javascript
export async function DELETE(request) {
  const body = await request.json();
  const { productId, categoryId, avisId } = body;
  
  // OU avec query params
  // const { searchParams } = new URL(request.url);
  // const id = searchParams.get('id');
  
  if (productId) {
    await prisma.product.delete({
      where: { id: parseInt(productId) }
    });
  }
  
  return success({ message: 'Supprimé avec succès' });
}
```

## 5. Récapitulatif des méthodes de récupération

| Source | Méthode | Code |
|--------|---------|------|
| Body JSON | POST/PUT | `const body = await request.json()` |
| Body FormData | POST | `const formData = await request.formData()` |
| Route param [id] | GET/PUT/DELETE | `const { id } = await params` |
| Query string | GET | `searchParams.get('paramName')` |

## 6. Exemple complet avec toutes les sources

```
javascript
// app/api/exemple/route.js
export async function POST(request, { params }) {
  try {
    // 1. Récupérer les query params
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action'); // ex: 'create', 'update'
    const format = searchParams.get('format'); // ex: 'json', 'csv'
    
    // 2. Récupérer le body (JSON)
    const body = await request.json();
    const { 
      email,           // from body
      id,              // from body
      name,            // from body
      userId,          // from body
      productId,       // from body
      categoryId       // from body
    } = body;
    
    // 3. Si route dynamique comme /api/exemple/[id]
    // const { id } = await params;
    
    console.log('Action:', action);
    console.log('Email:', email);
    console.log('ID:', id);
    console.log('User ID:', userId);
    console.log('Product ID:', productId);
    
    // Utiliser les données...
    
    return success({ 
      message: 'Données reçues',
      data: { email, id, userId, productId }
    });
    
  } catch (error) {
    console.error('Erreur:', error);
    return badRequest('Données invalides');
  }
}
```

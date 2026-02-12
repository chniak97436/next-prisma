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

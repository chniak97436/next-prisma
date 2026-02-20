# Guide complet : Configuration de Vercel Postgres avec Next.js et Prisma

Ce guide vous explique comment migrer votre application Next.js + Prisma (actuellement en SQLite) vers Vercel Postgres pour un déploiement en production fonctionnel.

---

## Table des matières

1. [Prérequis](#prérequis)
2. [Pourquoi Vercel Postgres ?](#pourquoi-vercel-postgres-)
3. [Étape 1 : Créer un projet sur Vercel](#étape-1--créer-un-projet-sur-vercel)
4. [Étape 2 : Créer une base de données Postgres](#étape-2--créer-une-base-de-données-postgres)
5. [Étape 3 : Configurer Prisma pour PostgreSQL](#étape-3--configurer-prisma-pour-postgresql)
6. [Étape 4 : Mettre à jour le code Prisma](#étape-4--mettre-à-jour-le-code-prisma)
7. [Étape 5 : Configurer les variables d'environnement](#étape-5--configurer-les-variables-denvironnement)
8. [Étape 6 : Synchroniser la base de données](#étape-6--synchroniser-la-base-de-données)
9. [Étape 7 : Déployer sur Vercel](#étape-7--déployer-sur-vercel)
10. [Dépannage](#dépannage)

---

## Prérequis

Avant de commencer, assurez-vous d'avoir :

- ✅ Un compte [Vercel](https://vercel.com) (gratuit)
- ✅ Node.js version 18+ installé
- ✅ L'application Next.js actuelle fonctionnelle en local
- ✅ Git installé et projet synchronisé sur GitHub/GitLab

---

## Pourquoi Vercel Postgres ?

| Caractéristique | SQLite (Local) | Vercel Postgres |
|------------------|----------------|-----------------|
| Stockage | Fichier local | Cloud |
| Accès simultané | Limité | Illimité |
| Déploiement | Impossible | ✓ Optimisé |
| Prix | Gratuit | Gratuit (Hobby) |
| Mise à l'échelle | Non | Oui |

---

## Étape 1 : Créer un projet sur Vercel

### 1.1 Connectez-vous à Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec votre compte GitHub/GitLab

### 1.2 Importez votre projet

1. Cliquez sur **"Add New..."** → **"Project"**
2. Sélectionnez votre dépôt GitHub contenant `next-prisma`
3. Cliquez sur **"Import"**

### 1.3 Configurez le projet

Dans la page de configuration :

| Paramètre | Valeur |
|-----------|--------|
| Framework Preset | Next.js |
| Build Command | `prisma generate && next build` |
| Output Directory | `.next` |

Cliquez sur **"Deploy"** (cela va échouer temporairement, c'est normal)

---

## Étape 2 : Créer une base de données Postgres

### 2.1 Accédez à votre projet déployé

1. Allez dans votre projet Vercel
2. Cliquez sur l'onglet **"Storage"** dans la barre latérale
3. Cliquez sur **"Create Database"**

### 2.2 Configurer Postgres

1. Sélectionnez **"Postgres"** comme type de base de données
2. Configurez :
   - **Name** : `next-prisma-db` (ou ce que vous voulez)
   - **Region** : Choisissez une région proche de vos utilisateurs (ex: `Frankfurt (eu-central-1)`)
   - **Plan** : ` Hobby (Free) `

3. Cliquez sur **"Create"**

### 2.3 Récupérez les informations de connexion

Une fois créée, cliquez sur votre base de données et allez dans l'onglet **".env"** :

Copiez la variable `POSTGRES_URL` - elle ressemble à :
```
postgres://user:password@host.vercel-storage.com:5432/verceldb?sslmode=require
```

---

## Étape 3 : Configurer Prisma pour PostgreSQL

### 3.1 Modifier le fichier prisma/schema.prisma

Ouvrez le fichier `prisma/schema.prisma` et modifiez-le :

```
prisma
// AVANT (SQLite)
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

// APRÈS (PostgreSQL)
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3.2 Installer le package PostgreSQL

Si ce n'est pas encore fait, installez le driver :

```
bash
npm install @prisma/client
# Pas besoin de driver supplémentaire pour PostgreSQL
```

### 3.3 Mettre à jour lib/prisma.js

Le fichier actuel devrait fonctionner, mais vérifiez qu'il est correct :

```
javascript
// lib/prisma.js
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## Étape 4 : Mettre à jour le code Prisma

### 4.1 Régénérer le client Prisma

Après avoir modifié le schéma, régénérez le client :

```
bash
npx prisma generate
```

### 4.2 Modifier le fichier app/commande/page.js

Il y a une erreur dans votre fichier. Cette ligne est incorrecte :

```
javascript
// ❌ INCORRECT
import { CommandeStatus } from '@prisma/client'

// et plus tard
include : {
  user : User,
  status : CommandeStatus ,
},
```

Supprimez ces lignes incorrectes. La fonction `valideCommande` devrait devenir :

```
javascript
//----------POST COMMANDE BDD-----------------
const valideCommande = async () => {
    const priceTotal = parseFloat(getTotalPrice().toFixed(2)) 
    const userid = user.id
    const address = user.address
    console.log("click commande")
    
    try {
        const res = await fetch('/api/commande/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid, address, priceTotal }),
        })
        const data = await res.json()
        console.log(data)
        if(data){
            setMessage('Commande validée....')
            setTimeout(()=>{
              router.push(`./commande/recapCommand/`)  
            },2000)
        }
    } catch (err) {
        console.error('Erreur lors de la commande:', err)
    }
}
```

---

## Étape 5 : Configurer les variables d'environnement

### 5.1 En local (.env.local)

Créez ou modifiez le fichier `.env.local` à la racine du projet :

```
env
# URL de connexion à PostgreSQL (fournie par Vercel)
DATABASE_URL="postgres://user:password@host.vercel-storage.com:5432/verceldb?sslmode=require"

# Autres variables nécessaires (si votre app les utilise)
# JWT_SECRET="votre-secret-jwt"
```

### 5.2 Sur Vercel

1. Allez dans votre projet Vercel
2. Cliquez sur **"Settings"** → **"Environment Variables"**
3. Ajoutez la variable :
   - **Name** : `DATABASE_URL`
   - **Value** : Collez votre URL Postgres (celle récupérée à l'étape 2.3)
   - **Environments** : Cochez toutes les cases (Production, Preview, Development)
4. Cliquez sur **"Save"**

---

## Étape 6 : Synchroniser la base de données

### 6.1 Pousser le schéma vers PostgreSQL

Exécutez cette commande en local (avec DATABASE_URL configurée) :

```
bash
npx prisma db push
```

Cette commande va :
- Créer toutes les tables dans PostgreSQL
- Synchroniser le schéma avec vos modèles Prisma

### 6.2 (Optionnel) Migrer les données

Si vous avez des données dans votre SQLite et voulez les migrer :

1. Exportez vos données depuis SQLite
2. Importez-les dans PostgreSQL

Ou utilisez un outil comme [pgloader](https://pgloader.io/) pour une migration automatique.

---

## Étape 7 : Déployer sur Vercel

### 7.1 Repousser le code sur GitHub

```bash
git add .
git commit -m "Migration vers PostgreSQL"
git push origin main
```

### 7.2 Déclencher un nouveau déploiement

Vercel va automatiquement détecter les changements et redéployer.

1. Allez sur Vercel → votre projet
2. Attendez que le déploiement se termine
3. Cliquez sur le lien de production

### 7.3 Vérifier le fonctionnement

Testez votre application :
- ❌ Erreur "client-side exception" ? → Vérifiez la console du navigateur
- ✅ Page se charge correctement ? → Testez les fonctionnalités

---

## Dépannage

### Erreur : "Can't reach database server"

**Cause** : La variable DATABASE_URL est incorrecte ou manquante.

**Solution** :
1. Vérifiez que DATABASE_URL est configurée sur Vercel
2. Assurez-vous que l'URL finit par `?sslmode=require`
3. Vérifiez que la base de données est bien créée

### Erreur : "Client does not support authentication protocol"

**Cause** : Problème d'authentification PostgreSQL.

**Solution** :
1. Dans Vercel Storage → votre base de données
2. Allez dans l'onglet **"Settings"** → **"Database"**
3. Cherchez l'option "Reset database credentials"
4. Cliquez pour générer de nouveaux identifiants

### Erreur : "Table does not exist"

**Cause** : Le schéma n'a pas été poussé.

**Solution** :
```bash
npx prisma db push
```

### Erreur : Prisma generate error

**Solution** :
```
bash
# Supprimer le cache Prisma
rm -rf node_modules/.prisma
rm -rf prisma/client

# Réinstaller
npm install
npx prisma generate
```

### Erreur : Connection refused

**Cause** : La base de données est en pause (Vercel Postgres gratuit).

**Solution** :
1. Allez dans Vercel Storage → votre base de données
2. Désactivez "Pause project" si activé
3.OU utilisez [Vercel kv](https://vercel.com/docs/storage/vercel-kv) comme alternative

---

## Résumé des commandes

```
bash
# 1. Installer les dépendances
npm install @prisma/client

# 2. Modifier prisma/schema.prisma (provider = "postgresql")

# 3. Régénérer le client Prisma
npx prisma generate

# 4. Synchroniser la base de données
npx prisma db push

# 5. Tester en local
npm run dev
```

---

## Étapes suivantes

Après le déploiement réussi :

1. ✅ Tester toutes les fonctionnalités (inscription, connexion, commandes)
2. ✅ Vérifier que les images s'affichent correctement
3. ✅ Tester le panneau d'administration
4. ✅Configurer des sauvegardes automatiques si nécessaire

---

## Aide supplémentaire

Si vous rencontrez d'autres problèmes :

1. **Documentation Prisma** : https://www.prisma.io/docs
2. **Support Vercel** : https://vercel.com/docs
3. **Stack Overflow** : Cherchez "Prisma + Vercel Postgres"

---

*Guide créé pour l'application Next.js + Prisma - 2024*

# TODO List: Améliorer la Newsletter pour un site e-commerce

## Objectif
Transformer le message de confirmation d'inscription à la newsletter en une expérience e-commerce complète avec produits vedettes, avantages clients et offre de bienvenue.

---

## Étape 1: Préparer les données (Backend)

### 1.1 Créer un endpoint API pour les produits vedettes
**Fichier à créer:** `app/api/products/featured/route.js`

```javascript
import { success } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Récupérer les 3 derniers produits ajoutés
        const products = await prisma.product.findMany({
            include: { category: true },
            orderBy: { created_at: 'desc' },
            take: 3,
        });
        return success({ data: products });
    } catch (error) {
        return success({ data: [] });
    }
}
```

### 1.2 Optionnel: Créer un champ "isFeatured" dans le schéma Prisma
**Fichier:** `prisma/schema.prisma`

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String
  price       Float
  stock_quantity Int
  image_url   String?
  created_at  DateTime @default(now())
  category_id Int
  category    Category @relation(fields: [category_id], references: [id])
  
  // Ajouter ce champ
  isFeatured  Boolean  @default(false)
}
```

---

## Étape 2: Modifier le composant Newsletter

### 2.1 Structure de base (État et State)

Dans `app/components/Newsletter.js`, ajouter:

```javascript
const [featuredProducts, setFeaturedProducts] = useState([]);
const [couponCode] = useState('WELCOME10'); // Code promo

// Charger les produits vedettes après inscription réussie
useEffect(() => {
    if (isSuccess) {
        fetchFeaturedProducts();
    }
}, [isSuccess]);

const fetchFeaturedProducts = async () => {
    try {
        const res = await fetch('/api/products/featured');
        const data = await res.json();
        setFeaturedProducts(data.data || []);
    } catch (error) {
        console.error('Erreur:', error);
    }
};
```

### 2.2 Composant de confirmation e-commerce

Remplacer le message de succès simple par:

```jsx
{isSuccess && (
    <div className="space-y-6">
        {/* Message de confirmation */}
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✨ Merci de votre inscription ! Voici votre code de bienvenue
        </div>

        {/* Code promo */}
        <div className="bg-[#F5CC60] p-4 rounded-lg text-center">
            <p className="text-[#242124] font-bold text-lg">
                Code promo: <span className="text-2xl">{couponCode}</span>
            </p>
            <p className="text-sm text-[#242124]">10% de réduction sur votre première commande</p>
        </div>

        {/* Produits vedettes */}
        {featuredProducts.length > 0 && (
            <div>
                <h4 className="text-white font-bold mb-3">Nos coups de cœur</h4>
                <div className="grid grid-cols-3 gap-2">
                    {featuredProducts.map((prod) => (
                        <div key={prod.id} className="bg-[#F5CC60] rounded p-2">
                            <Image 
                                src={prod.image_url || '/placeholder.png'} 
                                alt={prod.name}
                                width={80}
                                height={80}
                                className="object-contain"
                            />
                            <p className="text-xs text-[#242124] font-bold truncate">{prod.name}</p>
                            <p className="text-sm text-[#242124]">{prod.price} €</p>
                            <Link href={`/products/${prod.id}`} className="text-xs text-blue-600">
                                Voir →
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Avantages clients */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-300">
            <div>
                <span className="text-2xl">🚚</span>
                <p>Livraison gratuite</p>
            </div>
            <div>
                <span className="text-2xl">↩️</span>
                <p>30 jours retours</p>
            </div>
            <div>
                <span className="text-2xl">🔒</span>
                <p>Paiement sécurisé</p>
            </div>
        </div>

        {/* Bouton continuer les achats */}
        <Link 
            href="/products" 
            className="block w-full bg-[#F5CC60] text-[#242124] font-bold py-3 px-4 rounded-md text-center hover:bg-[#F5CC60]/80 transition-colors"
        >
            Découvrir nos produits
        </Link>
    </div>
)}
```

---

## Étape 3: Imports nécessaires

Vérifier que ces imports sont présents en haut du fichier:

```javascript
import Link from 'next/link';
import Image from 'next/image';
```

---

## Checklist d'implémentation

| # | Tâche | Statut |
|---|-------|--------|
| 1 | Créer `app/api/products/featured/route.js` | ☐ |
| 2 | Importer `useEffect`, `Link`, `Image` dans Newsletter.js | ☐ |
| 3 | Ajouter les states `featuredProducts` et `couponCode` | ☐ |
| 4 | Créer la fonction `fetchFeaturedProducts` | ☐ |
| 5 | Remplacer le message de succès par le composant e-commerce | ☐ |
| 6 | Tester l'inscription à la newsletter | ☐ |

---

## Fichiers à modifier

1. **Créer:** `app/api/products/featured/route.js`
2. **Modifier:** `app/components/Newsletter.js`

---

## Notes

- Le code promo "WELCOME10" peut être personnalisé selon vos besoins
- Les produits vedettes показывают les 3 derniers produits (easier to implement)
- Vous pouvez ajouter plus d'avantages clients (support 24/7, гарантия качества, etc.)
- Параметры можно настроить selon votre charte graphique


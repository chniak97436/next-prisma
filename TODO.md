# TODO - Correction de la mise à jour du stock produit

## Problème identifié
Le stock des produits ne se met plus à jour lors d'une commande. Après analyse du code, le problème est localisé dans `app/commande/recapCommand/page.js`.

### Cause racine
- Le bouton "Payer" avait un `onClick` qui appelle `updateStock()` pour chaque produit du panier
- Ce bouton avait également `type="submit"` et se trouve dans un formulaire
- Lors du clic, deux actions se déclenchaient :
  1. `onClick` → met à jour le stock
  2. Form submit → crée la commande
- Le stock était mis à jour AVANT que la commande ne soit créée, ce qui causait des incohérences !

### Solution appliquée
1. **Supprimé** l'appel à `updateStock` du `onClick` du bouton "Payer"
2. **Ajouté** la mise à jour du stock directement dans l'API `app/api/commandeItems/route.js` lors de la création des items de commande
3. La mise à jour du stock se fait maintenant de manière fiable APRÈS la création des items de commande

## Fichiers modifiés
1. ✅ `app/commande/recapCommand/page.js` - Suppression de l'appel updateStock du bouton
2. ✅ `app/api/commandeItems/route.js` - Ajout de la logique de mise à jour du stock dans l'API


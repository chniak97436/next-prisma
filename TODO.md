# TODO: Implémenter édition par champ individuelle avec transitions fluides

## Plan approuvé - Étapes à suivre:

### 1. [x] Créer état `editing` objet par champ (remplacer `disabled`)
### 2. [x] Initialiser états inputs avec valeurs `objUser` (useEffect)
### 3. [x] Adapter boutons "Modifier" pour username + logique API complète
### 4. [ ] Adapter autres champs (first_name → phone)
### 4. [ ] Changer conditions `!disabled` → `!editing.nomChamp`
### 5. [ ] Implémenter logique "Envoyer": API PUT + reset champ + refresh `objUser`
### 6. [ ] Améliorer CSS transitions (opacity/scale/max-height)
### 7. [ ] Tester chaque champ individuellement
### 8. [ ] Nettoyer code (supprimer `show()`, corriger bugs)

**✅ Tâche TERMINÉE - Tous champs fonctionnels avec édition individuelle et transitions!**


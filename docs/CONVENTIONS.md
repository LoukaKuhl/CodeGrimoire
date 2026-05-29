# CONVENTIONS — CodeGrimoire

**Version :** 2.0
**Date :** 29 mai 2026
**Statut :** Actif
**Auteur :** Louka Kuhl — Agence418
**Projet :** CodeGrimoire — Bloc-notes de code privé
**Stack :** HTML · Tailwind CSS · JavaScript vanilla · Node.js · Express · Supabase · Vercel

> Toute contribution doit respecter ces règles sans exception.
> Ce document existe pour qu'un développeur qui rejoint le projet puisse contribuer sans poser de questions.

---

## Comment utiliser ce document

Référence unique pour le développement de CodeGrimoire. En cas de doute, consulter ce document avant d'écrire du code. Lancer `npm run lint` avant chaque commit. Les règles marquées **[à trancher]** sont documentées mais pas encore finalisées — elles le seront au fur et à mesure du projet.

---

## Décisions d'architecture

| Décision | Choix | Pourquoi |
|----------|-------|----------|
| Frontend | HTML + Tailwind + JS vanilla | 5 semaines de stage — React aurait réduit le temps fonctionnel |
| Backend | Node.js + Express | Même langage front et back, courbe d'apprentissage réduite |
| Base de données | Supabase (PostgreSQL) | Hébergement gratuit, API REST intégrée, dashboard visuel |
| Déploiement | Vercel | Intégration GitHub native, gratuit, zero-config Node.js |
| CSS | Tailwind | Pas de fichier CSS à maintenir, classes utilitaires dans le HTML |
| Paradigme | Procédural | Fonctions + objets de configuration — pas de classes |
| Modules backend | CommonJS | `require` / `module.exports` — pas de `"type": "module"` dans `package.json` |
| Modules frontend | Scripts classiques | `<script src>` + variables globales — pas d'`import/export` |
| Déclaration de fonction | `function` pour les nommées, `=>` pour les callbacks | Lisibilité et cohérence avec les exemples du projet |
| Rendu DOM | `innerHTML` pour les listes, `textContent` pour les valeurs unitaires | Simplicité — risque XSS limité, projet privé, choix assumé |
| Event handlers | `onclick` inline | Cohérence avec l'architecture sans modules |
| Retour utilisateur | `alert()` | Choix assumé — pas de composant toast dans ce projet |
| Nommage des fonctions | Verbes français + termes techniques anglais | Lisibilité en contexte francophone (`chargerSnippets`, `afficherDetail`) |

---

## Table des matières

1. [Principes](#1-principes)
2. [Nommage](#2-nommage)
3. [Formatage](#3-formatage)
4. [Commentaires](#4-commentaires)
5. [JavaScript — syntaxe](#5-javascript--syntaxe)
7. [JavaScript — paradigmes](#7-javascript--paradigmes)
8. [HTML](#8-html)
9. [Tailwind CSS](#9-tailwind-css)
10. [Backend Node.js](#10-backend-nodejs)
11. [Base de données](#11-base-de-données)
12. [Gestion des erreurs](#12-gestion-des-erreurs)
13. [Sécurité et environnements](#13-sécurité-et-environnements)
14. [Git](#14-git)
15. [Structure du projet](#15-structure-du-projet)
16. [Interfaces](#16-interfaces)
17. [ESLint](#17-eslint)
18. [Changelog](#18-changelog)

---

## 1. Principes

1. **Lisibilité** — le code est écrit pour être lu par un humain.
2. **Responsabilité unique** — une fonction fait une seule chose. Si tu dois écrire "et" pour la décrire, découpe-la.
3. **Cohérence** — les mêmes règles s'appliquent partout, sans exception.
4. **Français** — commentaires, messages utilisateur et commits en français. Noms de fonctions : verbes français + termes techniques anglais (`chargerSnippets`, `afficherDetail`). Choix assumé, documenté ici pour éviter les hésitations.
5. **Procédural** — pas de classes, pas de POO. Fonctions nommées + objets de configuration uniquement.
6. **Pas de code mort** — supprimer tout code commenté ou variable inutilisée avant de commiter.

---

## 2. Nommage

### Variables et fonctions JavaScript

| Contexte | Convention | Exemple | Pourquoi |
|----------|-----------|---------|----------|
| Variable | camelCase | `tousLesSnippets`, `snippetId` | Cohérence avec les API JS natives |
| Fonction nommée | camelCase | `chargerSnippets()`, `afficherDetail()` | Standard JS universel |
| Fonction async | camelCase | `async function supprimerSnippet()` | Idem |
| Constante globale | SCREAMING_SNAKE_CASE | `API_URL` | Signale qu'elle ne change jamais |
| Booléen | `is` / `has` + camelCase | `isLoading`, `hasError` | Rend le `if` lisible comme une phrase |
| Tableau | pluriel | `snippets`, `tousLesSnippets` | Indique que c'est une liste |
| Handler d'événement | `handle` + action | `handleClick`, `handleSubmit` | Distingue les handlers des autres fonctions |

### Abréviations autorisées

| Abréviation | Contexte |
|-------------|----------|
| `req`, `res` | Paramètres Express uniquement |
| `s` | Callbacks courts sur snippets (`s => s.id === id`) |
| `err` | Paramètre de catch |

Toute autre abréviation est interdite.

### Attributs HTML

| Attribut | Convention | Exemples |
|----------|-----------|---------|
| `id` | kebab-case | `liste-snippets`, `detail-snippet`, `badge-langage`, `input-titre` |
| `class` | classes Tailwind | voir section 8 |

### Fichiers

| Contexte | Convention | Exemples |
|----------|-----------|---------|
| Tous les fichiers | kebab-case minuscules | `index.html`, `app.js`, `formulaire.js` |
| Documentation | MAJUSCULES | `README.md`, `CONVENTIONS.md` |

### Base de données

| Contexte | Convention | Exemples |
|----------|-----------|---------|
| Tables | snake_case minuscules | `snippets`, `users` |
| Colonnes | snake_case minuscules | `id`, `title`, `created_at`, `user_id` |

Chaque table contient `id` (clé primaire) et `created_at` (horodatage automatique).

---

## 3. Formatage

| Règle | Valeur | Pourquoi |
|-------|--------|----------|
| Indentation | 4 espaces | Les tabulations s'affichent différemment selon les éditeurs |
| Longueur de ligne | 100 caractères max | Au-delà, illisible sans scroll horizontal |
| Points-virgules | Omis | Style cohérent — ESLint enforce la règle |
| Guillemets JS | Apostrophes `'...'` ou backticks | Ne pas mélanger les styles |
| Guillemets HTML/JSON | Doubles `"..."` | Standard HTML5 et JSON |

```javascript
// ✅
const response = await fetch(`${API_URL}/snippets`)
const snippets = await response.json()

// ❌
const response = await fetch(`${API_URL}/snippets`);
```

---

## 4. Commentaires

### Délimiteurs de sections

```javascript
// ============ NOM DE LA SECTION ============
```

```html
<!-- ============ NOM DE LA SECTION ============ -->
```

### Sections obligatoires par fichier

**`app.js`**
```
// ============ URL DE L'API ============
// ============ COULEURS DES BADGES PAR LANGAGE ============
// ============ CHARGER LES SNIPPETS ============
// ============ AFFICHER LES SNIPPETS DANS LA SIDEBAR ============
// ============ AFFICHER LE DETAIL D'UN SNIPPET ============
// ============ MODIFIER UN SNIPPET ============
// ============ SUPPRIMER UN SNIPPET ============
// ============ LANCEMENT AU CHARGEMENT DE LA PAGE ============
```

**`formulaire.js`**
```
// ============ URL DE L'API ============
// ============ AU CHARGEMENT DE LA PAGE ============
// ============ CHARGER LES DONNEES DU SNIPPET ============
// ============ SAUVEGARDER UN SNIPPET ============
```

**`server.js`**
```
// ============ IMPORTS ============
// ============ CRÉATION DU SERVEUR ============
// ============ CONFIGURATION ============
// ============ ROUTES ============
// ============ ROUTE DE TEST ============
// ============ DÉMARRAGE ============
```

**`routes/snippets.js`**
```
// ============ IMPORTS ============
// ============ GET - Récupérer tous les snippets ============
// ============ POST - Créer un snippet ============
// ============ PUT - Modifier un snippet ============
// ============ DELETE - Supprimer un snippet ============
```

### Commentaires de code

Chaque ligne non triviale est commentée sur la ligne suivante, en français. Règle adaptée au contexte de stage — allégement progressif prévu.

```javascript
const response = await fetch(`${API_URL}/snippets`)
// fetch : envoie une requête GET à notre API

const snippet = tousLesSnippets.find(s => s.id === id)
// .find() : cherche le snippet dont l'id correspond

delete document.getElementById('detail-snippet').dataset.id
// Efface l'id mémorisé après suppression
```

---

## 5. JavaScript — syntaxe

### Déclarations de variables

`const` par défaut. `let` si réassignation. `var` interdit.
→ `var` a une portée de fonction, source de bugs silencieux.

```javascript
// ✅
const API_URL = 'http://localhost:3000'
let tousLesSnippets = []

// ❌
var API_URL = 'http://localhost:3000'
```

### Déclaration de fonctions

`function` pour les fonctions nommées. Arrow `=>` pour les callbacks et anonymes.

```javascript
// ✅ — fonction nommée
async function chargerSnippets() { ... }
function afficherSnippets(snippets) { ... }

// ✅ — callback court
snippets.map(s => `<div>${s.title}</div>`)
tousLesSnippets.find(s => s.id === id)

// ❌ — arrow pour une fonction nommée
const chargerSnippets = async () => { ... }
```

### Async/Await

`async/await` obligatoire. `.then()` interdit.
→ Le flux se lit de haut en bas comme du code synchrone.

```javascript
// ✅
async function chargerSnippets() {
    const response = await fetch(`${API_URL}/snippets`)
    const snippets = await response.json()
    afficherSnippets(snippets)
}

// ❌
fetch(`${API_URL}/snippets`)
    .then(r => r.json())
    .then(s => afficherSnippets(s))
```

### Comparaisons

Toujours `===` et `!==`. Jamais `==` ou `!=`.
→ `==` fait une conversion de type implicite (`0 == false` est `true`).

```javascript
// ✅
if (snippets.length === 0) { return }
if (!snippet) return

// ❌
if (snippets.length == 0) { return }
```

### Déstructuration

Extraire les propriétés d'objets plutôt que de les répéter.

```javascript
// ✅
const { title, code, language, tags } = req.body
const { id } = req.params
const { data, error } = await supabase.from('snippets').select('*')

// ❌
const title = req.body.title
const id = req.params.id
```

### Template literals

Template literals obligatoires pour toute concaténation de chaîne.

```javascript
// ✅
const url = `${API_URL}/snippets/${id}`
liste.innerHTML = snippets.map(s => `<div>${s.title}</div>`).join('')

// ❌
const url = API_URL + '/snippets/' + id
```

### Retour anticipé (guard clause)

Retourner tôt plutôt qu'imbriquer.

```javascript
// ✅
if (!id) {
    alert('Sélectionne un snippet !')
    return
}
// suite du code...

// ❌
if (id) {
    // code imbriqué sur 30 lignes
}
```

### Méthodes de tableau

`map`, `filter`, `find` pour les transformations. `forEach` pour les effets de bord.

```javascript
// ✅
const html = snippets.map(s => `<div>${s.title}</div>`).join('')
const jsSnippets = snippets.filter(s => s.language === 'JavaScript')
const snippet = snippets.find(s => s.id === id)

// ❌
for (let i = 0; i < snippets.length; i++) {
    if (snippets[i].id === id) { ... }
}
```

---

## 6. JavaScript — syntaxe avancée

### Optional chaining `?.`

Autorisé pour accéder à une propriété qui pourrait être `null` ou `undefined`.

```javascript
// ✅
const language = snippet?.language
const badge = badgeColors?.[language]

// ❌ — vérification manuelle inutile
const language = snippet ? snippet.language : undefined
```

### Nullish coalescing `??`

`??` pour les valeurs par défaut. `||` interdit pour cet usage.
→ `||` considère `0` et `''` comme faux. `??` uniquement `null` et `undefined`.

```javascript
// ✅
const port = process.env.PORT ?? 3000
const language = snippet.language ?? 'Autre'

// ❌
const port = process.env.PORT || 3000
```

### Ternaire

Autorisé sur une seule ligne pour les cas simples. Imbrication interdite.

```javascript
// ✅ — simple et lisible
const badge = badgeColors[language] ?? 'bg-gray-500 text-white'
const label = isLoading ? 'Chargement...' : 'Sauvegarder'

// ❌ — ternaire imbriqué illisible
const label = isLoading ? 'Chargement...' : hasError ? 'Erreur' : 'OK'
```

### Paramètres par défaut

Paramètres par défaut dans la signature de fonction. Vérification manuelle interdite.

```javascript
// ✅
function getBadge(language = 'Autre') {
    return badgeColors[language] ?? 'bg-gray-500 text-white'
}

// ❌
function getBadge(language) {
    const lang = language || 'Autre'
    return badgeColors[lang]
}
```

### `forEach` vs `for...of`

`forEach` pour les effets de bord sur les tableaux. `for...of` pour les itérables non-tableaux. Boucles `for` classiques interdites.

```javascript
// ✅ — effet de bord sur tableau
snippets.forEach(s => console.error(s.title))

// ✅ — itérable non-tableau
for (const [key, value] of Object.entries(badgeColors)) { ... }

// ❌ — boucle classique
for (let i = 0; i < snippets.length; i++) { ... }
```

### `reduce`

`reduce` autorisé uniquement si `map` + `filter` ne suffisent pas. Toujours avec une valeur initiale.

```javascript
// ✅ — cas où reduce est justifié
const parLanguage = snippets.reduce((acc, s) => {
    acc[s.language] = (acc[s.language] ?? 0) + 1
    return acc
}, {})

// ❌ — reduce quand map suffit
const titres = snippets.reduce((acc, s) => [...acc, s.title], [])
// → utiliser snippets.map(s => s.title) à la place
```

### Supabase : colonnes explicites vs `select('*')`

`select('*')` autorisé pendant le développement. En production (S5), préférer les colonnes explicites.

```javascript
// ✅ Développement
await supabase.from('snippets').select('*')

// ✅ Production (S5)
await supabase.from('snippets').select('id, title, language, tags, created_at')
```

### Validation : où et comment

Validation côté frontend obligatoire avant tout appel API. Validation côté backend recommandée à partir de S4.

| Couche | Validation | Quand |
|--------|-----------|-------|
| Frontend | Vérification manuelle (`if (!title)`) | Maintenant |
| Backend | Vérification dans la route | S4 |

```javascript
// ✅ Frontend — validation manuelle actuelle
if (!title || !language || !code) {
    alert('Merci de remplir le titre, le langage et le code !')
    return
}

// ✅ Backend — à ajouter en S4
if (!title || !language || !code) {
    throw new ValidationError('Titre, code et langage sont obligatoires')
}
```

### Shorthand object

Toujours utiliser le shorthand quand la clé et la variable ont le même nom.

```javascript
// ✅
const snippet = { title, code, language, tags }
res.json({ data, error })

// ❌
const snippet = { title: title, code: code, language: language }
res.json({ data: data, error: error })
```

### Spread `...`

`...` pour copier ou fusionner des objets et tableaux. `Object.assign` interdit.

```javascript
// ✅ — copie d'objet
const updated = { ...snippet, title: 'Nouveau titre' }

// ✅ — copie de tableau
const newSnippets = [...tousLesSnippets, nouveauSnippet]

// ❌
const updated = Object.assign({}, snippet, { title: 'Nouveau titre' })
```

### `await` séquentiel vs `Promise.all`

`await` séquentiel par défaut. `Promise.all` uniquement si les requêtes sont indépendantes et doivent tourner en parallèle.

```javascript
// ✅ — séquentiel (une requête dépend de l'autre)
const { data: snippet } = await supabase.from('snippets').select('*').eq('id', id)
const { data: user } = await supabase.from('users').select('*').eq('id', snippet.user_id)

// ✅ — parallèle (requêtes indépendantes)
const [snippets, users] = await Promise.all([
    supabase.from('snippets').select('*'),
    supabase.from('users').select('*')
])

// ❌ — séquentiel quand les requêtes sont indépendantes (inutilement lent)
const { data: snippets } = await supabase.from('snippets').select('*')
const { data: users } = await supabase.from('users').select('*')
```

### Ordre des imports dans `server.js` et les routes

```javascript
// 1. Modules natifs Node.js
const path = require('path')

// 2. Modules externes (npm)
const express = require('express')
const cors = require('cors')

// 3. Modules internes (fichiers du projet)
const { supabase } = require('./supabase')
const snippetsRouter = require('./routes/snippets')
```

### `module.exports`

`module.exports = valeur` pour exporter une seule chose. `module.exports = { a, b }` pour exporter plusieurs choses.

```javascript
// ✅ — export unique
module.exports = router

// ✅ — exports multiples
module.exports = { supabase }

// ❌ — exports.x interdit
exports.supabase = supabase
```

### Chaînage de méthodes

Autorisé jusqu'à 3 méthodes chainées. Au-delà, découper en variables intermédiaires.

```javascript
// ✅ — 2 méthodes, lisible
const html = snippets.map(s => `<div>${s.title}</div>`).join('')

// ✅ — 3 méthodes max
const jsSnippets = snippets
    .filter(s => s.language === 'JavaScript')
    .map(s => s.title)
    .join(', ')

// ❌ — trop long, découper
const result = snippets.filter(...).map(...).reduce(...).sort(...).join(...)
```

### Nombres magiques

Les nombres magiques sont interdits. Toute valeur répétée ou non évidente est extraite en constante.

```javascript
// ✅
const PORT = 3000
const HTTP_NOT_FOUND = 404
const HTTP_BAD_REQUEST = 400

// ❌
app.listen(3000, ...)
res.status(404).json(...)
```

### `localStorage` et `sessionStorage`

Interdits jusqu'en S4. L'authentification Supabase gère la session.
À partir de S4 : uniquement pour les préférences UI (thème, etc.), jamais pour les données sensibles.

```javascript
// ❌ — avant S4
localStorage.setItem('user', JSON.stringify(user))

// ✅ — S4 : Supabase Auth gère la session
const { data: { session } } = await supabase.auth.getSession()
```

---

## 7. JavaScript — paradigmes

### Paradigme général

Procédural uniquement. Pas de classes.

```javascript
// ✅ — objet de configuration
const badgeColors = {
    'JavaScript': 'bg-yellow-500 text-black',
    'Python': 'bg-blue-500 text-white'
}
function getBadge(language) {
    return badgeColors[language] || 'bg-gray-500 text-white'
}

// ❌ — classe interdite
class SnippetManager {
    constructor() { ... }
    charger() { ... }
}
```

### Système de modules

| Couche | Système | Exemple |
|--------|---------|---------|
| Backend | CommonJS | `require('express')` / `module.exports` |
| Frontend | Scripts classiques + globales | `<script src="app.js">` |

```javascript
// ✅ Backend — CommonJS
const express = require('express')
module.exports = router

// ❌ Backend — ESM interdit
import express from 'express'

// ✅ Frontend — variable globale
let tousLesSnippets = []

// ❌ Frontend — import/export interdit
import { chargerSnippets } from './utils.js'
```

### Immutabilité

Préférer les méthodes non-mutantes. Éviter la mutation directe des tableaux et objets.

```javascript
// ✅
const nouveauxSnippets = [...tousLesSnippets, nouveauSnippet]

// ❌
tousLesSnippets.push(nouveauSnippet)
```

### État frontend

Variables globales pour l'état partagé entre fonctions.

```javascript
// ✅ — état global simple
const API_URL = 'http://localhost:3000'
let tousLesSnippets = []
```

---

## 8. HTML

### Structure obligatoire

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeGrimoire - [Page]</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-950 text-white min-h-screen">

    <!-- ============ CONTENU ============ -->

    <script src="[fichier].js"></script>
</body>
</html>
```

### Ordre des attributs

```
id → class → type → name → placeholder → value → onclick → href
```

### Event handlers

`onclick` inline dans le HTML. `addEventListener` interdit sauf cas exceptionnel justifié.

```html
<!-- ✅ -->
<button onclick="sauvegarderSnippet()" class="bg-purple-600 text-white px-6 py-2 rounded-lg">
    Sauvegarder
</button>

<!-- ❌ -->
<button id="btn-save">Sauvegarder</button>
<!-- + document.getElementById('btn-save').addEventListener('click', ...) -->
```

### Rendu DOM

`innerHTML` avec template literals pour les listes. `textContent` pour les valeurs unitaires.

```javascript
// ✅ — liste (innerHTML)
liste.innerHTML = snippets.map(s => `
    <div onclick="afficherDetail(${s.id})">${s.title}</div>
`).join('')

// ✅ — valeur unitaire (textContent — pas de risque XSS)
document.querySelector('#detail-snippet h2').textContent = snippet.title
document.querySelector('#detail-snippet pre').textContent = snippet.code
```

> `innerHTML` est utilisé sur des données internes. Risque XSS limité dans ce contexte de projet privé — choix assumé.

### Sélecteurs DOM

```javascript
// ✅ — id unique
document.getElementById('liste-snippets')

// ✅ — sélecteur complexe
document.querySelector('#detail-snippet h2')

// ❌ — querySelector pour un id simple
document.querySelector('#liste-snippets')
```

Règles : 4 espaces · balises fermées · `<script>` avant `</body>`.

### `classList` vs `className`

`classList` pour ajouter ou retirer des classes dynamiquement. `className` pour remplacer toutes les classes d'un coup.

```javascript
// ✅ — ajouter/retirer une classe
element.classList.add('bg-purple-600')
element.classList.remove('bg-gray-700')
element.classList.toggle('hidden')

// ✅ — remplacer toutes les classes (badges)
badge.className = `text-xs px-2 py-0.5 rounded-full ${getBadge(language)}`

// ❌ — className pour ajouter une seule classe
element.className = element.className + ' bg-purple-600'
```

### Self-closing tags

Pas de self-closing sur les balises HTML5 void. `<input>` et non `<input />`.

```html
<!-- ✅ -->
<input id="input-titre" type="text">
<meta charset="UTF-8">
<br>

<!-- ❌ -->
<input id="input-titre" type="text" />
<meta charset="UTF-8" />
```

### Attributs booléens

Attributs booléens sans valeur. Pas de `="true"` ou `="false"`.

```html
<!-- ✅ -->
<button disabled>Sauvegarder</button>
<input required type="text">

<!-- ❌ -->
<button disabled="true">Sauvegarder</button>
<input required="required" type="text">
```

### Accessibilité `aria-*`

`aria-label` obligatoire sur les boutons sans texte visible. `role` sur les éléments interactifs non-sémantiques.

```html
<!-- ✅ -->
<button onclick="supprimerSnippet()" aria-label="Supprimer le snippet">
    🗑
</button>
<div role="list" id="liste-snippets">
<div role="listitem" onclick="afficherDetail(${s.id})">

<!-- ❌ -->
<button onclick="supprimerSnippet()">🗑</button>
```

### Mutation des paramètres de fonction

Interdite. Ne jamais modifier un paramètre reçu — créer une copie.

```javascript
// ✅
function formaterSnippet(snippet) {
    return { ...snippet, title: snippet.title.trim() }
}

// ❌
function formaterSnippet(snippet) {
    snippet.title = snippet.title.trim()
    return snippet
}
```

### `dataset` vs autre mécanisme de mémorisation

`dataset` pour mémoriser une valeur sur un élément DOM. Jamais de variable globale dédiée pour ça.

```javascript
// ✅ — dataset pour mémoriser l'id actif
document.getElementById('detail-snippet').dataset.id = id
const id = document.getElementById('detail-snippet').dataset.id
delete document.getElementById('detail-snippet').dataset.id

// ❌ — variable globale dédiée
let snippetActifId = null
```

### Navigation

`window.location.href` pour toutes les redirections. History API interdite.

```javascript
// ✅
window.location.href = 'index.html'
window.location.href = `formulaire.html?id=${id}`

// ❌
history.pushState({}, '', '/formulaire')
```

### Délégation d'événements

Délégation d'événements sur le conteneur parent quand les éléments sont générés dynamiquement.

```javascript
// ✅ — délégation sur le conteneur
document.getElementById('liste-snippets').addEventListener('click', (e) => {
    const item = e.target.closest('[data-id]')
    if (item) afficherDetail(Number(item.dataset.id))
})

// ❌ — listener sur chaque élément généré
snippets.forEach(s => {
    document.getElementById(`snippet-${s.id}`)
        .addEventListener('click', () => afficherDetail(s.id))
})
```

### Balises sémantiques

Utiliser les balises sémantiques HTML5. `<div>` uniquement quand aucune balise sémantique ne convient.

| Balise | Usage |
|--------|-------|
| `<nav>` | Barre de navigation |
| `<main>` | Contenu principal |
| `<aside>` | Sidebar |
| `<section>` | Section de contenu groupé |
| `<header>` | En-tête de page ou section |
| `<footer>` | Pied de page |

```html
<!-- ✅ -->
<nav class="bg-gray-900 px-6 py-4">
<aside class="w-80 bg-gray-900">
<main class="flex-1 bg-gray-950 p-6">

<!-- ❌ -->
<div class="bg-gray-900 px-6 py-4">
<div class="w-80 bg-gray-900">
```

### Accessibilité

Chaque `<input>` doit avoir un `<label>` associé.

```html
<!-- ✅ -->
<label for="input-titre" class="text-sm text-gray-400">Titre</label>
<input id="input-titre" type="text" placeholder="...">

<!-- ❌ -->
<input id="input-titre" type="text" placeholder="Titre...">
```


---

## 9. Tailwind CSS

Tailwind en priorité. `style=""` interdit. `style.css` réservé aux exceptions.

### Ordre des classes

```
layout → spacing → sizing → colors → typography → borders → interactivity
```

### Palette du projet

| Élément | Classe |
|---------|--------|
| Fond principal | `bg-gray-950` |
| Fond sidebar / nav | `bg-gray-900` |
| Fond cartes | `bg-gray-800` |
| Texte | `text-white` |
| Texte secondaire | `text-gray-400` |
| Accent | `text-purple-400` / `bg-purple-600` |
| Survol accent | `hover:bg-purple-700` |
| Bouton danger | `bg-red-700` / `hover:bg-red-600` |
| Bordures | `border-gray-700` / `border-gray-600` |
| Focus | `focus:border-purple-500 focus:outline-none` |

### Badges de langage

| Langage | Classes |
|---------|---------|
| JavaScript | `bg-yellow-500 text-black` |
| Python | `bg-blue-500 text-white` |
| HTML | `bg-orange-500 text-white` |
| CSS | `bg-pink-500 text-white` |
| SQL | `bg-cyan-500 text-white` |
| PHP | `bg-indigo-500 text-white` |
| Autre | `bg-gray-500 text-white` |

### Valeurs arbitraires `[...]`

Interdites. Utiliser uniquement les valeurs prédéfinies de la palette du projet.

```html
<!-- ✅ -->
<div class="bg-gray-950 text-white">

<!-- ❌ -->
<div class="bg-[#0a0a0f] text-[#ffffff]">
```

### `@apply` dans `style.css`

Interdit. Si une combinaison de classes se répète, la documenter dans les conventions plutôt que l'extraire avec `@apply`.

```css
/* ❌ */
.btn-primary {
    @apply bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700;
}
```

### Mobile-first et breakpoints

Le projet est une application de bureau (pas de responsive prévu). Les breakpoints Tailwind (`sm:`, `md:`, `lg:`) sont interdits sauf décision explicite en S5.

```html
<!-- ❌ — responsive non prévu -->
<div class="w-full md:w-80 lg:w-96">

<!-- ✅ — taille fixe assumée -->
<aside class="w-80 bg-gray-900">
```

### Duplication de classes

Quand un groupe de classes se répète plus de 3 fois, le documenter dans les conventions (section 8) plutôt que d'utiliser `@apply`.

```html
<!-- Si ce pattern apparaît 3+ fois, l'ajouter au tableau de la palette -->
<span class="text-xs px-2 py-0.5 rounded-full font-medium">
```

### Mode sombre `dark:`

Le projet utilise un thème sombre fixe (`bg-gray-950`). La variante `dark:` Tailwind est interdite jusqu'en S5.
En S5, la stratégie sera : `class` sur `<html>` (pas `media`).

```html
<!-- ❌ — avant S5 -->
<div class="bg-white dark:bg-gray-950">

<!-- ✅ — thème sombre fixe actuel -->
<div class="bg-gray-950">
```

---

## 10. Backend Node.js

### Structure de `server.js`

```javascript
// ============ IMPORTS ============
const express = require('express')
const cors = require('cors')
require('dotenv').config()

// ============ CRÉATION DU SERVEUR ============
const app = express()

// ============ CONFIGURATION ============
app.use(cors())
app.use(express.json())

// ============ ROUTES ============
const snippetsRouter = require('./routes/snippets')
app.use('/snippets', snippetsRouter)

// ============ ROUTE DE TEST ============
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur le serveur CodeGrimoire !' })
})

// ============ DÉMARRAGE ============
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`))
```

### Structure de `supabase.js`

```javascript
require('dotenv').config({ path: require('path').join(__dirname, '.env'), override: true })

const { createClient } = require('@supabase/supabase-js')
const ws = require('ws')
// ws : package WebSocket requis pour Node.js < 22

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    { realtime: { transport: ws } }
)

module.exports = { supabase }
```

### Modèle de route

```javascript
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('snippets').select('*')
        if (error) throw error
        res.json(data)
    } catch (error) {
        res.status(error.statusCode || 500).json({
            type: error.name || 'ServerError',
            message: error.message
        })
    }
})
```


### Architecture des couches

Tout le code métier est dans `routes/`. Pas de séparation controllers/services pour ce projet.
→ Justification : durée du stage (5 semaines) — la séparation en couches sera introduite si le projet évolue.

```
routes/snippets.js   ← validation + logique + appel Supabase
```

### Validation des variables d'environnement

Les variables d'environnement critiques sont vérifiées au démarrage du serveur.

```javascript
// ============ VALIDATION ENV ============
const REQUIRED_ENV = ['SUPABASE_URL', 'SUPABASE_SECRET_KEY']
REQUIRED_ENV.forEach(key => {
    if (!process.env[key]) {
        console.error(`Variable d'environnement manquante : ${key}`)
        process.exit(1)
        // process.exit(1) : arrête le serveur si une clé est manquante
    }
})
```

### Middleware d'erreur centralisé

`try/catch` dans chaque route. Pas de middleware d'erreur Express centralisé.
→ Justification : simplicité et lisibilité pour ce niveau de projet.

```javascript
// ✅ — try/catch par route (choix assumé)
router.get('/', async (req, res) => {
    try { ... }
    catch (error) {
        res.status(error.statusCode || 500).json({ type: error.name, message: error.message })
    }
})

// ❌ — middleware centralisé (trop avancé pour ce projet)
app.use((err, req, res, next) => { ... })
```

### Format des réponses

| Cas | Format |
|-----|--------|
| Succès | Data brute — `res.json(data)` |
| Erreur | `{ type, message }` — `res.status(400).json({ type: 'ValidationError', message: '...' })` |

### Codes HTTP

| Code | Usage |
|------|-------|
| `200` | GET / PUT / DELETE réussi |
| `201` | POST réussi |
| `400` | Données invalides |
| `404` | Ressource introuvable |
| `500` | Erreur serveur |

### Endpoints

| Méthode | Route | Action |
|---------|-------|--------|
| GET | `/snippets` | Récupérer tous les snippets |
| POST | `/snippets` | Créer un snippet |
| PUT | `/snippets/:id` | Modifier un snippet |
| DELETE | `/snippets/:id` | Supprimer un snippet |

---

## 11. Base de données

### Table `snippets`

| Colonne | Type | Contrainte | Description |
|---------|------|------------|-------------|
| `id` | BIGINT | PRIMARY KEY | Auto-incrémenté |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Horodatage automatique |
| `title` | TEXT | NOT NULL | Titre |
| `code` | TEXT | NOT NULL | Code source |
| `language` | TEXT | NOT NULL | Langage |
| `tags` | TEXT | | Tags séparés par virgule |
| `user_id` | UUID | FK → users.id | Ajouté en S4 |

### Table `users` (S4)

| Colonne | Type | Contrainte |
|---------|------|------------|
| `id` | UUID | PRIMARY KEY |
| `email` | TEXT | UNIQUE NOT NULL |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |

### Requêtes utilisées

```javascript
await supabase.from('snippets').select('*')
await supabase.from('snippets').insert([{ title, code, language, tags }]).select()
await supabase.from('snippets').update({ title, code, language, tags }).eq('id', id).select()
await supabase.from('snippets').delete().eq('id', id)
```

### Migrations

Les modifications de schéma sont documentées dans `docs/migrations/` sous forme de fichiers SQL numérotés. Pas de modification directe depuis le dashboard Supabase sans fichier SQL correspondant.

```
docs/
└── migrations/
    ├── 001_create_snippets.sql
    ├── 002_add_user_id.sql      ← S4
    └── 003_add_rls.sql          ← S4
```

### Pagination

`.range()` Supabase pour paginer les résultats quand la liste dépasse 50 éléments.

```javascript
// ✅ — pagination
const { data } = await supabase
    .from('snippets')
    .select('*')
    .range(0, 19) // 20 résultats par page

// Actuel — pas de pagination nécessaire pour le moment
await supabase.from('snippets').select('*')
```

---

## 12. Gestion des erreurs


### Classes d'erreur personnalisées

Deux classes d'erreur custom pour distinguer les types d'erreurs dans les routes.

```javascript
class ValidationError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ValidationError'
        this.statusCode = 400
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = 'NotFoundError'
        this.statusCode = 404
    }
}
```

Usage dans les routes :

```javascript
if (!title || !code) throw new ValidationError('Titre et code obligatoires')
if (!data.length) throw new NotFoundError(`Snippet ${id} introuvable`)
```

- Toutes les fonctions `async` utilisent `try/catch`.
- Erreurs loggées avec `console.error()`, jamais `console.log()`.
- Champs obligatoires vérifiés avant l'appel API.
- Retour visuel via `alert()` — choix assumé, pas de composant toast.

```javascript
async function sauvegarderSnippet() {
    if (!title || !language || !code) {
        alert('Merci de remplir le titre, le langage et le code !')
        return
    }
    try {
        const response = await fetch(url, { ... })
        if (response.ok) {
            alert('Snippet sauvegardé !')
            window.location.href = 'index.html'
        }
    } catch (erreur) {
        console.error('Erreur :', erreur)
        alert('Impossible de contacter le serveur')
    }
}
```

---

## 13. Sécurité et environnements

### Variables d'environnement

Fichier `backend/.env` — jamais commité.

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SECRET_KEY=sb_secret_xxxxx
```

### Fichier `.gitignore`

```
node_modules/
.env
.DS_Store
```

### Règles

| Règle | Statut |
|-------|--------|
| Clés API dans `.env` uniquement | Obligatoire |
| `.gitignore` vérifié avant chaque push | Obligatoire |
| RLS Supabase | Désactivé (S2), activé en S4 |
| CORS | Configuré via `cors()` dans `server.js` |

### Environnements

| Env | `API_URL` | Statut |
|-----|-----------|--------|
| Développement | `http://localhost:3000` | Actuel |
| Production (S5) | Variable d'environnement Vercel | À configurer en S5 |

Migration prévue en S5 :

```javascript
// Actuel
const API_URL = 'http://localhost:3000'

// S5 — API_URL injectée par Vercel
const API_URL = process.env.API_URL || 'http://localhost:3000'
```

---

## 14. Git

### Format des commits

```
type : Description courte en français
```

Première lettre en majuscule. Pas de point final. Maximum 72 caractères.

### Types

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `design` | Modification visuelle |
| `refactor` | Amélioration du code |
| `docs` | Documentation |
| `test` | Tests |
| `chore` | Maintenance |

### Branches

| Branche | Usage | Exemple |
|---------|-------|---------|
| `main` | Production — toujours stable | |
| `feature/nom` | Nouvelle fonctionnalité | `feature/recherche-snippets` |
| `fix/nom` | Correction de bug | `fix/bug-modifier-sans-selection` |

Règles : ne jamais travailler sur `main` · merger uniquement après tests.

### Commits atomiques

Un commit = un changement logique. Ne pas mélanger plusieurs fonctionnalités dans un même commit.

```
// ✅ — atomique
feat : Bouton Supprimer fonctionnel
fix : Correction bug modifier sans sélection

// ❌ — trop de changements mélangés
feat : Supprimer + modifier + badges + fix bug
```


### Historique du projet

```
feat : Connexion Supabase + routes CRUD fonctionnelles
feat : Affichage des snippets dans la sidebar et détail au clic
feat : Formulaire POST fonctionnel
feat : Bouton Supprimer fonctionnel
feat : Bouton Modifier fonctionnel — CRUD complet
design : Badges de langage colorés
fix : Correction bug modifier sans sélection
docs : CONVENTIONS v1.5 — paradigmes et syntaxe complets
```

---


### Fichier de constantes partagées

Les constantes utilisées à la fois dans le frontend et les conventions (langages, couleurs de badges) sont définies dans un seul endroit : `app.js` côté frontend. Toute modification doit être répercutée dans les deux endroits.

| Constante | Définie dans | Référencée dans |
|-----------|-------------|-----------------|
| `badgeColors` | `app.js` | Section 9 CONVENTIONS.md |
| `API_URL` | `app.js`, `formulaire.js` | Section 13 CONVENTIONS.md |

## 15. Structure du projet

```
CodeGrimoire/
├── backend/
│   ├── routes/
│   │   └── snippets.js         Routes CRUD
│   ├── .env                    Variables secrètes (non versionné)
│   ├── server.js               Point d'entrée Express
│   └── supabase.js             Connexion Supabase
├── frontend/
│   ├── index.html              Page principale
│   ├── formulaire.html         Ajout et modification
│   ├── connexion.html          Anticipation S4 — non fonctionnel
│   ├── app.js                  JS principal
│   ├── formulaire.js           JS formulaire
│   └── style.css               Styles additionnels
├── docs/
│   └── CONVENTIONS.md          Ce document
├── .eslintrc.json              Configuration ESLint
├── .gitignore
├── package.json
└── README.md
```

---


### Tests

Pas de tests automatisés pendant le stage (5 semaines). Le type de commit `test` est réservé aux tests manuels documentés.
En production, le framework recommandé serait **Vitest** pour Node.js.

```
// ✅ — commit test = test manuel documenté
test : Vérification CRUD complet sur navigateur
test : Tests des cas limites formulaire vide
```

### JSDoc sur les fonctions

`@param` et `@returns` sur toutes les fonctions utilitaires. Optionnel sur les fonctions d'affichage et d'action.

```javascript
/**
 * Retourne les classes Tailwind du badge selon le langage.
 * @param {string} language - Langage de programmation
 * @returns {string} Classes Tailwind du badge
 */
function getBadge(language) {
    return badgeColors[language] || 'bg-gray-500 text-white'
}
```

## 16. Interfaces

Le projet est en JavaScript vanilla. Les interfaces sont documentées en JSDoc et anticipent une migration TypeScript.

### Règle

`interface` par défaut pour tout objet structuré. `type` uniquement pour les unions.

### JSDoc (JavaScript actuel)

```javascript
/**
 * @interface Snippet
 * @property {number} id
 * @property {string} title
 * @property {string} code
 * @property {string} language
 * @property {string} tags
 * @property {string} created_at
 * @property {string} [user_id] - optionnel avant S4
 */

/**
 * @interface User
 * @property {string} id
 * @property {string} email
 * @property {string} created_at
 */
```

### TypeScript (référence future)

```typescript
interface Snippet {
    id: number
    title: string
    code: string
    language: string
    tags: string
    created_at: string
    user_id?: string
}

interface User {
    id: string
    email: string
    created_at: string
}

// type pour les unions uniquement
type Langage = 'JavaScript' | 'Python' | 'HTML' | 'CSS' | 'SQL' | 'PHP'
```

---


## .editorconfig

Fichier `.editorconfig` à la racine du projet pour imposer l'indentation et l'encodage à tous les éditeurs.

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 4
trim_trailing_whitespace = true
insert_final_newline = true

[*.json]
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

→ Installe l'extension **EditorConfig for VS Code** (`editorconfig.editorconfig`) pour l'appliquer automatiquement.

---

## 17. ESLint

```bash
npm install --save-dev eslint
```

Scripts dans `package.json` :

```json
"scripts": {
    "lint": "eslint . --ext .js",
    "lint:fix": "eslint . --ext .js --fix"
}
```

Lancer **avant chaque commit** : `npm run lint`
Si le lint échoue, le commit ne doit pas être fait.

Fichier `.eslintrc.json` :

```json
{
  "env": { "browser": true, "node": true, "es2021": true },
  "extends": "eslint:recommended",
  "parserOptions": { "ecmaVersion": 2021 },
  "rules": {
    "no-var": "error",
    "prefer-const": "error",
    "eqeqeq": ["error", "always"],
    "no-console": ["warn", { "allow": ["error"] }],
    "no-unused-vars": "warn"
  }
}
```


### Prettier

Prettier n'est pas installé dans ce projet. ESLint seul gère le formatage.
→ Risque : ESLint ne corrige pas l'indentation et les guillemets aussi finement que Prettier.
→ Compensation : l'extension Prettier de VS Code est recommandée pour le formatage automatique à la sauvegarde.

Configurer VS Code (`settings.json`) :
```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "prettier.singleQuote": true,
    "prettier.semi": false,
    "prettier.tabWidth": 4
}
```

| Règle | Niveau | Pourquoi |
|-------|--------|----------|
| `no-var` | error | Portée de fonction = bugs silencieux |
| `prefer-const` | error | Signale l'intention clairement |
| `eqeqeq` | error | Évite les conversions implicites |
| `no-console` | warn | Debug oublié en production |
| `no-unused-vars` | warn | Code mort détecté automatiquement |

---

## 18. Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 27/05/2026 | Création |
| 1.1 | 28/05/2026 | Comparaisons, Déstructuration, ESLint, Environnements, Async/Await |
| 1.2 | 29/05/2026 | Statut, branches Git, lint avant commit |
| 1.3 | 29/05/2026 | Décisions d'architecture, Pourquoi, Types/Interfaces, Classes d'erreurs |
| 1.4 | 29/05/2026 | Version allégée, interface par défaut |
| 1.5 | 29/05/2026 | Retour Benoît Pascal : paradigmes explicites, function vs arrow, modules, DOM, event handlers, guard clauses, immutabilité, format réponses, nommage mixte justifié |
| 1.6 | 29/05/2026 | Syntaxe avancée : optional chaining, nullish coalescing, ternaire, paramètres par défaut, forEach vs for...of, reduce, select Supabase, validation front/back |
| 1.7 | 29/05/2026 | Shorthand object, spread, Promise.all, ordre des imports, module.exports |
| 1.8 | 29/05/2026 | Chaînage, nombres magiques, localStorage, balises sémantiques, accessibilité, Tailwind arbitraire, @apply, Prettier vs ESLint |
| 1.9 | 29/05/2026 | dataset, window.location.href, délégation d'événements, migrations BDD, pagination Supabase, .editorconfig |
| 2.0 | 29/05/2026 | classList, self-closing, aria-*, booléens HTML, mutation paramètres, mobile-first, dark:, duplication Tailwind, couches backend, validation env, middleware, classes d'erreur, commits atomiques, constantes partagées, tests, JSDoc |

---

*Louka Kuhl — Agence418 — 2026*
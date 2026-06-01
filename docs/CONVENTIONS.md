# CONVENTIONS — CodeGrimoire

**Version :** 3.13
**Date :** 29 mai 2026
**Statut :** Actif
**Auteur :** Louka Kuhl — Agence418
**Projet :** CodeGrimoire — Bloc-notes de code privé
**Stack :** HTML · Tailwind CSS · JavaScript vanilla · Node.js · Express · Supabase · Vercel

> Toute contribution doit respecter ces règles sans exception.
> Ce document existe pour qu'un développeur qui rejoint le projet puisse contribuer sans poser de questions.

---

## Comment utiliser ce document

Référence unique pour le développement de CodeGrimoire. En cas de doute, consulter ce document avant d'écrire du code. Lancer `npm run lint` avant chaque commit.

---

## Décisions d'architecture

| Décision | Choix | Pourquoi |
|----------|-------|----------|
| Frontend | HTML + Tailwind + JS vanilla | 5 semaines de stage — React aurait réduit le temps fonctionnel |
| Backend | Node.js + Express | Même langage front et back, courbe d'apprentissage réduite |
| Base de données | Supabase (PostgreSQL) | Hébergement gratuit, API REST intégrée, dashboard visuel |
| Déploiement | Vercel | Intégration GitHub native, gratuit, zero-config Node.js |
| CSS | Tailwind | Pas de fichier CSS à maintenir, classes utilitaires dans le HTML |
| Paradigme | Procédural | Fonctions + objets de configuration — pas de classes (exception : `ValidationError`, `NotFoundError`) |
| Modules backend | CommonJS | `require` / `module.exports` — pas de `"type": "module"` dans `package.json` |
| Modules frontend | Scripts classiques | `<script src>` + variables globales — pas d'`import/export` |
| Déclaration de fonction | `function` pour les nommées, `=>` pour les callbacks | Lisibilité et cohérence |
| Rendu DOM | `innerHTML` pour les listes, `textContent` pour les valeurs unitaires | Simplicité — risque XSS limité, projet privé, choix assumé |
| Event handlers | `onclick` inline pour les statiques, délégation pour les dynamiques | Cohérence avec l'architecture sans modules |
| Retour utilisateur | `alert()` | Choix assumé — pas de composant toast dans ce projet |
| Nommage des fonctions | Verbes français + termes techniques anglais | Lisibilité en contexte francophone (`chargerSnippets`, `afficherDetail`) |
| Lancement frontend | `window.onload = fonction` | Garantit que le DOM est chargé avant exécution |
| API_URL | Détection dynamique via `window.location.hostname` | Pas de modification manuelle entre dev et prod |

---

## Table des matières

1. [Principes](#1-principes)
2. [Nommage](#2-nommage)
3. [Formatage](#3-formatage)
4. [Commentaires](#4-commentaires)
5. [JavaScript — syntaxe](#5-javascript--syntaxe)
6. [JavaScript — syntaxe avancée](#6-javascript--syntaxe-avancée)
7. [JavaScript — paradigmes](#7-javascript--paradigmes)
8. [HTML](#8-html)
9. [Tailwind CSS](#9-tailwind-css)
10. [Backend Node.js](#10-backend-nodejs)
11. [Base de données](#11-base-de-données)
12. [Gestion des erreurs](#12-gestion-des-erreurs)
13. [Sécurité et environnements](#13-sécurité-et-environnements)
14. [Git](#14-git)
15. [Structure du projet](#15-structure-du-projet)
16. [Tests](#16-tests)
17. [Interfaces et JSDoc](#17-interfaces-et-jsdoc)
18. [Outillage](#18-outillage)
19. [Changelog](#19-changelog)

---

## 1. Principes

1. **Lisibilité** — le code est écrit pour être lu par un humain.
2. **Responsabilité unique** — une fonction fait une seule chose. Si tu dois écrire "et" pour la décrire, découpe-la.
3. **Cohérence** — les mêmes règles s'appliquent partout, sans exception.
4. **Français** — commentaires, messages utilisateur et commits en français. Noms de fonctions : verbes français + termes techniques anglais. Choix assumé.
5. **Procédural** — pas de classes, pas de POO. Exception explicite et unique : `ValidationError` et `NotFoundError` dans `routes/snippets.js`.
6. **Pas de code mort** — supprimer tout code commenté ou variable inutilisée avant de commiter.

---

## 2. Nommage

### Variables et fonctions JavaScript

| Contexte | Convention | Exemple | Pourquoi |
|----------|-----------|---------|----------|
| Variable | camelCase | `tousLesSnippets`, `snippetId` | Cohérence avec les API JS natives |
| Fonction nommée | camelCase | `chargerSnippets()`, `afficherDetail()` | Standard JS universel |
| Fonction async | camelCase | `async function supprimerSnippet()` | Idem |
| Constante globale | SCREAMING_SNAKE_CASE | `API_URL`, `PORT` | Signale une valeur de configuration globale (même si dynamique) |
| Booléen | `is` / `has` + camelCase | `isLoading`, `hasError` | Rend le `if` lisible comme une phrase |
| Tableau | pluriel | `snippets`, `tousLesSnippets` | Indique que c'est une liste |
| Handler d'événement | `handle` + action | `handleClick`, `handleSubmit` | Distingue les handlers des autres fonctions |

### Abréviations autorisées

| Abréviation | Contexte |
|-------------|----------|
| `req`, `res` | Paramètres Express uniquement |
| `s` | Callbacks courts sur snippets (`s => s.id === id`) |
| `err` | Paramètre de catch |
| `acc` | Paramètre accumulateur dans `reduce` |
| `e` | Paramètre d'événement dans les listeners |

Toute autre abréviation est interdite.

### Attributs HTML

| Attribut | Convention | Exemples |
|----------|-----------|---------|
| `id` | kebab-case | `liste-snippets`, `detail-snippet`, `detail-badge`, `input-titre` |
| `class` | classes Tailwind | voir section 9 |

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
// ============ URL DE L'API DETECTÉE DYNAMIQUEMENT ============
// ============ COULEURS DES BADGES PAR LANGAGE ============
// ============ ÉTAT GLOBAL ============
// ============ CHARGER LES SNIPPETS ============
// ============ AFFICHER LES SNIPPETS DANS LA SIDEBAR ============
// ============ CONFIGURATION DE LA DÉLÉGATION D'ÉVÉNEMENTS ============
// ============ AFFICHER LE DETAIL D'UN SNIPPET ============
// ============ MODIFIER UN SNIPPET ============
// ============ SUPPRIMER UN SNIPPET ============
// ============ LANCEMENT AU CHARGEMENT DE LA PAGE ============
```

**`formulaire.js`**
```
// ============ URL DE L'API DETECTÉE DYNAMIQUEMENT ============
// ============ AU CHARGEMENT DE LA PAGE ============        → window.onload
// ============ CHARGER LES DONNEES DU SNIPPET (EDITION) ============   → chargerDonneesSnippet()
// ============ SAUVEGARDER UN SNIPPET (POST ou PUT) ============        → sauvegarderSnippet()
```

**`server.js`**
```
// ============ IMPORTS ============
// ============ CRÉATION DU SERVEUR ============
// ============ CONFIGURATION ============
// ============ VALIDATION ENV ============
// ============ ROUTES ============
// ============ ROUTE DE TEST ============
// ============ DÉMARRAGE ============
```

**`routes/snippets.js`**
```
// ============ IMPORTS ============
// ============ CLASSES D'ERREUR ============
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

delete conteneurDetail.dataset.id
// Efface l'id mémorisé après suppression
```

---

## 5. JavaScript — syntaxe

### Déclarations de variables

`const` par défaut. `let` si réassignation. `var` interdit.
→ `var` a une portée de fonction, source de bugs silencieux.

```javascript
// ✅
const PORT = process.env.PORT || 3000
let tousLesSnippets = []

// ❌
var PORT = 3000
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

```javascript
// ✅
async function chargerSnippets() {
    const response = await fetch(`${API_URL}/snippets`)
    tousLesSnippets = await response.json()
    afficherSnippets(tousLesSnippets)
}

// ❌
fetch(`${API_URL}/snippets`).then(r => r.json()).then(s => afficherSnippets(s))
```

### Comparaisons

Toujours `===` et `!==`. Jamais `==` ou `!=`.

```javascript
// ✅
if (snippets.length === 0) { return }
if (!snippet) return

// ❌
if (snippets.length == 0) { return }
```

### Déstructuration

```javascript
// ✅
const { title, code, language, tags } = req.body
const { id } = req.params
const { data, error } = await supabase.from('snippets').select('*')

// ❌
const title = req.body.title
```

### Template literals

Obligatoires pour toute concaténation.

```javascript
// ✅
const url = `${API_URL}/snippets/${id}`

// ❌
const url = API_URL + '/snippets/' + id
```

### Retour anticipé (guard clause)

```javascript
// ✅
if (!id) {
    alert('Sélectionnez d\'abord un snippet !')
    return
}

// ❌
if (id) {
    // 30 lignes imbriquées
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
for (let i = 0; i < snippets.length; i++) { ... }
```

### Ordre des sections dans `app.js`

```
1.  URL de l'API (détection dynamique)
2.  Objets de configuration             →  badgeColors
3.  Fonctions utilitaires               →  getBadge()
4.  État global                         →  tousLesSnippets
5.  Fonctions de chargement             →  chargerSnippets()
6.  Fonctions d'affichage (liste)       →  afficherSnippets()
7.  Configuration des événements        →  addEventListener délégation
8.  Fonctions d'affichage (détail)      →  afficherDetail()
9.  Fonctions d'action                  →  modifierSnippet(), supprimerSnippet()
10. Lancement                           →  window.onload = chargerSnippets
```

### Ordre des sections dans `formulaire.js`

```
1. URL de l'API (détection dynamique)
2. Lancement                            →  window.onload = async () => { ... }
3. Fonction de chargement édition       →  chargerDonneesSnippet()
4. Fonction d'action                    →  sauvegarderSnippet()
```

---

## 6. JavaScript — syntaxe avancée

### Optional chaining `?.`

```javascript
// ✅ — accès à une propriété qui pourrait être null ou undefined
const language = snippet?.language
const tags = snippet?.tags ?? ''

// ✅ — optional chaining sur un objet externe
const hostname = window?.location?.hostname

// ❌ — accès direct à badgeColors[] (même avec ?.) — passer par getBadge()
const classes = badgeColors?.[language]
// → utiliser getBadge(language) à la place
```

### `??` vs `||`

`??` pour les valeurs par défaut sur les variables locales et objets.
`||` obligatoire pour les fallbacks sur `process.env` — une variable d'env vide `''` est falsy pour `||` mais pas pour `??`.

```javascript
// ✅ — ?? pour les valeurs locales (valeur null ou undefined → fallback)
const label = snippet.title ?? 'Sans titre'
const tags = snippet.tags ?? ''
const method = id ?? 'GET'

// ✅ — getBadge() pour les badges (encapsule ??)
const classes = getBadge(language)

// ✅ — || obligatoire pour process.env
const PORT = process.env.PORT || 3000

// ❌ — ?? avec process.env (bug si PORT='')
const PORT = process.env.PORT ?? 3000

// ❌ — || pour les valeurs locales (traite 0 et '' comme faux)
const label = snippet.title || 'Sans titre'
```

### Ternaire

Autorisé sur une seule ligne. Imbrication interdite.

```javascript
// ✅
const method = id ? 'PUT' : 'POST'

// ❌ — ternaire imbriqué
const label = isLoading ? 'Chargement...' : hasError ? 'Erreur' : 'OK'
```

### Paramètres par défaut

```javascript
// ✅
function getBadge(language = 'Autre') {
    return badgeColors[language] ?? badgeColors['Autre']
}

// ❌
function getBadge(language) {
    const lang = language || 'Autre'
}
```

### `forEach` vs `for...of`

`forEach` pour les effets de bord sur les tableaux. `for...of` pour les itérables non-tableaux. Boucles `for` classiques interdites.

```javascript
// ✅
REQUIRED_ENV.forEach(key => { ... })
for (const [key, value] of Object.entries(badgeColors)) { ... }

// ❌
for (let i = 0; i < snippets.length; i++) { ... }
```

### `reduce`

Autorisé uniquement si `map` + `filter` ne suffisent pas. Toujours avec une valeur initiale.

```javascript
// ✅
const parLanguage = snippets.reduce((acc, s) => {
    acc[s.language] = (acc[s.language] ?? 0) + 1
    return acc
}, {})

// ❌ — reduce quand map suffit
const titres = snippets.reduce((acc, s) => [...acc, s.title], [])
```

### Shorthand object

```javascript
// ✅
const payload = { title, code, language, tags }

// ❌
const payload = { title: title, code: code }
```

### Spread `...`

`Object.assign` interdit.

```javascript
// ✅
const updated = { ...snippet, title: 'Nouveau titre' }
const newSnippets = [...tousLesSnippets, nouveauSnippet]

// ❌
Object.assign({}, snippet, { title: 'Nouveau titre' })
```

### `await` séquentiel vs `Promise.all`

`await` séquentiel si dépendance entre requêtes. `Promise.all` si requêtes indépendantes.

```javascript
// ✅ — séquentiel (la 2e requête dépend du résultat de la 1re)
const { data: snippet } = await supabase.from('snippets').select('*').eq('id', id).single()
const { data: user } = await supabase.from('users').select('*').eq('id', snippet.user_id).single()

// ✅ — parallèle (requêtes indépendantes — S4)
const [{ data: snippets }, { data: users }] = await Promise.all([
    supabase.from('snippets').select('*'),
    supabase.from('users').select('*')
])
```

### Ordre des imports

```javascript
// 1. Modules natifs Node.js
const path = require('path')

// 2. Modules externes (npm)
const express = require('express')
const cors = require('cors')

// 3. Modules internes
const { supabase } = require('./supabase')
const snippetsRouter = require('./routes/snippets')
```

### `module.exports`

```javascript
// ✅
module.exports = router
module.exports = { supabase }

// ❌
exports.supabase = supabase
```

### Chaînage de méthodes

Maximum 3 méthodes chaînées. Au-delà, découper en variables intermédiaires.

```javascript
// ✅
const jsSnippets = snippets
    .filter(s => s.language === 'JavaScript')
    .map(s => s.title)
    .join(', ')

// ❌
snippets.filter(...).map(...).reduce(...).sort(...).join(...)
```

### Nombres magiques

Interdits. Extraire en constantes nommées.

```javascript
// ✅ — constante extraite (valeur depuis .env quand possible)
const PORT = process.env.PORT || 3000
const HTTP_NOT_FOUND = 404   // codes HTTP métier → constante nommée

// ❌ — nombre magique en dur
app.listen(3000)
res.status(404).json(...)
```

### Mutation des paramètres

Interdite. Toujours retourner une copie.

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

---

## 7. JavaScript — paradigmes

### Paradigme général

Procédural uniquement. Pas de classes sauf `ValidationError` et `NotFoundError` (voir section 12).

```javascript
// ✅ - badgeColors est un objet interne, getBadge() est la seule interface publique
const badgeColors = {
    'JavaScript': 'bg-yellow-500 text-black',
    'Autre': 'bg-gray-500 text-white'
}
function getBadge(language = 'Autre') {
    return badgeColors[language] ?? badgeColors['Autre']
}

// ✅ - appel correct
badge.className = getBadge(snippet.language)

// ❌ - acces direct interdit en dehors de getBadge()
const classes = badgeColors[language] ?? badgeColors['Autre']

// ❌ - classe interdite
class SnippetManager { constructor() { ... } }
```

### Système de modules

| Couche | Système | Exemple |
|--------|---------|---------|
| Backend | CommonJS | `require('express')` / `module.exports` |
| Frontend | Scripts classiques + globales | `<script src="app.js">` |

### Immutabilité

```javascript
// ✅
const newSnippets = [...tousLesSnippets, nouveauSnippet]

// ❌
tousLesSnippets.push(nouveauSnippet)
```

### État frontend

Variables globales pour l'état partagé. `localStorage` interdit pendant tout le stage.
→ En S4, Supabase Auth gère la session nativement — `localStorage` reste inutile.

```javascript
// API_URL détectée dynamiquement — pas de modification manuelle entre dev et prod
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://[url-vercel-a-definir-en-s5].vercel.app'
// L'URL Vercel sera définie en S5 après premier déploiement

let tousLesSnippets = []
```

### Lancement frontend

`window.onload` pour garantir que le DOM est chargé avant exécution.

Deux formes selon le fichier :

```javascript
// ✅ — app.js : fonction directe
// chargerSnippets() contient son propre try/catch — les erreurs sont gérées en interne
window.onload = chargerSnippets

// ✅ — formulaire.js : async obligatoire pour détecter le mode édition
window.onload = async () => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    if (id) {
        document.getElementById('form-titre-page').textContent = 'Modifier un grimoire'
        await chargerDonneesSnippet(id)
    }
}

// ✅ — chargerDonneesSnippet : pré-remplit le formulaire avec les données existantes
async function chargerDonneesSnippet(id) {
    try {
        const response = await fetch(`${API_URL}/snippets`)
        // S4 : remplacer par supabase.from('snippets').select().eq('id', id).eq('user_id', userId)
        const snippets = await response.json()
        const snippet = snippets.find(s => s.id === Number(id))
        if (!snippet) return
        document.getElementById('form-snippet').dataset.id = id
        document.getElementById('input-titre').value = snippet.title
        document.getElementById('select-language').value = snippet.language
        document.getElementById('textarea-code').value = snippet.code
        document.getElementById('input-tags').value = snippet.tags ?? ''
    } catch (erreur) {
        console.error('Erreur chargement snippet :', erreur)
    }
}

// ❌ — peut s'exécuter avant que le DOM soit prêt
chargerSnippets()
```

> En S4, `app.js` devra aussi vérifier la session avant de charger.
> Prérequis : importer le client Supabase JS via CDN dans `index.html` :
> ```html
> <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
> ```
> Puis dans `app.js` :
> ```javascript
> const { createClient } = supabase
> // SUPABASE_URL et SUPABASE_PUBLISHABLE_KEY : constantes globales JS hardcodées dans app.js
> // (clés publiques — pas dans .env, ne pas confondre avec SUPABASE_SECRET_KEY)
> const supabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
>
> window.onload = async () => {
>     const { data: { session } } = await supabaseClient.auth.getSession()
>     if (!session) { window.location.href = 'connexion.html'; return }
>     await chargerSnippets()
> }
> ```
> Note : `SUPABASE_URL` et `SUPABASE_PUBLISHABLE_KEY` seront des constantes globales dans `app.js` en S4.

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

### IDs de référence

IDs obligatoires dans `index.html` :

| ID | Élément | Usage |
|----|---------|-------|
| `liste-snippets` | Conteneur sidebar | Cible de `innerHTML` et de la délégation |
| `detail-snippet` | Conteneur détail | Stocke `dataset.id` de l'élément actif |
| `detail-titre` | `<h2>` du détail | Cible de `textContent` |
| `detail-code` | `<pre>` du détail | Cible de `textContent` |
| `detail-badge` | Badge langage détail | Cible de `className` |

IDs obligatoires dans `formulaire.html` :

| ID | Élément | Usage |
|----|---------|-------|
| `form-snippet` | `<form>` | Stocke `dataset.id` en mode édition |
| `form-titre-page` | `<h2>` du formulaire | Titre "Nouveau" ou "Modifier" |
| `input-titre` | `<input>` titre | Valeur du titre |
| `select-language` | `<select>` langage | Valeur du langage |
| `textarea-code` | `<textarea>` code | Valeur du code |
| `input-tags` | `<input>` tags | Valeur des tags |

### Ordre des attributs

```
id → class → type → name → placeholder → value → onclick → href
```

### Event handlers

`onclick` inline pour les boutons statiques (Modifier, Supprimer, Sauvegarder).
Délégation `addEventListener` obligatoire pour les éléments générés dynamiquement (liste des snippets).

```html
<!-- ✅ — bouton statique -->
<button onclick="modifierSnippet()" class="bg-gray-700 text-white px-3 py-1 rounded">
    Modifier
</button>
```

```javascript
// ✅ — éléments dynamiques : délégation obligatoire
document.getElementById('liste-snippets').addEventListener('click', (e) => {
    const item = e.target.closest('[data-id]')
    if (item) afficherDetail(Number(item.dataset.id))
})

// ❌ — onclick inline dans un template généré dynamiquement
liste.innerHTML = snippets.map(s => `<div onclick="afficherDetail(${s.id})">`).join('')
```

### Rendu DOM

`innerHTML` pour les listes dynamiques. `textContent` pour les valeurs unitaires.

```javascript
// ✅ — liste (innerHTML + data-id)
liste.innerHTML = snippets.map(s => `
    <div data-id="${s.id}" class="p-3 mb-2 bg-gray-800 rounded-lg cursor-pointer">
        <span>${s.title}</span>
    </div>
`).join('')

// ✅ — valeurs unitaires (textContent — pas de risque XSS)
document.getElementById('detail-titre').textContent = snippet.title
document.getElementById('detail-code').textContent = snippet.code
```

> `innerHTML` sur la liste comporte un risque XSS potentiel. Choix assumé dans le cadre de ce projet privé.

### Sélecteurs DOM

```javascript
// ✅ — id unique → getElementById obligatoire
document.getElementById('liste-snippets')
document.getElementById('detail-snippet')
document.getElementById('detail-titre')
document.getElementById('detail-code')
document.getElementById('detail-badge')

// ✅ — querySelector uniquement pour les sélecteurs sans getElementById équivalent
// (ex : élément enfant sans id propre)

// ❌ — querySelector pour un id simple
document.querySelector('#liste-snippets')
document.querySelector('#detail-titre')
```

### `dataset`

```javascript
// ✅
conteneurDetail.dataset.id = id
const id = conteneurDetail.dataset.id
delete conteneurDetail.dataset.id
```

### `classList` vs `className`

```javascript
// ✅ — ajouter/retirer
element.classList.add('hidden')
element.classList.remove('hidden')

// ✅ — remplacer toutes les classes (badges uniquement)
badge.className = `text-xs px-2 py-0.5 rounded-full ${getBadge(snippet.language)}`

// ❌ — concaténation
element.className = element.className + ' hidden'
```

### Navigation

```javascript
// ✅
window.location.href = `formulaire.html?id=${id}`

// ❌
history.pushState({}, '', '/formulaire')
```

### Balises sémantiques

| Balise | Usage |
|--------|-------|
| `<nav>` | Barre de navigation |
| `<main>` | Contenu principal |
| `<aside>` | Sidebar |
| `<section>` | Section de contenu groupé |

### Self-closing tags

```html
<!-- ✅ -->
<input id="input-titre" type="text">

<!-- ❌ -->
<input id="input-titre" type="text" />
```

### Attributs booléens

```html
<!-- ✅ -->
<button disabled>Sauvegarder</button>

<!-- ❌ -->
<button disabled="true">Sauvegarder</button>
```

### Accessibilité

```html
<!-- ✅ -->
<label for="input-titre" class="text-sm text-gray-400">Titre</label>
<input id="input-titre" type="text">
<button onclick="supprimerSnippet()" aria-label="Supprimer le snippet">🗑</button>
```

Règles : 4 espaces · balises fermées · `<script>` avant `</body>`.

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

Ces couleurs sont définies dans `badgeColors` dans `app.js`. Les deux doivent rester synchronisés.

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

Interdites.

```html
<!-- ✅ -->
<div class="bg-gray-950">

<!-- ❌ -->
<div class="bg-[#0a0a0f]">
```

### `@apply`

Interdit. Documenter les combinaisons répétées dans la palette (section 9).

```css
/* ❌ — @apply interdit */
.btn-primary {
    @apply bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700;
}

/* ✅ — documenter dans la palette section 9 et répéter les classes */
/* Palette: "Bouton principal" → bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 */
```

### Duplication de classes

Quand un groupe de classes se répète plus de 3 fois, le documenter dans la palette (section 9).

```html
<!-- ✅ — combinaison répétée documentée dans la palette -->
<!-- Palette: "Bouton neutre" → bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm -->
<button class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">Modifier</button>
<button class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">Copier</button>

<!-- ❌ — duplication silencieuse sans documentation -->
<button class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">Modifier</button>
<button class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">Copier</button>
<button class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">Partager</button>
<button class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">Exporter</button>
```

### Mobile-first et breakpoints

Application de bureau pure. Breakpoints (`sm:`, `md:`, `lg:`) et variante `dark:` interdits jusqu'en S5.

```html
<!-- ✅ — taille fixe, pas de responsive -->
<aside class="w-80 bg-gray-900">
<main class="flex-1 bg-gray-950 p-6">

<!-- ❌ — breakpoints interdits jusqu'en S5 -->
<aside class="w-full md:w-80 bg-gray-900">
<div class="bg-white dark:bg-gray-950">
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

// ============ VALIDATION ENV ============
const REQUIRED_ENV = [
    'SUPABASE_URL',
    'SUPABASE_SECRET_KEY'
    // 'SUPABASE_PUBLISHABLE_KEY' // décommenter en S4
]
REQUIRED_ENV.forEach(key => {
    if (!process.env[key]) {
        console.error(`Variable d'environnement manquante : ${key}`)
        process.exit(1)
        // process.exit(1) : arrête le serveur si une clé est absente
    }
})

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

### Architecture des couches

Tout le code métier dans `routes/`. Pas de controllers/services.

```javascript
// ✅ — validation + logique + appel Supabase dans la route
router.post('/', async (req, res) => {
    try {
        const { title, code, language } = req.body
        if (!title) throw new ValidationError('Titre obligatoire')
        const { data, error } = await supabase.from('snippets').insert([...]).select()
        if (error) throw error
        res.status(201).json(data)
    } catch (error) {
        res.status(error.statusCode || 500).json({
            type: error.name && error.name !== 'Error' ? error.name : 'ServerError',
            message: error.message
        })
    }
})

// ❌ — séparation en couches (trop complexe pour ce projet)
router.post('/', snippetsController.create)
```

### Middleware d'erreur

`try/catch` dans chaque route. Pas de middleware Express centralisé.

```javascript
// ✅ — try/catch dans chaque route (choix assumé)
router.get('/', async (req, res) => {
    try { ... }
    catch (error) { res.status(error.statusCode || 500).json({ ... }) }
})

// ❌ — middleware centralisé (trop avancé pour ce projet)
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ type: err.name, message: err.message })
})
```

### Modèle de route

Les codes HTTP dans le catch sont issus de `error.statusCode` (défini dans les classes d'erreur).
Le fallback `500` est autorisé ici car c'est une valeur technique standard, pas un nombre métier.

> `select('*')` utilisé en développement. Passer aux colonnes explicites en S5 (voir section 11).

```javascript
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('snippets').select('*')
        if (error) throw error
        res.json(data)
    } catch (error) {
        res.status(error.statusCode || 500).json({
            type: error.name && error.name !== 'Error' ? error.name : 'ServerError',
            // error.name vaut 'Error' pour les erreurs standard JS — on normalise en 'ServerError'
            // Pour ValidationError et NotFoundError, error.name est explicitement défini
            message: error.message
        })
    }
})
```

### Format des réponses

| Cas | Format |
|-----|--------|
| Succès | Data brute — `res.json(data)` |
| Erreur | `{ type, message }` |

### Codes HTTP

Les codes HTTP sont définis via `error.statusCode` dans les classes d'erreur — pas en dur dans le code.
Exception : `200` et `201` sont retournés implicitement par Express ou via `res.status(201)`.
Le `500` dans le catch est un fallback technique autorisé (voir section 6 — nombres magiques).

| Code | Constante source | Usage |
|------|-----------------|-------|
| `200` | Implicite Express | GET / PUT / DELETE réussi |
| `201` | `res.status(201)` | POST réussi |
| `400` | `ValidationError.statusCode` | Données invalides |
| `404` | `NotFoundError.statusCode` | Ressource introuvable |
| `500` | Fallback autorisé | Erreur serveur |

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
| `title` | TEXT | NOT NULL | Titre du snippet |
| `code` | TEXT | NOT NULL | Code source |
| `language` | TEXT | NOT NULL | Langage |
| `tags` | TEXT | | Tags séparés par virgule |
| `user_id` | UUID | FK → users.id | Ajouté en S4 — attention à ne pas exposer avant |

### Table `users` (S4)

| Colonne | Type | Contrainte |
|---------|------|------------|
| `id` | UUID | PRIMARY KEY |
| `email` | TEXT | UNIQUE NOT NULL |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |

### Requêtes utilisées

```javascript
// Développement — select('*') accepté
await supabase.from('snippets').select('*')

// Production (S5) — colonnes explicites obligatoires
// Raison : user_id ajouté en S4 ne doit pas être exposé avant auth
await supabase.from('snippets').select('id, title, language, code, tags, created_at')

await supabase.from('snippets').insert([{ title, code, language, tags }]).select()
await supabase.from('snippets').update({ title, code, language, tags }).eq('id', id).select()
await supabase.from('snippets').delete().eq('id', id).select()
```

### Migrations

```
docs/
└── migrations/
    ├── 001_create_snippets.sql
    ├── 002_add_user_id.sql      ← S4
    └── 003_add_rls.sql          ← S4
```

### Pagination

`.range()` quand la liste dépasse 50 éléments.

```javascript
await supabase.from('snippets').select('*').range(0, 19)
```

---

## 12. Gestion des erreurs

- Toutes les fonctions `async` utilisent `try/catch`.
- Erreurs loggées avec `console.error()`, jamais `console.log()`.
- Champs obligatoires vérifiés avant l'appel API.
- Retour visuel via `alert()` — choix assumé, pas de composant toast.

### Classes d'erreur personnalisées

Exception au paradigme procédural — deux classes autorisées uniquement dans `routes/snippets.js`.

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

Usage :

```javascript
if (!title || !code || !language) throw new ValidationError('Titre, code et langage obligatoires')
if (!data || !data.length) throw new NotFoundError(`Snippet ${id} introuvable`)
// data peut être null si Supabase ne retourne rien — vérification défensive obligatoire
```

### Tableau des erreurs

| Classe | Code | Quand |
|--------|------|-------|
| `ValidationError` | 400 | Champ manquant ou invalide |
| `NotFoundError` | 404 | Ressource introuvable |
| `Error` générique | 500 | Erreur serveur inattendue |

---

## 13. Sécurité et environnements

### Variables d'environnement

Fichier `backend/.env` — jamais commité.

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SECRET_KEY=sb_secret_xxxxx
SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxx   # Ajouté en S4 pour le CDN frontend
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
| CORS | Configuré via `cors()` — toutes origines acceptées en dev, à restreindre en S5 |

> En S5, restreindre CORS à l'URL Vercel :
> ```javascript
> app.use(cors({ origin: 'https://[url-vercel-a-definir-en-s5].vercel.app' }))
> ```

### API_URL dynamique

Détection automatique via `window.location.hostname`. Pas de modification manuelle entre dev et prod.

```javascript
// ✅ — dans app.js ET formulaire.js
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://[url-vercel-a-definir-en-s5].vercel.app'
// L'URL Vercel sera connue après le premier déploiement en S5
```

| Env | `window.location.hostname` | `API_URL` |
|-----|---------------------------|-----------|
| Développement | `localhost` ou `127.0.0.1` | `http://localhost:3000` |
| Production (S5) | domaine Vercel | URL à remplacer après déploiement |

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

### Commits atomiques

Un commit = un changement logique.

```
// ✅
feat : Bouton Supprimer fonctionnel
fix : Correction bug modifier sans sélection

// ❌
feat : Supprimer + modifier + badges + fix bug
```

Règles : ne jamais travailler sur `main` · merger uniquement après tests.

### Historique du projet

```
feat : Connexion Supabase + routes CRUD fonctionnelles
feat : Affichage des snippets dans la sidebar et détail au clic
feat : Formulaire POST fonctionnel
feat : Bouton Supprimer fonctionnel
feat : Bouton Modifier fonctionnel — CRUD complet
design : Badges de langage colorés
fix : Correction bug modifier sans sélection
docs : CONVENTIONS — voir changelog section 19 pour l'historique complet
```

---

## 15. Structure du projet

```
CodeGrimoire/
├── backend/
│   ├── routes/
│   │   └── snippets.js         Routes CRUD + classes d'erreur
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
│   ├── CONVENTIONS.md          Ce document
│   └── migrations/
│       └── 001_create_snippets.sql
├── .editorconfig
├── .eslintrc.json
├── .gitignore
├── package.json
└── README.md
```

### Constantes partagées

| Constante | Définie dans | Synchroniser avec |
|-----------|-------------|-------------------|
| `badgeColors` | `app.js` uniquement | Section 9 CONVENTIONS.md |
| `API_URL` | `app.js` ET `formulaire.js` (duplication assumée — pas de module partagé en frontend vanilla) | Section 13 CONVENTIONS.md |

---

## 16. Tests

Pas de tests automatisés pendant le stage. Le type `test` est réservé aux tests manuels documentés. En production, le framework recommandé serait **Vitest**.

```
test : Vérification CRUD complet sur navigateur
test : Tests des cas limites formulaire vide
```

---

## 17. Interfaces et JSDoc

### Règle

`interface` par défaut pour tout objet structuré. `type` uniquement pour les unions.

```typescript
// ✅ — interface pour les objets
interface Snippet { id: number; title: string }

// ✅ — type pour les unions
type Langage = 'JavaScript' | 'Python' | 'HTML'

// ❌ — type pour un objet structuré
type Snippet = { id: number; title: string }
```

### JSDoc sur les fonctions utilitaires

```javascript
/**
 * Retourne les classes Tailwind du badge selon le langage.
 * @param {string} [language='Autre'] - Langage de programmation
 * @returns {string} Classes Tailwind du badge
 */
function getBadge(language = 'Autre') {
    return badgeColors[language] ?? badgeColors['Autre']
}
```

### JSDoc — interfaces

```javascript
/**
 * @interface Snippet
 * @property {number} id
 * @property {string} title
 * @property {string} code
 * @property {string} language
 * @property {string} tags - Tags séparés par virgule
 * @property {string} created_at
 * @property {string} [user_id] - Optionnel avant S4
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

## 18. Outillage

### ESLint

```bash
npm install --save-dev eslint
```

Scripts dans `package.json` :

```json
"scripts": {
    "lint": "eslint \"backend/**/*.js\" \"frontend/**/*.js\"",
    "lint:fix": "eslint \"backend/**/*.js\" \"frontend/**/*.js\" --fix"
}
```

Lancer **avant chaque commit** : `npm run lint`
Si le lint échoue, le commit ne doit pas être fait.

Fichier `.eslintrc.json` :

```json
{
  "env": { "browser": true, "node": true, "es2024": true },
  "extends": "eslint:recommended",
  "parserOptions": { "ecmaVersion": 2024 },
  "rules": {
    "no-var": "error",
    "prefer-const": "error",
    "eqeqeq": ["error", "always"],
    "no-console": ["warn", { "allow": ["error"] }],
    "no-unused-vars": "warn",
    "semi": ["error", "never"],
    "quotes": ["error", "single", { "allowTemplateLiterals": true }],
    "indent": ["error", 4]
  }
}
```

| Règle | Niveau | Pourquoi |
|-------|--------|----------|
| `no-var` | error | Portée de fonction = bugs silencieux |
| `prefer-const` | error | Signale l'intention clairement |
| `eqeqeq` | error | Évite les conversions implicites |
| `no-console` | warn | Debug oublié en production |
| `no-unused-vars` | warn | Code mort détecté automatiquement |
| `semi` | error | Points-virgules interdits |
| `quotes` | error | Apostrophes obligatoires |
| `indent` | error | 4 espaces — cohérent avec `.editorconfig` |

### Prettier

Prettier n'est pas installé. ESLint seul gère le formatage.
Compensation : extension Prettier de VS Code recommandée.

Fichier `.vscode/settings.json` :

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "prettier.singleQuote": true,
    "prettier.semi": false,
    "prettier.tabWidth": 4
}
```

### .editorconfig

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

Installer l'extension **EditorConfig for VS Code** (`editorconfig.editorconfig`).

---

## 19. Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 27/05/2026 | Création |
| 1.1 | 28/05/2026 | Comparaisons, Déstructuration, ESLint, Environnements, Async/Await |
| 1.2 | 29/05/2026 | Statut, branches Git, lint avant commit |
| 1.3 | 29/05/2026 | Décisions d'architecture, Pourquoi, Types/Interfaces, Classes d'erreurs |
| 1.4 | 29/05/2026 | Version allégée, interface par défaut |
| 1.5 | 29/05/2026 | Paradigmes explicites, function vs arrow, modules, DOM, event handlers |
| 1.6 | 29/05/2026 | Syntaxe avancée complète |
| 1.7 | 29/05/2026 | Shorthand, spread, Promise.all, ordre imports, module.exports |
| 1.8 | 29/05/2026 | Chaînage, nombres magiques, localStorage, balises sémantiques, Tailwind |
| 1.9 | 29/05/2026 | dataset, navigation, délégation, migrations, pagination, .editorconfig |
| 2.0 | 29/05/2026 | classList, self-closing, aria, booléens, mutation, mobile-first, JSDoc |
| 2.1 à 2.5 | 29/05/2026 | Itérations de corrections et compléments |
| 2.6 | 29/05/2026 | Correction de toutes les contradictions : IDs HTML manquants, getBadge() réintégrée, exception classes d'erreur documentée, onclick vs délégation clarifié, window.onload acté, API_URL dynamique, table des matières corrigée, [à trancher] supprimé |
| 2.7 | 29/05/2026 | badge-langage vs detail-badge unifié, nombres magiques 500 justifié, duplication API_URL assumée, ecmaVersion aligné sur 2024, data null safety, window.onload S4 anticipé |
| 2.8 | 29/05/2026 | Exemple API_URL const corrigé, getElementById obligatoire pour IDs simples, Promise.all avec fonctions réelles, localStorage interdit tout le stage, URL Vercel placeholder, window.onload formulaire.js documenté |
| 2.9 | 29/05/2026 | getBadge() seule interface publique de badgeColors, accès direct interdit, window.onload ordre mis à jour, sauvegarderSnippet() ajouté |
| 3.0 | 29/05/2026 | getBadge() dans ordre sections, rappel select('*') S5 dans modèle route, règle indent ESLint, justification API_URL corrigée, error.name normalisé |
| 3.1 | 29/05/2026 | error.name formulation unique, window.onload try/catch documenté, ordre sections séparé app.js/formulaire.js, codes HTTP via statusCode pas en dur |
| 3.2 | 29/05/2026 | Sections obligatoires formulaire.js annotées avec noms fonctions, ordre app.js 10 items aligné avec 10 sections obligatoires, afficherSnippets et afficherDetail séparés |
| 3.3 | 29/05/2026 | Exemple ?? avec vrais cas, optional chaining badgeColors[] interdit, window.onload S4 avec import CDN Supabase documenté |
| 3.4 | 29/05/2026 | Historique Git v3.3, SUPABASE_PUBLISHABLE_KEY dans .env, CORS restriction S5, exemples architecture/middleware/duplication Tailwind, IDs formulaire dans exemples |
| 3.5 | 29/05/2026 | Analyse senior : PORT depuis .env, REQUIRED_ENV note S4, @apply exemple, mobile-first exemples, chargerDonneesSnippet complet avec tous IDs |
| 3.6 | 29/05/2026 | Analyse senior : Historique Git mis à jour vers v3.5, chargerDonneesSnippet : note S4 ajoutée sur le filtre user_id |
| 3.7 | 29/05/2026 | Analyse senior : Historique Git mis à jour vers v3.6; REQUIRED_ENV : note S4 ajoutée |
| 3.8 | 29/05/2026 | Analyse senior : Historique Git mis à jour vers v3.7; REQUIRED_ENV : note S4 pour SUPABASE_PUBLISHABLE_KEY ajoutée |
| 3.9 | 29/05/2026 | Historique Git mis à jour v3.8; REQUIRED_ENV : note S4 SUPABASE_PUBLISHABLE_KEY |
| 3.10 | 29/05/2026 | Historique Git → v3.9; REQUIRED_ENV : note S4 SUPABASE_PUBLISHABLE_KEY; Section 2 : 'acc' et 'e' ajoutés aux abréviations autorisées; Section 7 S4 : clarification SUPABASE_URL/PUBLISHABLE_KEY côté frontend |
| 3.11 | 29/05/2026 | Historique Git : entrée stable sans numéro de version (résolution permanente); REQUIRED_ENV : SUPABASE_PUBLISHABLE_KEY ajoutée commentée (S4) |
| 3.12 | 29/05/2026 | Nettoyage section 10 : commentaires S4 dupliqués dans REQUIRED_ENV supprimés |
| 3.13 | 29/05/2026 | Revue finale pro : Section 7 : clé 'Autre' ajoutée dans exemple badgeColors; Section 10 Architecture : try/catch ajouté dans l'exemple ✅ |

---

*Louka Kuhl — Agence418 — 2026*
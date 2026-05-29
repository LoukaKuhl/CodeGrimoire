# CONVENTIONS — CodeGrimoire

**Version :** 1.4
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
| Frontend | HTML + Tailwind + JS vanilla | Durée du stage (5 semaines) — React aurait réduit le temps disponible |
| Backend | Node.js + Express | Même langage front et back, courbe d'apprentissage réduite |
| Base de données | Supabase (PostgreSQL) | Hébergement gratuit, API REST intégrée, dashboard visuel |
| Déploiement | Vercel | Intégration GitHub native, gratuit, zero-config Node.js |
| CSS | Tailwind | Pas de fichier CSS à maintenir, classes utilitaires dans le HTML |

---

## Table des matières

1. [Principes](#1-principes)
2. [Nommage](#2-nommage)
3. [Formatage](#3-formatage)
4. [Commentaires](#4-commentaires)
5. [JavaScript](#5-javascript)
6. [HTML](#6-html)
7. [Tailwind CSS](#7-tailwind-css)
8. [Backend Node.js](#8-backend-nodejs)
9. [Base de données](#9-base-de-données)
10. [Gestion des erreurs](#10-gestion-des-erreurs)
11. [Sécurité](#11-sécurité)
12. [Git](#12-git)
13. [Structure du projet](#13-structure-du-projet)
14. [Interfaces](#14-interfaces)
15. [ESLint](#15-eslint)
16. [Changelog](#16-changelog)

---

## 1. Principes

1. **Lisibilité** — le code est écrit pour être lu par un humain.
2. **Responsabilité unique** — une fonction fait une seule chose.
3. **Cohérence** — les mêmes règles s'appliquent partout, sans exception.
4. **Français** — commentaires, messages et commits en français.

Pas de code commenté laissé dans les fichiers. Pas de `console.log` de débogage oublié.

---

## 2. Nommage

### Variables et fonctions JavaScript

| Contexte | Convention | Exemple | Pourquoi |
|----------|-----------|---------|----------|
| Variable | camelCase | `tousLesSnippets`, `snippetId` | Cohérence avec les API JS natives |
| Fonction | camelCase | `chargerSnippets()`, `afficherDetail()` | Standard JS universel |
| Fonction async | camelCase | `async function supprimerSnippet()` | Idem |
| Constante globale | SCREAMING_SNAKE_CASE | `API_URL` | Signale qu'elle ne change jamais |
| Booléen | `is` / `has` + camelCase | `isLoading`, `hasError` | Rend le `if` lisible comme une phrase |
| Tableau | pluriel | `snippets`, `tousLesSnippets` | Indique que c'est une liste |

```javascript
// ✅
const API_URL = 'http://localhost:3000'
let tousLesSnippets = []
async function chargerSnippets() {}

// ❌
const apiurl = 'http://localhost:3000'
let tous_les_snippets = []
async function ChargerSnippets() {}
```

### Attributs HTML

| Attribut | Convention | Exemples |
|----------|-----------|---------|
| `id` | kebab-case | `liste-snippets`, `detail-snippet`, `badge-langage`, `input-titre` |
| `class` | classes Tailwind | voir section 7 |

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
| Guillemets JS | Apostrophes ou backticks | Ne pas mélanger les styles |
| Guillemets HTML/JSON | Doubles `"..."` | Standard HTML5 et JSON |

```javascript
// ✅
const response = await fetch(`${API_URL}/snippets`)

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

Chaque ligne non triviale est commentée sur la ligne suivante, en français.

```javascript
const response = await fetch(`${API_URL}/snippets`)
// fetch : envoie une requête GET à notre API

const snippet = tousLesSnippets.find(s => s.id === id)
// .find() : cherche le snippet dont l'id correspond

delete document.getElementById('detail-snippet').dataset.id
// Efface l'id mémorisé après suppression
```

---

## 5. JavaScript

### Déclarations

`const` par défaut. `let` si réassignation. `var` interdit.
→ `var` a une portée de fonction, source de bugs difficiles à tracer.

```javascript
// ✅
const API_URL = 'http://localhost:3000'
let tousLesSnippets = []

// ❌
var API_URL = 'http://localhost:3000'
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

### Ordre des sections dans un fichier

```
1. Variables globales et constantes     →  API_URL, tousLesSnippets
2. Objets de configuration              →  badgeColors
3. Fonctions utilitaires                →  getBadge()
4. Fonctions de chargement              →  chargerSnippets()
5. Fonctions d'affichage                →  afficherSnippets(), afficherDetail()
6. Fonctions d'action                   →  modifierSnippet(), supprimerSnippet()
7. Lancement                            →  chargerSnippets()
```

---

## 6. HTML

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

```html
<!-- ✅ -->
<input id="input-titre" class="w-full bg-gray-800" type="text" placeholder="Titre...">

<!-- ❌ -->
<input placeholder="..." id="input-titre" type="text">
```

Règles : 4 espaces · balises fermées · `<script>` avant `</body>`.

---

## 7. Tailwind CSS

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

---

## 8. Backend Node.js

### Structure de `server.js`

```javascript
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const snippetsRouter = require('./routes/snippets')
app.use('/snippets', snippetsRouter)

app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur le serveur CodeGrimoire !' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`))
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

## 9. Base de données

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

---

## 10. Gestion des erreurs

- Toutes les fonctions `async` utilisent `try/catch`.
- Erreurs loggées avec `console.error()`, jamais `console.log()`.
- Champs obligatoires vérifiés avant l'appel API.
- L'utilisateur reçoit toujours un retour visuel.

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

## 11. Sécurité

Fichier `backend/.env` — jamais commité.

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SECRET_KEY=sb_secret_xxxxx
```

Fichier `.gitignore` :

```
node_modules/
.env
.DS_Store
```

| Règle | Statut |
|-------|--------|
| Clés API dans `.env` uniquement | Obligatoire |
| `.gitignore` vérifié avant chaque push | Obligatoire |
| RLS Supabase | Désactivé (S2), activé en S4 |
| CORS | Configuré via `cors()` dans `server.js` |

Environnements :

| Env | URL | Où |
|-----|-----|----|
| Développement | `http://localhost:3000` | `app.js`, `formulaire.js` |
| Production (S5) | `https://codegrimoire.vercel.app` | Variable Vercel |

---

## 12. Git

### Format des commits

```
type : Description courte en français
```

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

### Historique du projet

```
feat : Connexion Supabase + routes CRUD fonctionnelles
feat : Affichage des snippets dans la sidebar et détail au clic
feat : Formulaire POST fonctionnel
feat : Bouton Supprimer fonctionnel
feat : Bouton Modifier fonctionnel — CRUD complet
design : Badges de langage colorés
fix : Correction bug modifier sans sélection
docs : CONVENTIONS v1.4 — version finale
```

---

## 13. Structure du projet

```
CodeGrimoire/
├── backend/
│   ├── routes/
│   │   └── snippets.js
│   ├── .env
│   ├── server.js
│   └── supabase.js
├── frontend/
│   ├── index.html
│   ├── formulaire.html
│   ├── connexion.html
│   ├── app.js
│   ├── formulaire.js
│   └── style.css
├── docs/
│   └── CONVENTIONS.md
├── .eslintrc.json
├── .gitignore
├── package.json
└── README.md
```

---

## 14. Interfaces

Le projet est en JavaScript vanilla. Les interfaces sont documentées en JSDoc et anticipent une migration TypeScript.

### Règle globale

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

// type pour les unions simples uniquement
type Langage = 'JavaScript' | 'Python' | 'HTML' | 'CSS' | 'SQL' | 'PHP'
```

---

## 15. ESLint

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

| Règle | Niveau | Pourquoi |
|-------|--------|----------|
| `no-var` | error | Portée de fonction = bugs silencieux |
| `prefer-const` | error | Signale l'intention clairement |
| `eqeqeq` | error | Évite les conversions implicites |
| `no-console` | warn | Debug oublié en production |
| `no-unused-vars` | warn | Code mort détecté automatiquement |

---

## 16. Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 27/05/2026 | Création |
| 1.1 | 28/05/2026 | Comparaisons, Déstructuration, ESLint, Environnements, Async/Await |
| 1.2 | 29/05/2026 | Statut, branches Git, lint avant commit |
| 1.3 | 29/05/2026 | Décisions d'architecture, Pourquoi, Types/Interfaces, Classes d'erreurs |
| 1.4 | 29/05/2026 | Version allégée — sections fusionnées, interface par défaut |

---

*Louka Kuhl — Agence418 — 2026*
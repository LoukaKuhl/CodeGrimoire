CONVENTIONS — CodeGrimoire
Version : 1.2

Date : 29 mai 2026

Statut : Actif

Auteur : Louka Kuhl — Agence418

Projet : CodeGrimoire — Bloc-notes de code privé

Stack : HTML · Tailwind CSS · JavaScript · Node.js · Express · Supabase
Toute contribution doit respecter ces règles sans exception.

Comment utiliser ce document
Ce document est la référence unique pour le développement de CodeGrimoire. Il s'applique à tous les fichiers du projet. En cas de doute sur une pratique, consulter ce document avant d'écrire du code. Lancer npm run lint avant chaque commit.

Table des matières
1.	Principes
2.	Nommage
3.	Formatage
4.	Commentaires
5.	JavaScript
6.	HTML
7.	Tailwind CSS
8.	Backend Node.js
9.	Base de données
10.	Gestion des erreurs
11.	Sécurité
12.	Environnements
13.	Git
14.	Structure du projet
15.	Comparaisons
16.	Déstructuration
17.	ESLint
18.	Changelog

1. Principes
Quatre règles fondamentales, non négociables.
1.	Lisibilité — le code est écrit pour être lu par un humain.
2.	Responsabilité unique — une fonction fait une seule chose.
3.	Cohérence — les mêmes règles s'appliquent partout, sans exception.
4.	Français — commentaires, messages et commits en français.
Pas de code commenté laissé dans les fichiers. Pas de console.log de débogage oublié.

2. Nommage
Variables et fonctions JavaScript
Contexte	Convention	Exemple
Variable	camelCase	tousLesSnippets, snippetId
Fonction	camelCase	chargerSnippets(), afficherDetail()
Fonction async	camelCase	async function supprimerSnippet()
Constante globale	SCREAMING_SNAKE_CASE	API_URL
Booléen	is / has + camelCase	isLoading, hasError
Tableau	pluriel	snippets, tousLesSnippets
Objet config	camelCase	badgeColors, urlParams

// ✅
const API_URL = 'http://localhost:3000'
let tousLesSnippets = []
async function chargerSnippets() {}
function getBadge(language) {}

// ❌
const apiurl = 'http://localhost:3000'
let tous_les_snippets = []
async function ChargerSnippets() {}

Attributs HTML
Attribut	Convention	Exemples
id	kebab-case	liste-snippets, detail-snippet, badge-langage, input-titre
class	classes Tailwind	voir section 7

Fichiers
Contexte	Convention	Exemples
Tous les fichiers	kebab-case minuscules	index.html, app.js, formulaire.js
Documentation	MAJUSCULES	README.md, CONVENTIONS.md

Base de données
Contexte	Convention	Exemples
Tables	snake_case minuscules	snippets, users
Colonnes	snake_case minuscules	id, title, code, created_at, user_id

Chaque table contient id (clé primaire) et created_at (horodatage automatique).

3. Formatage
Règle	Valeur
Indentation	4 espaces — jamais de tabulations
Longueur de ligne	100 caractères maximum
Points-virgules	Omis — style cohérent sur tout le projet
Guillemets JS	Apostrophes '...' ou backticks `...`
Guillemets HTML/JSON	Doubles "..."

// ✅
const response = await fetch(`${API_URL}/snippets`)
const snippets = await response.json()

// ❌
const response = await fetch(`${API_URL}/snippets`);
const snippets = await response.json()


4. Commentaires
Délimiteurs de sections
// ============ NOM DE LA SECTION ============

<!-- ============ NOM DE LA SECTION ============ -->

Sections obligatoires par fichier
app.js
// ============ URL DE L'API ============
// ============ COULEURS DES BADGES PAR LANGAGE ============
// ============ CHARGER LES SNIPPETS ============
// ============ AFFICHER LES SNIPPETS DANS LA SIDEBAR ============
// ============ AFFICHER LE DETAIL D'UN SNIPPET ============
// ============ MODIFIER UN SNIPPET ============
// ============ SUPPRIMER UN SNIPPET ============
// ============ LANCEMENT AU CHARGEMENT DE LA PAGE ============

formulaire.js
// ============ URL DE L'API ============
// ============ AU CHARGEMENT DE LA PAGE ============
// ============ CHARGER LES DONNEES DU SNIPPET ============
// ============ SAUVEGARDER UN SNIPPET ============

server.js
// ============ IMPORTS ============
// ============ CRÉATION DU SERVEUR ============
// ============ CONFIGURATION ============
// ============ ROUTES ============
// ============ ROUTE DE TEST ============
// ============ DÉMARRAGE ============

routes/snippets.js
// ============ IMPORTS ============
// ============ GET - Récupérer tous les snippets ============
// ============ POST - Créer un snippet ============
// ============ PUT - Modifier un snippet ============
// ============ DELETE - Supprimer un snippet ============

Commentaires de code
Chaque ligne non triviale est commentée sur la ligne suivante, en français.
const response = await fetch(`${API_URL}/snippets`)
// fetch : envoie une requête GET à notre API

const snippets = await response.json()
// .json() : convertit la réponse en tableau JavaScript

const snippet = tousLesSnippets.find(s => s.id === id)
// .find() : cherche le snippet dont l'id correspond

document.getElementById('detail-snippet').dataset.id = id
// dataset.id : mémorise l'id du snippet affiché

window.location.href = `formulaire.html?id=${id}`
// Redirige vers le formulaire en passant l'id dans l'URL

delete document.getElementById('detail-snippet').dataset.id
// Efface l'id mémorisé après suppression

Ce qu'il ne faut pas commenter
// ❌ Évident
const app = express()

// ❌ Code mort — à supprimer avant de commiter
// const oldFunction = () => {}


5. JavaScript
Déclarations
const par défaut. let si réassignation nécessaire. var interdit.
// ✅
const API_URL = 'http://localhost:3000'
let tousLesSnippets = []

// ❌
var API_URL = 'http://localhost:3000'

Async/Await
async/await obligatoire. .then() interdit.
// ✅
async function chargerSnippets() {
    const response = await fetch(`${API_URL}/snippets`)
    const snippets = await response.json()
    afficherSnippets(snippets)
}

// ❌
function chargerSnippets() {
    fetch(`${API_URL}/snippets`)
        .then(response => response.json())
        .then(snippets => afficherSnippets(snippets))
}

Ordre des sections dans un fichier
1. Variables globales et constantes     →  API_URL, tousLesSnippets
2. Objets de configuration              →  badgeColors
3. Fonctions utilitaires                →  getBadge()
4. Fonctions de chargement              →  chargerSnippets()
5. Fonctions d'affichage                →  afficherSnippets(), afficherDetail()
6. Fonctions d'action                   →  modifierSnippet(), supprimerSnippet()
7. Lancement                            →  chargerSnippets()

Fetch API
// GET
const response = await fetch(`${API_URL}/snippets`)

// POST / PUT
const response = await fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, language, tags, code })
})

// DELETE
const response = await fetch(`${API_URL}/snippets/${id}`, {
    method: 'DELETE'
})


6. HTML
Structure obligatoire
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

Ordre des attributs
id → class → type → name → placeholder → value → onclick → href

<!-- ✅ -->
<input
    id="input-titre"
    class="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
    type="text"
    placeholder="Titre..."
>
<button
    onclick="sauvegarderSnippet()"
    class="bg-purple-600 text-white px-6 py-2 rounded-lg"
>
    Sauvegarder
</button>

<!-- ❌ -->
<input placeholder="..." id="input-titre" onclick="..." type="text">

Règles : indentation 4 espaces · toutes les balises fermées · <script> avant </body>.

7. Tailwind CSS
Tailwind en priorité. style="" interdit. style.css réservé aux cas non couverts par Tailwind.
Ordre des classes
layout → spacing → sizing → colors → typography → borders → interactivity

<!-- ✅ -->
<div class="flex items-center p-4 w-full bg-gray-800 text-white text-sm rounded-lg border border-gray-600 hover:bg-gray-700">

Palette du projet
Élément	Classe
Fond principal	bg-gray-950
Fond sidebar / nav	bg-gray-900
Fond cartes	bg-gray-800
Texte	text-white
Texte secondaire	text-gray-400
Accent	text-purple-400 / bg-purple-600
Survol accent	hover:bg-purple-700
Bouton danger	bg-red-700 / hover:bg-red-600
Bordures	border-gray-700 / border-gray-600
Focus	focus:border-purple-500 focus:outline-none

Badges de langage
Langage	Classes
JavaScript	bg-yellow-500 text-black
Python	bg-blue-500 text-white
HTML	bg-orange-500 text-white
CSS	bg-pink-500 text-white
SQL	bg-cyan-500 text-white
PHP	bg-indigo-500 text-white
Autre	bg-gray-500 text-white


8. Backend Node.js
Structure de server.js
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
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`)
})

Structure de supabase.js
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

Modèle de route
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('snippets').select('*')
        if (error) throw error
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

Codes HTTP
Code	Usage
200	GET / PUT / DELETE réussi
201	POST réussi
500	Erreur serveur

Endpoints de l'API
Méthode	Route	Action
GET	/snippets	Récupérer tous les snippets
POST	/snippets	Créer un snippet
PUT	/snippets/:id	Modifier un snippet
DELETE	/snippets/:id	Supprimer un snippet


9. Base de données
Table snippets
Colonne	Type	Contrainte	Description
id	BIGINT	PRIMARY KEY	Auto-incrémenté
created_at	TIMESTAMPTZ	DEFAULT NOW()	Horodatage automatique
title	TEXT	NOT NULL	Titre du snippet
code	TEXT	NOT NULL	Code source
language	TEXT	NOT NULL	Langage
tags	TEXT		Tags séparés par virgule
user_id	UUID	FK → users.id	Ajouté en S4

Table users (S4)
Colonne	Type	Contrainte	Description
id	UUID	PRIMARY KEY	Géré par Supabase Auth
email	TEXT	UNIQUE NOT NULL	Email
created_at	TIMESTAMPTZ	DEFAULT NOW()	Horodatage automatique

Requêtes Supabase utilisées
// Lire
await supabase.from('snippets').select('*')

// Créer
await supabase.from('snippets').insert([{ title, code, language, tags }]).select()

// Modifier
await supabase.from('snippets').update({ title, code, language, tags }).eq('id', id).select()

// Supprimer
await supabase.from('snippets').delete().eq('id', id)


10. Gestion des erreurs
Règles non négociables :
·	Toutes les fonctions async utilisent try/catch.
·	Les erreurs sont loggées avec console.error(), jamais console.log().
·	Les champs obligatoires sont vérifiés avant l'appel API.
·	L'utilisateur reçoit toujours un retour visuel.
// Modèle frontend
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


11. Sécurité
Variables d'environnement
Fichier backend/.env — jamais commité.
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SECRET_KEY=sb_secret_xxxxx

Fichier .gitignore
node_modules/
.env
.DS_Store

Règles
Règle	Statut
Clés API dans .env uniquement	Obligatoire
.gitignore vérifié avant chaque push	Obligatoire
RLS Supabase	Désactivé (S2), activé en S4
CORS	Configuré via cors() dans server.js


12. Environnements
Le projet tourne sur deux environnements. API_URL doit changer selon l'environnement.
Environnement	URL backend	Où modifier
Développement local	http://localhost:3000	app.js et formulaire.js
Production (Vercel S5)	https://codegrimoire.vercel.app	app.js et formulaire.js

// ✅ Développement
const API_URL = 'http://localhost:3000'

// ✅ Production — à changer en S5 avant déploiement
const API_URL = 'https://codegrimoire.vercel.app'

// ❌ Ne jamais laisser l'URL de production en développement

En S5, API_URL sera gérée via une variable d'environnement Vercel pour éviter de modifier le code manuellement.

13. Git
Format des commits
type : Description courte en français

Première lettre en majuscule. Pas de point final. Maximum 72 caractères.
Types
Type	Usage
feat	Nouvelle fonctionnalité
fix	Correction de bug
design	Modification visuelle
refactor	Amélioration du code
docs	Documentation
test	Tests
chore	Maintenance

Branches
Branche	Usage	Exemple
main	Production — toujours stable	
feature/nom	Nouvelle fonctionnalité	feature/recherche-snippets
fix/nom	Correction de bug	fix/bug-modifier-sans-selection

Règles :
·	Ne jamais travailler directement sur main.
·	Une branche = une fonctionnalité ou une correction.
·	Merger dans main uniquement après tests.
Historique du projet
feat : Connexion Supabase + routes CRUD fonctionnelles
feat : Affichage des snippets dans la sidebar et détail au clic
feat : Formulaire POST fonctionnel
feat : Bouton Supprimer fonctionnel
feat : Bouton Modifier fonctionnel — CRUD complet
design : Badges de langage colorés
design : Badge langage dans la sidebar et le detail
fix : Correction bug modifier sans sélection
docs : Guide de style complet v1.2


14. Structure du projet
CodeGrimoire/
├── backend/
│   ├── routes/
│   │   └── snippets.js       Routes CRUD
│   ├── .env                  Variables secrètes (non versionné)
│   ├── server.js             Point d'entrée Express
│   └── supabase.js           Connexion Supabase
├── frontend/
│   ├── index.html            Page principale
│   ├── formulaire.html       Ajout et modification
│   ├── connexion.html        Connexion (S4)
│   ├── app.js                JS principal
│   ├── formulaire.js         JS formulaire
│   └── style.css             Styles additionnels
├── docs/
│   └── CONVENTIONS.md        Ce document
├── .eslintrc.json            Configuration ESLint
├── .gitignore
├── package.json
└── README.md


15. Comparaisons
Toujours === et !==. Jamais == ou !=.
// ✅
if (snippets.length === 0) { return }
if (snippet.id === id) { ... }
if (!response.ok) { return }

// ❌
if (snippets.length == 0) { return }
if (snippet.id == id) { ... }

Raccourcis acceptés pour les booléens :
// ✅
if (!snippet) return
if (snippets.length) { ... }

// ❌ — redondant
if (snippet === null) return
if (snippets.length > 0) { ... }


16. Déstructuration
Utiliser la déstructuration pour extraire les propriétés d'objets.
// ✅ — tiré de routes/snippets.js
const { title, code, language, tags } = req.body
const { id } = req.params
const { data, error } = await supabase.from('snippets').select('*')

// ❌
const title = req.body.title
const code = req.body.code
const id = req.params.id


17. ESLint
Installation
npm install --save-dev eslint

Script dans package.json
"scripts": {
    "lint": "eslint . --ext .js",
    "lint:fix": "eslint . --ext .js --fix"
}

Lancer avant chaque commit :
npm run lint

Fichier .eslintrc.json
{
  "env": {
    "browser": true,
    "node": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2021
  },
  "rules": {
    "no-var": "error",
    "prefer-const": "error",
    "eqeqeq": ["error", "always"],
    "no-console": ["warn", { "allow": ["error"] }],
    "no-unused-vars": "warn"
  }
}

Règles activées
Règle	Niveau	Description
no-var	error	var interdit
prefer-const	error	const obligatoire si pas de réassignation
eqeqeq	error	=== obligatoire
no-console	warn	console.log déconseillé sauf console.error
no-unused-vars	warn	Variables non utilisées


18. Changelog
Version	Date	Modifications
1.0	27/05/2026	Création du document
1.1	28/05/2026	Ajout Comparaisons, Déstructuration, ESLint, Environnements, Async/Await
1.2	29/05/2026	Ajout Statut, branches Git, lint avant commit, note globale


Louka Kuhl — Agence418 — 2026

# CONVENTIONS : CodeGrimoire

**Version :** 4.0
**Projet :** CodeGrimoire, bloc-notes de code privé
**Auteur :** Louka Kuhl, Agence418
**Historique des versions :** tracé dans Git.

Règlement de développement de CodeGrimoire. À suivre sans exception. En cas de doute, consulter ce document avant d'écrire du code. Lancer `npm run lint` avant chaque commit.

---

## Décisions d'architecture

| Décision | Choix | Pourquoi |
|----------|-------|----------|
| Frontend | HTML + Tailwind + JS vanilla | Apprentissage des bases sans surcouche de framework |
| Backend | Node.js + Express | Même langage front et back |
| Base de données | Supabase (PostgreSQL) | API REST intégrée, dashboard visuel |
| Déploiement | Vercel | Intégration GitHub native, zéro config Node.js |
| CSS | Tailwind | Classes utilitaires dans le HTML, `style.css` réservé aux exceptions |
| Paradigme | Procédural | Fonctions et objets de configuration, pas de classes (exception : erreurs typées) |
| Modules backend | CommonJS | Pas de configuration de build sur ce projet |

---

## Paradigme

Procédural : des fonctions et des objets de configuration. Pas de classes, sauf pour les erreurs typées (`ValidationError`, `NotFoundError`) où étendre `Error` est imposé par le langage.

Immutabilité par défaut :

```javascript
// Correct
const suivants = [...snippets, nouveau]
const modifie = { ...snippet, title: 'Nouveau' }

// Interdit
snippets.push(nouveau)
snippet.title = 'Nouveau'
```

---

## Nommage

Nommage en français.

| Élément | Convention | Exemple |
|---------|------------|---------|
| Variables, fonctions | camelCase, verbe pour les fonctions | `tousLesSnippets`, `chargerSnippets` |
| Constantes globales | SCREAMING_SNAKE | `API_URL` |
| Types (référence future) | PascalCase | `Snippet` |
| Booléens | préfixe `est`, `a`, `peut` | `estConnecte` |
| Paramètres Express | `req`, `res` | |
| Paramètre de catch | `erreur` | |
| Callback d'événement | `e` | |

---

## Fonctions

`function` pour les fonctions nommées. Arrow function pour les callbacks uniquement.

```javascript
// Fonction nommée
function chargerSnippets() { ... }

// Callback
liste.addEventListener('click', (e) => { ... })
```

`async/await` obligatoire, `.then()` interdit. `===` obligatoire, jamais `==`. Pas de `var`. `?.` et `??` préférés.

---

## Documentation du code

Documenter les fonctions publiques avec JSDoc : ce qu'elles font, pas comment. Les paramètres non évidents, la valeur de retour si elle n'est pas explicite, les cas d'erreur.

Pas de commentaire ligne par ligne dans le code livré. Tu peux en écrire dans ton brouillon pour comprendre, mais retire-les avant de committer. Une fonction courte au nom explicite n'a pas besoin de documentation.

```javascript
/**
 * Retourne les classes Tailwind du badge selon le langage.
 * @param {string} [language='Autre'] Langage de programmation
 * @returns {string} Classes Tailwind
 */
function getBadge(language = 'Autre') {
    return badgeColors[language] ?? badgeColors['Autre']
}
```

---

## Organisation du code

### Frontend

Un fichier par page : `app.js` (liste et détail), `formulaire.js` (création et édition).

Ordre dans un fichier : configuration (URL de l'API), état global, fonctions utilitaires, fonctions de chargement, écouteurs d'événements, fonctions d'affichage, fonctions d'action, lancement.

Le lancement se place en dernier, sauf quand il doit détecter un mode au chargement (cas de `formulaire.js`, mode édition).

### Backend

Responsabilités séparées. La logique ne vit jamais dans la route.

- `server.js` : configuration Express, middlewares, montage des routes.
- `routes/` : HTTP uniquement (routing, validation des entrées, réponses). Pas d'accès direct à Supabase.
- `services/` : logique métier et accès aux données. Testable sans serveur HTTP.
- `supabase.js` : connexion à la base, utilisée par les services.

```javascript
// services/snippets.service.js : la logique, sans rien savoir du HTTP
async function creerSnippet(donnees) {
    const { data, error } = await supabase.from('snippets').insert([donnees]).select()
    if (error) throw error
    return data
}

// routes/snippets.js : juste recevoir et répondre
router.post('/', async (req, res) => {
    try {
        const snippet = await creerSnippet(req.body)
        res.status(201).json(snippet)
    } catch (erreur) {
        res.status(500).json({ error: erreur.message })
    }
})
```

---

## Modèle de données

Table `snippets` :

| Colonne | Type | Note |
|---------|------|------|
| `id` | bigint | Clé primaire auto-incrémentée |
| `title` | text | Obligatoire |
| `code` | text | Obligatoire |
| `language` | text | Obligatoire |
| `tags` | text | Optionnel, séparés par virgule |
| `created_at` | timestamptz | Défaut `now()` |

---

## Rendu DOM et sécurité

`textContent` par défaut : il neutralise le HTML, donc aucun risque XSS. `innerHTML` uniquement pour construire des listes, et dans ce cas le contenu venant de l'utilisateur doit être échappé avant insertion.

```javascript
function echapperHtml(texte) {
    const div = document.createElement('div')
    div.textContent = texte
    return div.innerHTML
}

liste.innerHTML = snippets.map(s => `
    <div data-id="${s.id}" class="p-3 mb-2 bg-gray-800 rounded-lg cursor-pointer">
        <span>${echapperHtml(s.title)}</span>
    </div>
`).join('')

document.getElementById('detail-titre').textContent = snippet.title
```

Le risque XSS est réel : l'application stocke du code, donc un titre contenant par exemple `<img onerror=...>` s'exécuterait s'il était inséré tel quel via `innerHTML`. La règle n'est pas "on assume parce que le projet est privé", c'est "on échappe le contenu utilisateur, ou on utilise textContent".

Délégation d'événements plutôt que `onclick` inline dans un template généré. Sélection par `id` via `getElementById`.

---

## Gestion des erreurs

Le service lève une erreur typée, jamais de code HTTP dedans. La route attrape l'erreur avec un `try/catch` et choisit le code HTTP de la réponse. Gérer l'erreur de façon explicite dans chaque route est le choix actuel, assumé pour l'apprentissage.

Codes HTTP utilisés : 200, 201, 400, 401, 403, 404, 500.

> Cible en semaine 4 : remplacer les `try/catch` répétés par un middleware d'erreur central (voir Évolutions prévues), une fois le réflexe du `try/catch` acquis.

---

## Outillage

Le formatage et les règles syntaxiques sont portés par **ESLint** et **EditorConfig**, qui font foi. Ne pas réécrire ces règles ici : voir `.eslintrc.json` et `.editorconfig`.

Réglages de référence : indentation 4 espaces (2 pour le JSON), 100 caractères par ligne, pas de point-virgule, apostrophes en JS, guillemets doubles en HTML et JSON, ESLint sans Prettier.

---

## Git

Format de commit : `type : Description`.

| Élément | Règle |
|---------|-------|
| Type | `feat`, `fix`, `docs`, `refactor`, `test`, `chore` |
| Description | Première lettre en majuscule, pas de point final, 72 caractères max, en français |

Branches : une branche par fonctionnalité ou correction (`feature/...`, `fix/...`, `docs/...`), partant de `main`. Fusion dans `main` après vérification, puis suppression de la branche.

```
feat : Bouton Copier le code dans le presse-papier
fix : Cohérence formulaire.js (API_URL dynamique et ===)
```

---

## Évolutions prévues

| Semaine | Évolution |
|---------|-----------|
| S4 | Authentification Supabase, RLS sur la table, CORS restreint, colonne `user_id` |
| S4 | Middleware d'erreur central dans le backend (remplace les try/catch par route) |
| S5 | Dark mode, PWA |
| S5 | Déploiement Vercel : coller la vraie URL dans `app.js` et `formulaire.js` |
| Qualité | Configurer ESLint, ajouter le script `lint`, corriger le champ `main` de `package.json` |
| Qualité | Mettre le code existant en conformité : extraire la couche `services/`, retirer les commentaires ligne par ligne |
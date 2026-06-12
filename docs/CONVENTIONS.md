# CONVENTIONS : CodeGrimoire

**Version :** 5.3
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
| Langage backend | TypeScript (mode strict) | Typage statique, erreurs détectées à la compilation |
| Base de données | Supabase (PostgreSQL) | API REST intégrée, dashboard visuel |
| Déploiement | Vercel | Intégration GitHub native, zéro config Node.js |
| CSS | Tailwind | Classes utilitaires dans le HTML, `style.css` réservé aux exceptions |
| Paradigme | Procédural | Fonctions et objets de configuration, pas de classes (exception : erreurs typées) |
| Modules backend | CommonJS | Sortie compilée par `tsc` (`backend/` → `dist/`), exécutée par Node sans `"type": "module"` |

---

## Paradigme

Procédural : des fonctions et des objets de configuration. Pas de classes, sauf pour les erreurs typées (`ValidationError`, `NotFoundError`, définies dans `backend/erreurs.ts`) où étendre `Error` est imposé par le langage.

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
| Types, interfaces | PascalCase | `Snippet`, `DonneesSnippet` |
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

Dans le backend TypeScript, les types sont portés par les signatures : la JSDoc ne les répète pas (`@param id Identifiant du snippet`, sans accolades de type).

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

- `server.ts` : configuration Express, middlewares, montage des routes.
- `middlewares/` : traitements transverses HTTP. `authentification.ts` exige un JWT valide (401 sinon) et attache à `req.clientSupabase` un client agissant au nom de l'utilisateur.
- `routes/` : HTTP uniquement (routing, validation des entrées, transmission des erreurs au middleware central via `next`). Pas d'accès direct à Supabase.
- `services/` : logique métier et accès aux données. Reçoivent le client Supabase de l'utilisateur en paramètre. Testable sans serveur HTTP.
- `supabase.ts` : fabrique un client Supabase par utilisateur à partir de son token (`creerClientPourUtilisateur`), utilisée par le middleware d'authentification.

Le backend est en TypeScript : syntaxe `import`/`export` dans les sources, compilée en CommonJS par `tsc` vers `dist/`. Les interfaces (`Snippet`, `DonneesSnippet`) vivent dans le service qui les expose.

```typescript
// services/snippets.service.ts : la logique, sans rien savoir du HTTP
async function creerSnippet(donnees: DonneesSnippet): Promise<Snippet[]> {
    const { data, error } = await supabase.from('snippets').insert([donnees]).select()
    if (error) throw error
    return data
}

// routes/snippets.ts : recevoir, valider, déléguer les erreurs
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        validerDonneesSnippet(req.body)
        const snippet = await creerSnippet(req.body)
        res.status(201).json(snippet)
    } catch (erreur) {
        next(erreur)
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
| `user_id` | uuid | Propriétaire, défaut `auth.uid()`, référence `auth.users(id)` |

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

Le service relance l'erreur telle quelle, jamais de code HTTP dedans : soit l'erreur Supabase d'origine, soit une erreur typée métier (`NotFoundError` quand aucun snippet ne correspond à l'identifiant). La route valide les entrées (et lève `ValidationError` si un champ obligatoire manque), puis attrape toute erreur dans son `try/catch` et la transmet au middleware d'erreur central via `next(erreur)`, sans choisir elle-même le code HTTP.

Le middleware d'erreur central, dernier middleware de `server.ts`, fait correspondre le type d'erreur au code HTTP :

| Erreur | Code HTTP |
|--------|-----------|
| `ValidationError` | 400 |
| `NotFoundError` | 404 |
| Erreur d'authentification Supabase (`PGRST301`) | 401 |
| Autre | 500 |

Les classes d'erreur typées vivent dans `backend/erreurs.ts` (seules classes autorisées, cf. Paradigme).

Codes HTTP utilisés : 200, 201, 400, 401, 404, 500. Pas de 403 : il n'existe pas de niveaux d'autorisation distincts ; l'isolation entre utilisateurs est assurée par la RLS (voir ci-dessous), pas par une vérification de rôle applicative.

---

## Authentification et isolation des données

L'API `/snippets` est protégée par le middleware `authentification` (`backend/middlewares/authentification.ts`), monté en tête du routeur. Il lit le JWT de l'en-tête `Authorization: Bearer <token>` ; si l'en-tête est absent ou mal formé, il répond **401** (`Authentification requise`) sans poursuivre. Sinon, il attache à `req.clientSupabase` un client Supabase qui agit **au nom de l'utilisateur** : son token est porté sur chaque requête, jamais la clé service-role.

L'isolation des données repose sur la **Row Level Security** de PostgreSQL (script `backend/db/rls-snippets.sql`) : la colonne `user_id` (défaut `auth.uid()`) et quatre policies (`select`, `insert`, `update`, `delete`, toutes sur `auth.uid() = user_id`) garantissent que la base ne renvoie et ne modifie que les lignes de l'utilisateur courant. Le backend ne filtre pas lui-même par utilisateur : il délègue à la base.

Quand le token est invalide ou expiré, PostgREST renvoie l'erreur `PGRST301`, que le middleware d'erreur central convertit en **401** (`Authentification invalide`).

---

## Outillage

Le formatage et les règles syntaxiques sont portés par **ESLint** (avec typescript-eslint pour le backend) et **EditorConfig**, qui font foi. Ne pas réécrire ces règles ici : voir `eslint.config.js` et `.editorconfig`. La configuration TypeScript vit dans `tsconfig.json` (mode strict).

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

S4 réalisée : authentification Supabase, RLS sur la table et colonne `user_id` sont en place (voir « Authentification et isolation des données »). La restriction CORS prévue en S4 reste à finaliser au déploiement : l'origine est pilotée par `CORS_ORIGIN`, ouverte par défaut tant que la variable n'est pas définie.

| Semaine | Évolution |
|---------|-----------|
| S5 | Dark mode, PWA |
| S5 | Déploiement Vercel : coller la vraie URL dans `app.js` et `formulaire.js` |
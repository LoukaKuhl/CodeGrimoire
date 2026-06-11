# Guide complet : CodeGrimoire

Document de référence pour utiliser, comprendre, modifier et dépanner l'application sans assistance.

## Sommaire

1. À quoi sert l'application
2. Comment l'application est construite (architecture)
3. La carte des fichiers du projet
4. Le modèle de données
5. Lancer l'application en local
6. Configuration à connaître
7. L'authentification, en détail
8. La sécurité des données (RLS)
9. Référence de l'API
10. Les codes de réponse
11. Comment faire... (recettes pratiques)
12. Mettre l'application en ligne (Vercel)
13. Résolution des problèmes courants
14. Commandes utiles
15. Bonnes pratiques et sécurité
16. Maintenance
17. Glossaire

---

## 1. À quoi sert l'application

CodeGrimoire est un bloc-notes de code privé. Chaque utilisateur peut :

- créer, modifier et supprimer ses propres extraits de code (snippets),
- les rechercher en temps réel,
- les copier en un clic,
- voir le langage de chaque snippet via un badge.

Chaque utilisateur ne voit et ne gère **que ses propres snippets**.

---

## 2. Comment l'application est construite (architecture)

Trois grandes briques :

1. **Le frontend** : les pages web (HTML, Tailwind CSS, JavaScript). C'est ce que l'utilisateur voit dans son navigateur.
2. **Le backend** : un serveur Node.js / Express en TypeScript. Il reçoit les demandes du frontend et parle à la base de données. C'est l'API.
3. **La base de données** : Supabase (PostgreSQL), hébergée dans le cloud. Elle stocke les snippets et gère les comptes (authentification).

Le trajet d'une requête, par exemple « afficher mes snippets » :

```
Navigateur (frontend)
   |  envoie la demande + le token de l'utilisateur connecté
   v
Backend Express (API)
   |  agit au nom de l'utilisateur grâce à son token
   v
Supabase (base de données)
   |  la RLS ne renvoie que les snippets de cet utilisateur
   v
Retour au navigateur, qui affiche la liste
```

### Les briques techniques en détail

- **Frontend** : HTML, Tailwind CSS (via CDN), JavaScript sans framework.
- **Backend** : Node.js, Express et TypeScript, exécuté avec ts-node en développement. Sécurité assurée par helmet, cors et express-rate-limit. Connexion à Supabase via la librairie @supabase/supabase-js (et la librairie ws pour le support WebSocket sous Node 20).
- **Base de données et authentification** : Supabase (PostgreSQL).
- **Qualité du code** : ESLint et configuration TypeScript stricte.

---

## 3. La carte des fichiers du projet

À quoi sert chaque fichier, pour savoir où intervenir.

### Backend (`backend/`)

| Fichier | Rôle |
|---|---|
| `server.ts` | point d'entrée du serveur : configure les middlewares (sécurité, CORS, limitation de débit), branche les routes, et gère les erreurs (codes 400 / 401 / 404 / 500) |
| `supabase.ts` | crée un client Supabase au nom de l'utilisateur à partir de son token |
| `erreurs.ts` | définit les erreurs typées `ValidationError` (400) et `NotFoundError` (404) |
| `routes/snippets.ts` | définit les routes de l'API (`/snippets`) et valide les données reçues |
| `services/snippets.service.ts` | contient la logique qui parle à la base (lister, créer, modifier, supprimer) |
| `middlewares/authentification.ts` | vérifie le token avant chaque requête, refuse en 401 si absent |
| `utils/messageErreur.ts` | met en forme un message d'erreur lisible |
| `db/rls-snippets.sql` | sauvegarde du SQL qui sécurise la table (RLS et policies) |

L'ordre des middlewares dans `server.ts` est important et suit cette séquence : sécurité des en-têtes (helmet), CORS, limitation de débit, lecture du JSON, routes, page introuvable (404), puis gestion centrale des erreurs.

### Frontend (`frontend/`)

| Fichier | Rôle |
|---|---|
| `index.html` | page principale : liste des snippets, recherche, copie |
| `app.js` | logique de la page principale (récupérer, afficher, copier, modifier, supprimer) |
| `formulaire.html` | formulaire de création / modification d'un snippet |
| `formulaire.js` | logique d'enregistrement du formulaire |
| `connexion.html` / `connexion.js` | page et logique de connexion |
| `inscription.html` / `inscription.js` | page et logique de création de compte |
| `supabase-client.js` | client Supabase côté navigateur, et fabrication des en-têtes avec le token |
| `session.js` | gestion de la session (rediriger si non connecté, déconnexion) |
| `style.css` | styles complémentaires |

### À la racine

| Fichier | Rôle |
|---|---|
| `package.json` | dépendances et scripts du projet |
| `tsconfig.json` | configuration TypeScript |
| `eslint.config.js` | règles de qualité du code |
| `.editorconfig` | règles de mise en forme de l'éditeur |
| `CONVENTIONS.md` | conventions de code et de travail du projet |
| `dist/` | code compilé (généré par `npm run build`, ne pas modifier à la main) |
| `node_modules/` | dépendances installées (généré par `npm install`, jamais versionné) |

---

## 4. Le modèle de données

La table principale est `snippets`. Ses colonnes :

| Colonne | Type | Description |
|---|---|---|
| `id` | entier | clé unique du snippet (générée automatiquement) |
| `title` | texte | titre du snippet (obligatoire) |
| `code` | texte | le code lui-même (obligatoire) |
| `language` | texte | le langage, affiché en badge (obligatoire) |
| `tags` | texte | étiquettes facultatives |
| `created_at` | date/heure | date de création (automatique) |
| `user_id` | uuid | identifiant du propriétaire du snippet, rempli automatiquement à la création |

Les comptes utilisateurs ne sont pas dans cette table : ils sont gérés par le système d'authentification de Supabase (section Authentication du dashboard).

---

## 5. Lancer l'application en local

### Prérequis

- Node.js installé (idéalement version 22 ou plus récente, voir la note sur les versions plus bas).
- Git installé.
- Un éditeur de code (VS Code).

### Récupérer le code

```
git clone https://github.com/LoukaKuhl/CodeGrimoire.git
cd CodeGrimoire
```

### Installer les dépendances

```
npm install
```

Cette commande recrée le dossier `node_modules`.

### Configurer le fichier `.env`

Créer un fichier `backend/.env` avec deux lignes :

```
SUPABASE_URL=https://VOTRE-PROJET.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_VOTRE_CLE
```

Où trouver ces valeurs : dashboard Supabase, **Project Settings**, page **API Keys** (clé publishable et URL du projet). Ces deux valeurs ne sont pas sensibles.

### Démarrer le backend

```
npm run dev
```

Le terminal doit afficher `Serveur démarré sur le port 3000`. Le backend tourne tant que ce terminal reste ouvert. Pour l'arrêter : `Ctrl+C`.

### Ouvrir le frontend

Clic droit sur une page HTML dans VS Code, « Open with Live Server », ou tout serveur de fichiers statiques.

### Adresses utilisées en local

- Backend (API) : `http://localhost:3000`
- Frontend (Live Server) : `http://127.0.0.1:5500`

---

## 6. Configuration à connaître

| Élément | Où | Rôle |
|---|---|---|
| `SUPABASE_URL` | `backend/.env` | adresse du projet Supabase |
| `SUPABASE_PUBLISHABLE_KEY` | `backend/.env` | clé d'accès (non sensible) |
| `CORS_ORIGIN` | `backend/.env` (optionnel) | autorise le frontend à appeler l'API depuis une adresse précise |
| `API_URL` | `frontend/app.js` et `frontend/formulaire.js` | adresse du backend que le frontend appelle |
| URL et clé Supabase du frontend | `frontend/supabase-client.js` | permettent au navigateur de gérer la connexion |

Points importants :

- `API_URL` vaut `http://localhost:3000` en local. **Au déploiement, mettre la vraie adresse du backend en ligne**, dans `app.js` **et** dans `formulaire.js`.
- `CORS_ORIGIN` : vide en local, l'adresse du site déployé en production.

---

## 7. L'authentification, en détail

### Créer un compte

L'utilisateur va sur la page d'inscription, saisit un email et un mot de passe. Le compte est créé dans Supabase.

### Se connecter

Sur la page de connexion, l'utilisateur saisit ses identifiants. Supabase vérifie, puis renvoie une **session** contenant un **token** (une preuve d'identité temporaire).

### Rester connecté

La session est conservée par le navigateur. À chaque appel à l'API, le frontend joint le token dans l'en-tête `Authorization`. C'est ce qui permet au backend de savoir qui fait la demande.

### Expiration

Le token a une durée de vie limitée. Quand il expire, l'API répond 401 et il faut se reconnecter.

### Se déconnecter

La déconnexion (gérée par `session.js`) efface la session : l'utilisateur est renvoyé vers la page de connexion.

### Réinitialiser un mot de passe

Un compte peut être géré depuis le dashboard Supabase, section **Authentication**, page **Users** (réinitialisation, suppression, création manuelle). Une page « mot de passe oublié » peut aussi être ajoutée à l'application si le besoin se présente.

---

## 8. La sécurité des données (RLS)

La table `snippets` a la **RLS (Row Level Security) activée**. La base elle-même refuse de renvoyer les lignes qui n'appartiennent pas à l'utilisateur qui demande. Trois éléments rendent cela possible :

1. la colonne `user_id`, remplie automatiquement avec l'identifiant de l'utilisateur à la création,
2. des règles (policies) qui autorisent chaque utilisateur à lire, modifier et supprimer uniquement ses propres snippets,
3. le backend qui agit au nom de l'utilisateur grâce à son token.

Le script qui met cela en place est sauvegardé dans `backend/db/rls-snippets.sql`.

### Les snippets « orphelins »

Les snippets créés **avant** la sécurisation ont un `user_id` vide (`NULL`). Ils n'appartiennent à personne et **n'apparaissent pour aucun utilisateur**. C'est normal. Une liste vide alors que d'anciens snippets existaient s'explique généralement par cela.

---

## 9. Référence de l'API

Toutes les routes `/snippets` exigent un utilisateur connecté (en-tête `Authorization: Bearer <token>`). Sans token valide, la réponse est 401.

| Méthode | Route | Effet | Corps attendu | Réponse en cas de succès |
|---|---|---|---|---|
| GET | `/snippets` | liste les snippets de l'utilisateur | aucun | 200 + liste |
| POST | `/snippets` | crée un snippet | `{ title, code, language, tags? }` | 201 + snippet créé |
| PUT | `/snippets/:id` | modifie un snippet | `{ title, code, language, tags? }` | 200 + snippet modifié |
| DELETE | `/snippets/:id` | supprime un snippet | aucun | 200 + message |
| GET | `/` | message d'accueil (test que le serveur répond) | aucun | 200 + message |

Champs obligatoires pour créer ou modifier : `title`, `code`, `language`. Si l'un manque ou est vide, la réponse est 400.

---

## 10. Les codes de réponse

| Code | Signification | Cause typique |
|---|---|---|
| 200 | succès | la demande a abouti |
| 201 | créé | un snippet a bien été créé |
| 400 | données invalides | un champ obligatoire manque ou est vide |
| 401 | non authentifié | token absent, invalide ou expiré (il faut se connecter) |
| 404 | introuvable | le snippet n'existe pas, ou n'appartient pas à l'utilisateur |
| 429 | trop de requêtes | plus de 100 requêtes en 15 minutes (limitation de débit) |
| 500 | erreur serveur | un problème inattendu côté backend (voir les logs) |

---

## 11. Comment faire... (recettes pratiques)

### Ajouter un champ à un snippet (exemple : une description)

1. Dans Supabase, **Table Editor**, ajouter une colonne (par exemple `description`) à la table `snippets`.
2. Dans `backend/services/snippets.service.ts`, ajouter le champ aux interfaces `Snippet` et `DonneesSnippet`, et dans les objets passés à `.insert()` et `.update()`.
3. S'il est obligatoire, l'ajouter à la liste des champs obligatoires dans `backend/routes/snippets.ts`.
4. Dans `frontend/formulaire.html`, ajouter le champ au formulaire ; dans `frontend/formulaire.js`, l'inclure dans les données envoyées.
5. Dans `frontend/index.html` et `app.js`, l'afficher si souhaité.

### Ajouter une nouvelle page

1. Créer le fichier `frontend/ma-page.html`.
2. Y inclure les scripts nécessaires (par exemple `session.js` si la page doit être réservée aux connectés).
3. Ajouter un lien vers cette page depuis les pages existantes.

### Changer le thème / l'apparence

Les styles viennent de Tailwind (classes dans les fichiers HTML) et de `frontend/style.css`. Pour ajuster les couleurs ou l'agencement, modifier les classes Tailwind dans le HTML, ou ajouter des règles dans `style.css`.

### Voir ou modifier les données directement

Dashboard Supabase, **Table Editor**, table `snippets` : on peut consulter, filtrer, ajouter ou supprimer des lignes à la main.

### Exécuter du SQL

Dashboard Supabase, **SQL Editor** : coller une requête et l'exécuter. C'est là qu'a été lancé le script de sécurisation.

### Vider tous les snippets

Dans le **SQL Editor** : `delete from snippets;` (action irréversible, à utiliser avec prudence). Ou supprimer les lignes une à une dans le Table Editor.

### Créer un compte de test

Soit via la page d'inscription de l'application, soit via le dashboard Supabase, **Authentication**, **Users**, bouton d'ajout d'utilisateur.

### Tester l'API à la main

Utiliser **Thunder Client** (extension VS Code) ou `curl`. Pour les routes `/snippets`, il faut joindre un token valide dans l'en-tête `Authorization: Bearer <token>`. Le token s'obtient en se connectant à l'application (la session le contient).

### Voir les logs du serveur

Les messages et erreurs du backend s'affichent dans le terminal où tourne `npm run dev`. En cas de 500, c'est là qu'on lit la cause.

### Sauvegarder les données

Dans le **Table Editor** de Supabase, on peut exporter une table au format CSV. Le dashboard propose aussi des options de sauvegarde dans la section Database.

---

## 12. Mettre l'application en ligne (Vercel)

Le déploiement se fait sur Vercel, qui sert le frontend (toujours disponible) et exécute le backend à la demande. Étapes clés :

1. Connecter le dépôt GitHub à un compte Vercel **personnel**.
2. Renseigner côté Vercel les variables d'environnement : `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, et `CORS_ORIGIN` (l'adresse du site déployé).
3. Une fois l'adresse du backend connue, la coller dans `API_URL` de `app.js` **et** `formulaire.js`, puis pousser la modification.

Une fois en ligne, l'application est accessible depuis n'importe quel appareil (ordinateur, téléphone) via son adresse, sans rien lancer sur sa propre machine.

---

## 13. Résolution des problèmes courants

### Le serveur ne démarre pas : « SUPABASE_URL et SUPABASE_PUBLISHABLE_KEY doivent être définies »

**Cause probable :** `backend/.env` absent, mal placé, ou incomplet.
**Solution :** vérifier le fichier `backend/.env` et ses deux lignes (section 5). Récupérer les valeurs dans le dashboard Supabase si besoin, enregistrer, relancer `npm run dev`.

### Erreur au démarrage : « Node.js 20 detected without native WebSocket support »

**Cause probable :** une version de Node inférieure à 22 ne fournit pas WebSocket nativement.
**Solution :** le projet inclut déjà la librairie `ws` pour contourner cela. Si l'erreur revient, vérifier l'installation (`npm install`). Passer à Node 22 ou plus récent règle le problème à la source.

### Les appels à l'API renvoient 401

**Cause probable :** non connecté, ou session expirée.
**Solution :** se reconnecter. Le 401 signifie « authentification invalide ou absente ».

### La liste des snippets est vide alors que je suis connecté

**Cause probable 1 :** anciens snippets « orphelins » sans `user_id`, donc invisibles (section 8). C'est normal.
**Cause probable 2 :** compte connecté différent de celui qui a créé les snippets.
**Solution :** créer un nouveau snippet pour vérifier, et contrôler quel compte est connecté.

### Erreur « CORS » dans la console du navigateur

**Cause probable :** le frontend appelle l'API depuis une adresse non autorisée par `CORS_ORIGIN`.
**Solution :** en local, laisser `CORS_ORIGIN` vide. En production, y mettre exactement l'adresse du site déployé.

### Le frontend n'arrive pas à joindre l'API

**Cause probable :** `API_URL` ne pointe pas vers la bonne adresse, ou le backend n'est pas démarré.
**Solution :** vérifier que le backend tourne, et que `API_URL` (dans `app.js` et `formulaire.js`) correspond à l'adresse réelle.

### Réponse 400 à la création ou modification

**Cause probable :** un champ obligatoire (titre, code, langage) est vide.
**Solution :** remplir les champs obligatoires.

### Réponse 404 à la modification ou suppression

**Cause probable :** snippet inexistant, ou n'appartenant pas au compte connecté.
**Solution :** vérifier l'identifiant et le compte.

### Réponse 429 (trop de requêtes)

**Cause probable :** la limite de débit est atteinte (100 requêtes par tranche de 15 minutes, configurée dans `server.ts`).
**Solution :** patienter quelques minutes. Si la limite gêne un usage normal, ajuster la valeur du `rateLimit` dans `backend/server.ts`.

### Le projet en ligne ne répond plus après une longue inactivité

**Cause probable :** sur l'offre gratuite, Supabase met le projet en pause après une période sans activité.
**Solution :** réactiver (unpause) le projet depuis le dashboard Supabase.

### Un fichier se corrompt après un copier-coller dans le terminal

**Cause probable :** sur certains terminaux, coller plusieurs lignes mélange les caractères.
**Solution :** éditer les fichiers multi-lignes dans VS Code. Pour une seule ligne, utiliser une commande `echo` simple.

### Après une modification, le comportement ne change pas

**Cause probable :** la commande `npm start` lance la version compilée (`dist/`), qui peut être périmée.
**Solution :** en développement, utiliser `npm run dev`. Sinon, refaire `npm run build` avant de relancer.

---

## 14. Commandes utiles

### Scripts npm du projet

| Commande | Effet |
|---|---|
| `npm install` | installe / réinstalle les dépendances |
| `npm run dev` | démarre le backend en mode développement |
| `npm run build` | compile le TypeScript vers `dist/` |
| `npm run lint` | vérifie la qualité du code |

### Git (workflow du projet)

```
git checkout -b feature/ma-fonctionnalite   # nouvelle branche
# ... modifications ...
git add chemin/du/fichier
git commit -m "message en français"
git checkout main
git merge --ff-only feature/ma-fonctionnalite
git branch -d feature/ma-fonctionnalite
git push
```

Conventions : une branche par fonctionnalité (`feature/`, `fix/`, `chore/`, `docs/`), messages de commit en français, fusion en fast-forward uniquement, suppression de la branche après fusion.

### Git, dépannage rapide

| Besoin | Commande |
|---|---|
| voir l'état des fichiers | `git status` |
| voir l'historique | `git log --oneline` |
| annuler les modifications non enregistrées d'un fichier | `git restore chemin/du/fichier` |
| récupérer la dernière version distante | `git pull` |

---

## 15. Bonnes pratiques et sécurité

À faire :

- garder GitHub, Supabase et Vercel sous des comptes **personnels** pour garder le contrôle,
- vérifier le build (`npm run build`), le lint (`npm run lint`) et les tests manuels avant de committer,
- reproduire le schéma de sécurité (colonne `user_id`, RLS, policies) sur toute nouvelle table de données par utilisateur.

À ne jamais faire :

- committer le fichier `.env` (il est ignoré par Git, le laisser ainsi),
- mettre une clé **secrète** Supabase dans le frontend ou sur GitHub,
- laisser une clé secrète exposée : si cela arrive, la révoquer immédiatement dans le dashboard Supabase et en générer une autre.

Rappel sur les clés : la clé *publishable* est faite pour être publique (sans danger côté navigateur). Une clé *secrète* donne un accès privilégié et contourne la RLS : elle ne sert qu'à des tâches d'administration côté serveur, jamais dans le navigateur.

---

## 16. Maintenance

- **Versions de Node :** en dessous de Node 22, la librairie `ws` est nécessaire (déjà incluse). Node 22 ou plus récent fournit WebSocket nativement.
- **Le fichier `.env` n'est jamais versionné.** Le recréer sur chaque nouvelle machine à partir des valeurs du dashboard Supabase.
- **Mettre à jour les dépendances :** `npm update`, puis revérifier que tout fonctionne (`npm run dev`, `npm run lint`).
- **Sauvegardes :** le code est sur GitHub, la base sur Supabase. Pour une copie locale du projet ailleurs (drive personnel), copier le dossier **sans** `node_modules`, qui se reconstruit avec `npm install`.
- **Le cahier de bord** (s'il est conservé dans un outil basé sur le navigateur) vit dans le navigateur de la machine : penser à l'exporter avant de changer ou de rendre l'ordinateur.

---

## 17. Glossaire

| Terme | Définition |
|---|---|
| **Snippet** | un extrait de code enregistré dans l'application |
| **Frontend** | la partie visible dans le navigateur (pages, boutons) |
| **Backend** | le serveur qui traite les demandes et parle à la base |
| **API** | l'ensemble des routes du backend que le frontend appelle |
| **Route / endpoint** | une adresse précise de l'API (par exemple `/snippets`) |
| **Supabase** | le service qui héberge la base de données et gère les comptes |
| **RLS (Row Level Security)** | sécurité au niveau des lignes : la base ne renvoie à chacun que ses propres données |
| **Policy** | une règle de la RLS qui dit qui a le droit de faire quoi |
| **Token (JWT)** | preuve d'identité temporaire envoyée à l'API à chaque demande |
| **Middleware** | un morceau de code qui s'exécute avant les routes (par exemple la vérification du token) |
| **CORS** | mécanisme qui contrôle quelles adresses ont le droit d'appeler l'API |
| **Variable d'environnement** | un réglage stocké hors du code (dans `.env`), comme l'URL ou la clé |
| **Serverless** | un backend qui s'exécute à la demande plutôt qu'en tournant en continu |
| **Lint** | une vérification automatique de la qualité et du style du code |
| **PWA** | une application web installable sur le téléphone comme une vraie appli |
| **Fast-forward (merge)** | une fusion Git propre, sans commit de fusion supplémentaire |

---

*Document de référence personnel. À conserver avec le code du projet (par exemple dans un dossier `docs/` du dépôt) pour qu'il reste sauvegardé et accessible partout.*

# CodeGrimoire

Bloc-notes de code privé : une application web pour stocker, rechercher et gérer ses extraits de code (snippets). Chaque utilisateur ne voit et ne gère que ses propres snippets.

## Stack

- **Frontend** : HTML, Tailwind CSS, JavaScript vanilla
- **Backend** : Node.js, Express, TypeScript
- **Base de données et authentification** : Supabase (PostgreSQL)
- **Sécurité par utilisateur** : Row Level Security (RLS) + token JWT

## Fonctionnalités

- Création, modification et suppression de snippets
- Recherche en temps réel
- Copie du code en un clic
- Badge de langage
- Authentification (inscription, connexion, session, déconnexion)
- Isolation des données : chaque utilisateur n'accède qu'à ses propres snippets

## Démarrage rapide

```
git clone https://github.com/LoukaKuhl/CodeGrimoire.git
cd CodeGrimoire
npm install
```

Créer le fichier `backend/.env` :

```
SUPABASE_URL=https://VOTRE-PROJET.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_VOTRE_CLE
```

Ces deux valeurs se trouvent dans le dashboard Supabase (Project Settings, API Keys). Elles ne sont pas sensibles : la clé publishable est conçue pour être utilisée côté navigateur.

Lancer le backend :

```
npm run dev
```

Le serveur démarre sur `http://localhost:3000`. Ouvrir ensuite le frontend (par exemple `frontend/connexion.html`) avec un serveur de fichiers statiques comme Live Server (`http://127.0.0.1:5500`).

## Scripts

| Commande | Effet |
|---|---|
| `npm run dev` | démarre le backend en développement |
| `npm run build` | compile le TypeScript vers `dist/` |
| `npm run lint` | vérifie la qualité du code |

## Sécurité

L'authentification est gérée par Supabase (email et mot de passe). La table `snippets` a la Row Level Security activée : grâce à une colonne `user_id` et à des règles (policies), la base ne renvoie à chaque utilisateur que ses propres lignes. Le backend agit au nom de l'utilisateur via son token. Le script de sécurisation est versionné dans `backend/db/rls-snippets.sql`. Le fichier `.env` n'est jamais versionné.

## Documentation

Un guide complet (architecture, carte des fichiers, référence de l'API, codes de réponse, recettes pratiques, dépannage, glossaire) est disponible dans `docs/GUIDE-CodeGrimoire.md`.

## Conventions

Branches par fonctionnalité (`feature/`, `fix/`, `chore/`, `docs/`), messages de commit en français, fusion en fast-forward. Style JavaScript et TypeScript sans point-virgule, apostrophes simples. Conventions du projet : voir `docs/CONVENTIONS.md`.

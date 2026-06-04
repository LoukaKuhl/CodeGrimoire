# CodeGrimoire

Application web privée de stockage et de recherche de snippets de code. Projet de stage BTS SIO SLAM, Agence 418.

## Stack
- Frontend : HTML, Tailwind CSS (CDN), JavaScript vanilla
- Backend : Node.js, Express, CommonJS
- Base de données : Supabase (PostgreSQL)
- Déploiement : Vercel (prévu)

## Conventions
Le développement suit `docs/CONVENTIONS.md`, qui fait foi. La lire avant toute modification. Toute déviation doit être signalée avant d'être appliquée, jamais exécutée silencieusement.

## Architecture attendue
- `frontend/` : une page = un fichier JS (`app.js` pour la liste et le détail, `formulaire.js` pour la création et l'édition). Scripts classiques, `onclick` inline.
- `backend/server.js` : configuration Express, middlewares, montage des routes.
- `backend/routes/` : HTTP uniquement (routing, validation, réponses). Pas d'accès direct à Supabase.
- `backend/services/` : logique métier et accès aux données. Testable sans HTTP.
- `backend/supabase.js` : connexion à la base, utilisée par les services.

## Langue
Tout le code, les commentaires et les messages de commit sont en français.

## Commandes
- `npm start` : démarre le serveur (port 3000)
- `npm run lint` : analyse le code avec ESLint

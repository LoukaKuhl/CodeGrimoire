# CodeGrimoire 🧙‍♂️

Un bloc-notes privé pour stocker et retrouver ses morceaux de code.

## Stack technique

- **Frontend** : HTML, Tailwind CSS, JavaScript
- **Backend** : Node.js avec Express, en TypeScript (compilé en CommonJS par `tsc`)
- **Base de données** : Supabase (PostgreSQL)
- **Hébergement** : Vercel

## Fonctionnalités prévues

- Ajout, modification et suppression de snippets
- Coloration syntaxique style VS Code
- Recherche instantanée
- Bouton "Copier"
- Mode sombre
- Page de connexion sécurisée
- PWA compatible mobile

## Structure du projet
codegrimoire/
├── backend/
│   ├── routes/
│   │   └── snippets.ts
│   ├── services/
│   │   └── snippets.service.ts
│   ├── server.ts
│   ├── supabase.ts
│   └── .env
├── dist/ (sortie compilée par tsc, ignorée par Git)
├── docs/
│   └── CONVENTIONS.md
├── frontend/
│   ├── index.html
│   ├── formulaire.html
│   ├── connexion.html
│   ├── app.js
│   ├── formulaire.js
│   └── style.css
├── .editorconfig
├── .gitignore
├── eslint.config.js
├── package.json
├── README.md
└── tsconfig.json

## Auteur

Louka Kuhl - Stage BTS SIO SLAM - Mai/Juin 2026
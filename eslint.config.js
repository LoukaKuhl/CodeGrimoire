const js = require('@eslint/js')
const globals = require('globals')
const tseslint = require('typescript-eslint')

module.exports = [
    // Règles recommandées de base d'ESLint
    js.configs.recommended,

    // Fichiers Node.js à la racine (CommonJS)
    {
        files: ['*.js'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: { ...globals.node }
        }
    },

    // Backend : TypeScript, règles recommandées de typescript-eslint
    ...tseslint.configs.recommended.map((config) => ({
        ...config,
        files: ['backend/**/*.ts']
    })),
    {
        files: ['backend/**/*.ts'],
        languageOptions: {
            globals: { ...globals.node }
        }
    },

    // Frontend : navigateur, scripts classiques
    {
        files: ['frontend/**/*.js'],
        languageOptions: {
            sourceType: 'script',
            globals: { ...globals.browser }
        }
    },

    // Règles de la convention CodeGrimoire
    {
        rules: {
            'no-var': 'error',
            'prefer-const': 'error',
            'eqeqeq': 'error',
            'no-unused-vars': 'warn'
        }
    },

    // En TypeScript, la détection des variables inutilisées revient à typescript-eslint
    {
        files: ['backend/**/*.ts'],
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
        }
    },

    // Dossiers à ignorer
    {
        ignores: ['node_modules/', 'dist/']
    }
]

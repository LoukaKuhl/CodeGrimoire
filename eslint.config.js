const js = require('@eslint/js')
const globals = require('globals')

module.exports = [
    // Règles recommandées de base d'ESLint
    js.configs.recommended,

    // Fichiers Node.js : config à la racine + backend (CommonJS)
    {
        files: ['*.js', 'backend/**/*.js'],
        languageOptions: {
            sourceType: 'commonjs',
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

    // Dossiers à ignorer
    {
        ignores: ['node_modules/']
    }
]
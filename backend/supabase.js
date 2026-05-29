// ============ CHARGEMENT DES VARIABLES D'ENVIRONNEMENT ============
require('dotenv').config({ path: require('path').join(__dirname, '.env'), override: true })
// dotenv : charge les variables depuis backend/.env
// __dirname : chemin du dossier actuel (backend/)
// override: true : force le rechargement même si déjà chargé

// ============ CONNEXION SUPABASE ============
const { createClient } = require('@supabase/supabase-js')
// createClient : fonction pour créer la connexion à Supabase

const ws = require('ws')
// ws : package WebSocket pour Node.js 20 (requis par Supabase)

const supabase = createClient(
    process.env.SUPABASE_URL,
    // SUPABASE_URL : URL du projet Supabase depuis le .env
    process.env.SUPABASE_SECRET_KEY,
    // SUPABASE_SECRET_KEY : clé secrète depuis le .env
    {
        realtime: {
            transport: ws
            // transport : indique à Supabase d'utiliser le package ws
        }
    }
)
// supabase : notre connexion à la base de données

module.exports = { supabase }
// Exporte la connexion pour l'utiliser dans d'autres fichiers
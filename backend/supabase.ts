import path from 'path'
import dotenv from 'dotenv'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { WebSocketLikeConstructor } from '@supabase/realtime-js'
import ws from 'ws'

// Chemin valable depuis backend/ (source) comme depuis dist/ (compilé)
dotenv.config({ path: path.join(__dirname, '..', 'backend', '.env'), override: true })

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error('SUPABASE_URL et SUPABASE_PUBLISHABLE_KEY doivent être définies dans backend/.env')
}

const url = SUPABASE_URL
const clePublishable = SUPABASE_PUBLISHABLE_KEY

/**
 * Crée un client Supabase agissant au nom de l'utilisateur identifié par son token JWT.
 * Les requêtes portent le token de l'utilisateur (et non la clé service-role), donc la RLS s'applique.
 * @param token Token JWT extrait de l'en-tête Authorization
 */
function creerClientPourUtilisateur(token: string): SupabaseClient {
    return createClient(url, clePublishable, {
        global: {
            headers: { Authorization: `Bearer ${token}` }
        },
        auth: {
            persistSession: false,
            autoRefreshToken: false
        },
        realtime: {
            transport: ws as unknown as WebSocketLikeConstructor
        }
    })
}

export { creerClientPourUtilisateur }

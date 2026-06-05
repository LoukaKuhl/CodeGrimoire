import path from 'path'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import type { WebSocketLikeConstructor } from '@supabase/realtime-js'
import ws from 'ws'

// Chemin valable depuis backend/ (source) comme depuis dist/ (compilé)
dotenv.config({ path: path.join(__dirname, '..', 'backend', '.env'), override: true })

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    throw new Error('SUPABASE_URL et SUPABASE_SECRET_KEY doivent être définies dans backend/.env')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    realtime: {
        transport: ws as unknown as WebSocketLikeConstructor
    }
})

export { supabase }

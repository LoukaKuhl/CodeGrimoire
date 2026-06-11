import { Request, Response, NextFunction } from 'express'
import { SupabaseClient } from '@supabase/supabase-js'
import { creerClientPourUtilisateur } from '../supabase'

declare global {
    // Augmentation standard d'Express : la syntaxe namespace est imposée par les types d'Express
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            clientSupabase: SupabaseClient
        }
    }
}

/**
 * Authentifie la requête via le token JWT de l'en-tête Authorization.
 * Attache à `req.clientSupabase` un client agissant au nom de l'utilisateur (RLS appliquée).
 * Répond 401 si le token est absent ou mal formé.
 */
function authentification(req: Request, res: Response, next: NextFunction): void {
    const enTete = req.headers.authorization

    if (!enTete || !enTete.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Authentification requise' })
        return
    }

    const token = enTete.slice('Bearer '.length)
    req.clientSupabase = creerClientPourUtilisateur(token)
    next()
}

export { authentification }

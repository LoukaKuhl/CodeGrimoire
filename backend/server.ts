import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import snippetsRouter from './routes/snippets'
import { messageErreur } from './utils/messageErreur'
import { ValidationError, NotFoundError } from './erreurs'

dotenv.config()

const app = express()

app.use(helmet())

const origineCors = process.env.CORS_ORIGIN
app.use(cors(origineCors ? { origin: origineCors } : undefined))

const limiteur = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false
})
app.use(limiteur)

app.use(express.json())

app.use('/snippets', snippetsRouter)

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Bienvenue sur le serveur CodeGrimoire !' })
})

app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route introuvable' })
})

/**
 * Indique si l'erreur est une erreur d'authentification PostgREST/Supabase (token invalide ou expiré).
 * @param erreur Erreur interceptée par le middleware central
 */
function estErreurAuthSupabase(erreur: unknown): boolean {
    return (
        typeof erreur === 'object' &&
        erreur !== null &&
        'code' in erreur &&
        erreur.code === 'PGRST301'
    )
}

app.use((erreur: unknown, req: Request, res: Response, _next: NextFunction) => {
    console.error(erreur)
    if (erreur instanceof ValidationError) {
        return res.status(400).json({ error: erreur.message })
    }
    if (erreur instanceof NotFoundError) {
        return res.status(404).json({ error: erreur.message })
    }
    if (estErreurAuthSupabase(erreur)) {
        return res.status(401).json({ error: 'Authentification invalide' })
    }
    res.status(500).json({ error: messageErreur(erreur) })
})

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`)
})

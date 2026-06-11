import express, { Request, Response, NextFunction } from 'express'

import {
    DonneesSnippet,
    listerSnippets,
    creerSnippet,
    modifierSnippet,
    supprimerSnippet
} from '../services/snippets.service'
import { ValidationError } from '../erreurs'
import { authentification } from '../middlewares/authentification'

const router = express.Router()

router.use(authentification)

/**
 * Vérifie que les champs obligatoires d'un snippet sont présents et non vides.
 * @param donnees Corps de la requête
 * @throws ValidationError si un champ obligatoire manque ou est vide
 */
function validerDonneesSnippet(donnees: Partial<DonneesSnippet>): void {
    const champsObligatoires: (keyof DonneesSnippet)[] = ['title', 'code', 'language']
    const champManquant = champsObligatoires.find((champ) => {
        const valeur = donnees[champ]
        return typeof valeur !== 'string' || valeur.trim() === ''
    })
    if (champManquant) {
        throw new ValidationError(`Le champ « ${champManquant} » est obligatoire`)
    }
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const snippets = await listerSnippets(req.clientSupabase)
        res.json(snippets)
    } catch (erreur) {
        next(erreur)
    }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        validerDonneesSnippet(req.body)
        const snippet = await creerSnippet(req.clientSupabase, req.body)
        res.status(201).json(snippet)
    } catch (erreur) {
        next(erreur)
    }
})

router.put('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        validerDonneesSnippet(req.body)
        const snippet = await modifierSnippet(req.clientSupabase, req.params.id, req.body)
        res.json(snippet)
    } catch (erreur) {
        next(erreur)
    }
})

router.delete('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        await supprimerSnippet(req.clientSupabase, req.params.id)
        res.json({ message: 'Snippet supprimé avec succès' })
    } catch (erreur) {
        next(erreur)
    }
})

export default router

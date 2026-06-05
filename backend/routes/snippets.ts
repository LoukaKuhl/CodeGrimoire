import express, { Request, Response } from 'express'

import {
    listerSnippets,
    creerSnippet,
    modifierSnippet,
    supprimerSnippet
} from '../services/snippets.service'

const router = express.Router()

function messageErreur(erreur: unknown): string {
    return erreur instanceof Error ? erreur.message : 'Erreur inattendue'
}

router.get('/', async (req: Request, res: Response) => {
    try {
        const snippets = await listerSnippets()
        res.json(snippets)
    } catch (erreur) {
        res.status(500).json({ error: messageErreur(erreur) })
    }
})

router.post('/', async (req: Request, res: Response) => {
    try {
        const snippet = await creerSnippet(req.body)
        res.status(201).json(snippet)
    } catch (erreur) {
        res.status(500).json({ error: messageErreur(erreur) })
    }
})

router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        const snippet = await modifierSnippet(req.params.id, req.body)
        res.json(snippet)
    } catch (erreur) {
        res.status(500).json({ error: messageErreur(erreur) })
    }
})

router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        await supprimerSnippet(req.params.id)
        res.json({ message: 'Snippet supprimé avec succès' })
    } catch (erreur) {
        res.status(500).json({ error: messageErreur(erreur) })
    }
})

export default router

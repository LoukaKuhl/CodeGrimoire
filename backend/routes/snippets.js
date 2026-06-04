const express = require('express')
const router = express.Router()

const {
    listerSnippets,
    creerSnippet,
    modifierSnippet,
    supprimerSnippet
} = require('../services/snippets.service')

router.get('/', async (req, res) => {
    try {
        const snippets = await listerSnippets()
        res.json(snippets)
    } catch (erreur) {
        res.status(500).json({ error: erreur.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const snippet = await creerSnippet(req.body)
        res.status(201).json(snippet)
    } catch (erreur) {
        res.status(500).json({ error: erreur.message })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const snippet = await modifierSnippet(req.params.id, req.body)
        res.json(snippet)
    } catch (erreur) {
        res.status(500).json({ error: erreur.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await supprimerSnippet(req.params.id)
        res.json({ message: 'Snippet supprimé avec succès' })
    } catch (erreur) {
        res.status(500).json({ error: erreur.message })
    }
})

module.exports = router

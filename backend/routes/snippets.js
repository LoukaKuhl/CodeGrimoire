// ============ IMPORTS ============
const express = require('express')
const router = express.Router()

const { supabase } = require('../supabase')

// ============ GET - Récupérer tous les snippets ============
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('snippets')
            .select('*')

        if (error) throw error
        res.json(data)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// ============ POST - Créer un snippet ============
router.post('/', async (req, res) => {
    try {
        const { title, code, language, tags } = req.body

        const { data, error } = await supabase
            .from('snippets')
            .insert([{ title, code, language, tags }])
            .select()

        if (error) throw error
        res.status(201).json(data)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// ============ PUT - Modifier un snippet ============
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { title, code, language, tags } = req.body

        const { data, error } = await supabase
            .from('snippets')
            .update({ title, code, language, tags })
            .eq('id', id)
            .select()

        if (error) throw error
        res.json(data)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// ============ DELETE - Supprimer un snippet ============
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params

        const { error } = await supabase
            .from('snippets')
            .delete()
            .eq('id', id)

        if (error) throw error
        res.json({ message: 'Snippet supprimé avec succès' })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
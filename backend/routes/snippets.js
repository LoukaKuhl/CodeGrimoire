// ============ IMPORTS ============
const express = require('express')
const router = express.Router()
// router : gestionnaire de routes Express

const { supabase } = require('../supabase')
// Importe la connexion Supabase depuis supabase.js

// ============ GET - Récupérer tous les snippets ============
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('snippets')
            // .from : nom de la table dans Supabase
            .select('*')
            // .select('*') : récupère toutes les colonnes

        if (error) throw error
        // Si Supabase renvoie une erreur, la transmet au catch

        res.json(data)
        // Renvoie les snippets au frontend au format JSON

    } catch (error) {
        res.status(500).json({ error: error.message })
        // 500 : erreur serveur interne
    }
})

// ============ POST - Créer un snippet ============
router.post('/', async (req, res) => {
    try {
        const { title, code, language, tags } = req.body
        // Déstructuration : extrait les champs envoyés par le formulaire

        const { data, error } = await supabase
            .from('snippets')
            .insert([{ title, code, language, tags }])
            // .insert : ajoute un nouveau enregistrement dans la table
            .select()
            // .select() : retourne le snippet créé

        if (error) throw error
        res.status(201).json(data)
        // 201 : indique qu'une ressource a été créée avec succès

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// ============ PUT - Modifier un snippet ============
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        // req.params : récupère l'id dans l'URL (/snippets/4)

        const { title, code, language, tags } = req.body
        // req.body : récupère les données envoyées par le formulaire

        const { data, error } = await supabase
            .from('snippets')
            .update({ title, code, language, tags })
            // .update : modifie les colonnes spécifiées
            .eq('id', id)
            // .eq : filtre sur l'id (WHERE id = ?)
            .select()

        if (error) throw error
        res.json(data)
        // 200 : retourne le snippet modifié

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// ============ DELETE - Supprimer un snippet ============
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        // Récupère l'id du snippet à supprimer dans l'URL

        const { error } = await supabase
            .from('snippets')
            .delete()
            // .delete : supprime l'enregistrement
            .eq('id', id)
            // .eq : filtre sur l'id pour ne supprimer que ce snippet

        if (error) throw error
        res.json({ message: 'Snippet supprimé avec succès' })
        // Confirme la suppression au frontend

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
// Exporte le router pour l'utiliser dans server.js
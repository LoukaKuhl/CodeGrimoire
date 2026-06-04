const { supabase } = require('../supabase')

/**
 * Récupère tous les snippets de la table.
 * @returns {Promise<Array>} Liste des snippets
 */
async function listerSnippets() {
    const { data, error } = await supabase
        .from('snippets')
        .select('*')

    if (error) throw error
    return data
}

/**
 * Crée un snippet à partir des champs fournis.
 * @param {{title: string, code: string, language: string, tags?: string}} donnees
 * @returns {Promise<Array>} Snippet créé (tableau d'une ligne renvoyé par Supabase)
 */
async function creerSnippet(donnees) {
    const { title, code, language, tags } = donnees

    const { data, error } = await supabase
        .from('snippets')
        .insert([{ title, code, language, tags }])
        .select()

    if (error) throw error
    return data
}

/**
 * Modifie un snippet existant.
 * @param {string|number} id Identifiant du snippet
 * @param {{title: string, code: string, language: string, tags?: string}} donnees
 * @returns {Promise<Array>} Snippet modifié (tableau d'une ligne renvoyé par Supabase)
 */
async function modifierSnippet(id, donnees) {
    const { title, code, language, tags } = donnees

    const { data, error } = await supabase
        .from('snippets')
        .update({ title, code, language, tags })
        .eq('id', id)
        .select()

    if (error) throw error
    return data
}

/**
 * Supprime un snippet par son identifiant.
 * @param {string|number} id Identifiant du snippet
 */
async function supprimerSnippet(id) {
    const { error } = await supabase
        .from('snippets')
        .delete()
        .eq('id', id)

    if (error) throw error
}

module.exports = {
    listerSnippets,
    creerSnippet,
    modifierSnippet,
    supprimerSnippet
}

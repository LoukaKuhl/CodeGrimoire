import { supabase } from '../supabase'

interface Snippet {
    id: number
    title: string
    code: string
    language: string
    tags: string | null
    created_at: string
}

interface DonneesSnippet {
    title: string
    code: string
    language: string
    tags?: string
}

/**
 * Récupère tous les snippets de la table.
 * @returns Liste des snippets
 */
async function listerSnippets(): Promise<Snippet[]> {
    const { data, error } = await supabase
        .from('snippets')
        .select('*')

    if (error) throw error
    return data
}

/**
 * Crée un snippet à partir des champs fournis.
 * @returns Snippet créé (tableau d'une ligne renvoyé par Supabase)
 */
async function creerSnippet(donnees: DonneesSnippet): Promise<Snippet[]> {
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
 * @param id Identifiant du snippet
 * @returns Snippet modifié (tableau d'une ligne renvoyé par Supabase)
 */
async function modifierSnippet(id: string, donnees: DonneesSnippet): Promise<Snippet[]> {
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
 * @param id Identifiant du snippet
 */
async function supprimerSnippet(id: string): Promise<void> {
    const { error } = await supabase
        .from('snippets')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export {
    Snippet,
    DonneesSnippet,
    listerSnippets,
    creerSnippet,
    modifierSnippet,
    supprimerSnippet
}

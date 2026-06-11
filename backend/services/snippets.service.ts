import { SupabaseClient } from '@supabase/supabase-js'
import { NotFoundError } from '../erreurs'

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
 * @param client Client Supabase agissant au nom de l'utilisateur
 * @returns Liste des snippets
 */
async function listerSnippets(client: SupabaseClient): Promise<Snippet[]> {
    const { data, error } = await client
        .from('snippets')
        .select('*')

    if (error) throw error
    return data
}

/**
 * Crée un snippet à partir des champs fournis.
 * @param client Client Supabase agissant au nom de l'utilisateur
 * @returns Snippet créé (tableau d'une ligne renvoyé par Supabase)
 */
async function creerSnippet(client: SupabaseClient, donnees: DonneesSnippet): Promise<Snippet[]> {
    const { title, code, language, tags } = donnees

    const { data, error } = await client
        .from('snippets')
        .insert([{ title, code, language, tags }])
        .select()

    if (error) throw error
    return data
}

/**
 * Modifie un snippet existant.
 * @param client Client Supabase agissant au nom de l'utilisateur
 * @param id Identifiant du snippet
 * @returns Snippet modifié (tableau d'une ligne renvoyé par Supabase)
 */
async function modifierSnippet(client: SupabaseClient, id: string, donnees: DonneesSnippet): Promise<Snippet[]> {
    const { title, code, language, tags } = donnees

    const { data, error } = await client
        .from('snippets')
        .update({ title, code, language, tags })
        .eq('id', id)
        .select()

    if (error) throw error
    if (data.length === 0) throw new NotFoundError(`Aucun snippet avec l'id ${id}`)
    return data
}

/**
 * Supprime un snippet par son identifiant.
 * @param client Client Supabase agissant au nom de l'utilisateur
 * @param id Identifiant du snippet
 */
async function supprimerSnippet(client: SupabaseClient, id: string): Promise<void> {
    const { data, error } = await client
        .from('snippets')
        .delete()
        .eq('id', id)
        .select()

    if (error) throw error
    if (data.length === 0) throw new NotFoundError(`Aucun snippet avec l'id ${id}`)
}

export {
    Snippet,
    DonneesSnippet,
    listerSnippets,
    creerSnippet,
    modifierSnippet,
    supprimerSnippet
}

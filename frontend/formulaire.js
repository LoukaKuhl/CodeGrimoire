// ============ URL DE L'API ============
const API_URL = 'http://localhost:3000'

// Récupère l'id dans l'URL si on est en mode modification
const urlParams = new URLSearchParams(window.location.search)
const snippetId = urlParams.get('id')
// urlParams : lit les paramètres de l'URL (?id=4)
// snippetId : contient "4" ou null si pas d'id

// ============ AU CHARGEMENT DE LA PAGE ============
if (snippetId) {
    document.querySelector('h2').textContent = 'Modifier le snippet'
    chargerSnippetExistant()
}

// ============ CHARGER LES DONNEES DU SNIPPET ============
async function chargerSnippetExistant() {
    try {
        const response = await fetch(`${API_URL}/snippets`)
        const snippets = await response.json()
        const snippet = snippets.find(s => s.id == snippetId)

        if (!snippet) return

        document.getElementById('input-titre').value = snippet.title
        document.getElementById('input-langage').value = snippet.language
        document.getElementById('input-tags').value = snippet.tags || ''
        document.getElementById('input-code').value = snippet.code

    } catch (erreur) {
        console.error('Erreur :', erreur)
    }
}

// ============ SAUVEGARDER UN SNIPPET ============
async function sauvegarderSnippet() {
    const title = document.getElementById('input-titre').value
    const language = document.getElementById('input-langage').value
    const tags = document.getElementById('input-tags').value
    const code = document.getElementById('input-code').value

    if (!title || !language || !code) {
        alert('Merci de remplir le titre, le langage et le code !')
        return
    }

    try {
        const url = snippetId ? `${API_URL}/snippets/${snippetId}` : `${API_URL}/snippets`
        const method = snippetId ? 'PUT' : 'POST'
        // Si id présent : PUT (modification), sinon : POST (création)

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, language, tags, code })
        })

        if (response.ok) {
            alert(snippetId ? 'Snippet modifié !' : 'Snippet sauvegardé !')
            window.location.href = 'index.html'
        }

    } catch (erreur) {
        console.error('Erreur :', erreur)
    }
}
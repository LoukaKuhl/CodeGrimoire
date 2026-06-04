const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://[url-vercel-a-definir-en-s5].vercel.app'

const urlParams = new URLSearchParams(window.location.search)
const snippetId = urlParams.get('id')

if (snippetId) {
    document.querySelector('h2').textContent = 'Modifier le snippet'
    chargerSnippetExistant()
}

async function chargerSnippetExistant() {
    try {
        const response = await fetch(`${API_URL}/snippets`)
        const snippets = await response.json()
        const snippet = snippets.find(s => s.id === Number(snippetId))

        if (!snippet) return

        document.getElementById('input-titre').value = snippet.title
        document.getElementById('input-langage').value = snippet.language
        document.getElementById('input-tags').value = snippet.tags || ''
        document.getElementById('input-code').value = snippet.code
    } catch (erreur) {
        console.error('Erreur :', erreur)
    }
}

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

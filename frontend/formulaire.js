// ============ URL DE L'API (DÉTECTÉE DYNAMIQUEMENT) ============
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://[url-vercel-a-definir-en-s5].vercel.app'
// API_URL : détectée automatiquement selon l'environnement (alignée sur app.js)

const urlParams = new URLSearchParams(window.location.search)
// URLSearchParams : lit les paramètres de l'URL (?id=4)

const snippetId = urlParams.get('id')
// snippetId : contient l'id si on est en mode modification, null si création

// ============ AU CHARGEMENT DE LA PAGE ============
if (snippetId) {
    // Si un id est présent dans l'URL, on est en mode modification
    document.querySelector('h2').textContent = 'Modifier le snippet'
    // Change le titre du formulaire
    chargerSnippetExistant()
    // Charge les données du snippet à modifier
}

// ============ CHARGER LES DONNEES DU SNIPPET ============
async function chargerSnippetExistant() {
    try {
        const response = await fetch(`${API_URL}/snippets`)
        // Récupère tous les snippets depuis l'API

        const snippets = await response.json()
        // .json() : convertit la réponse en tableau JavaScript

        const snippet = snippets.find(s => s.id === Number(snippetId))
        // .find() : cherche le snippet dont l'id correspond à celui de l'URL
        // Number() : convertit l'id de l'URL (chaîne) en nombre pour comparer avec ===

        if (!snippet) return
        // Si le snippet n'existe pas, arrête la fonction

        document.getElementById('input-titre').value = snippet.title
        document.getElementById('input-langage').value = snippet.language
        document.getElementById('input-tags').value = snippet.tags || ''
        // || '' : si tags est null, affiche une chaîne vide
        document.getElementById('input-code').value = snippet.code
        // Pré-remplit chaque champ avec les données existantes

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
    // .value : lit le contenu de chaque champ du formulaire

    if (!title || !language || !code) {
        alert('Merci de remplir le titre, le langage et le code !')
        return
        // Vérifie que les champs obligatoires sont remplis avant d'appeler l'API
    }

    try {
        const url = snippetId ? `${API_URL}/snippets/${snippetId}` : `${API_URL}/snippets`
        // Si id présent : route PUT, sinon : route POST

        const method = snippetId ? 'PUT' : 'POST'
        // PUT : modification, POST : création

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            // Content-Type : indique au serveur qu'on envoie du JSON
            body: JSON.stringify({ title, language, tags, code })
            // JSON.stringify : convertit l'objet JavaScript en texte JSON
        })

        if (response.ok) {
            alert(snippetId ? 'Snippet modifié !' : 'Snippet sauvegardé !')
            window.location.href = 'index.html'
            // Redirige vers la page principale après sauvegarde
        }

    } catch (erreur) {
        console.error('Erreur :', erreur)
    }
}
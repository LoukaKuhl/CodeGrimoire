// ============ URL DE L'API ============
const API_URL = 'http://localhost:3000'

// Variable qui stocke tous les snippets en mémoire
let tousLesSnippets = []

// ============ CHARGER LES SNIPPETS ============
async function chargerSnippets() {
    try {
        const response = await fetch(`${API_URL}/snippets`)
        const snippets = await response.json()
        tousLesSnippets = snippets
        afficherSnippets(snippets)
    } catch (erreur) {
        console.error('Erreur lors du chargement :', erreur)
    }
}

// ============ AFFICHER LES SNIPPETS DANS LA SIDEBAR ============
function afficherSnippets(snippets) {
    const liste = document.getElementById('liste-snippets')

    if (snippets.length === 0) {
        liste.innerHTML = '<p class="text-gray-500 text-sm text-center mt-8">Aucun snippet pour l\'instant</p>'
        return
    }

    liste.innerHTML = snippets.map(snippet => `
        <div 
            class="bg-gray-800 rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-700"
            onclick="afficherDetail(${snippet.id})">
            <p class="text-white text-sm font-semibold">${snippet.title}</p>
            <span class="text-xs text-purple-400">${snippet.language}</span>
        </div>
    `).join('')
}

// ============ AFFICHER LE DETAIL D'UN SNIPPET ============
function afficherDetail(id) {
    const snippet = tousLesSnippets.find(s => s.id === id)
    if (!snippet) return

    document.getElementById('detail-snippet').dataset.id = id

    document.querySelector('#detail-snippet h2').textContent = snippet.title
    document.querySelector('#detail-snippet pre').textContent = snippet.code
}

// ============ SUPPRIMER UN SNIPPET ============
async function supprimerSnippet() {
    const id = document.getElementById('detail-snippet').dataset.id
    // dataset.id : récupère l'id mémorisé du snippet affiché

    if (!id) {
        alert('Sélectionne un snippet à supprimer !')
        return
    }

    if (!confirm('Supprimer ce snippet ?')) return
    // confirm : affiche une boîte de dialogue Oui/Non

    try {
        const response = await fetch(`${API_URL}/snippets/${id}`, {
            method: 'DELETE'
        })

        if (response.ok) {
            document.querySelector('#detail-snippet h2').textContent = 'Titre du snippet'
            document.querySelector('#detail-snippet pre').textContent = '// Ton code apparaîtra ici'
            chargerSnippets()
        }
    } catch (erreur) {
        console.error('Erreur :', erreur)
    }
}

// ============ LANCEMENT AU CHARGEMENT DE LA PAGE ============
chargerSnippets()
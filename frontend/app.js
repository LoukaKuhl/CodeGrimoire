// ============ URL DE L'API ============
const API_URL = 'http://localhost:3000'

let tousLesSnippets = []

// ============ COULEURS DES BADGES PAR LANGAGE ============
const badgeColors = {
    'JavaScript': 'bg-yellow-500 text-black',
    'Python':     'bg-blue-500 text-white',
    'HTML':       'bg-orange-500 text-white',
    'CSS':        'bg-pink-500 text-white',
    'SQL':        'bg-cyan-500 text-white',
    'PHP':        'bg-indigo-500 text-white',
}
// Si le langage n'est pas dans la liste, couleur par défaut
function getBadge(language) {
    return badgeColors[language] || 'bg-gray-500 text-white'
}

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
            class="bg-gray-800 rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-700 border border-transparent hover:border-purple-500 transition-all"
            onclick="afficherDetail(${snippet.id})">
            <p class="text-white text-sm font-semibold mb-1">${snippet.title}</p>
            <span class="text-xs px-2 py-0.5 rounded-full font-medium ${getBadge(snippet.language)}">
                ${snippet.language}
            </span>
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

    // Met à jour le badge de langage dans le détail
    const badge = document.getElementById('badge-langage')
    if (badge) {
        badge.textContent = snippet.language
        badge.className = `text-xs px-2 py-0.5 rounded-full font-medium ${getBadge(snippet.language)}`
    }
}

// ============ MODIFIER UN SNIPPET ============
function modifierSnippet() {
    const id = document.getElementById('detail-snippet').dataset.id
    if (!id) {
        alert('Sélectionne un snippet à modifier !')
        return
    }
    window.location.href = `formulaire.html?id=${id}`
}

// ============ SUPPRIMER UN SNIPPET ============
async function supprimerSnippet() {
    const id = document.getElementById('detail-snippet').dataset.id
    if (!id) {
        alert('Sélectionne un snippet à supprimer !')
        return
    }
    if (!confirm('Supprimer ce snippet ?')) return

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
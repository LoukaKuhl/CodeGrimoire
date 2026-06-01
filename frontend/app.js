// ============ URL DE L'API DETECTÉE DYNAMIQUEMENT ============
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://[url-vercel-a-definir-en-s5].vercel.app'
// API_URL : détectée automatiquement selon l'environnement

// ============ COULEURS DES BADGES PAR LANGAGE ============
const badgeColors = {
    'JavaScript': 'bg-yellow-500 text-black',
    'Python':     'bg-blue-500 text-white',
    'HTML':       'bg-orange-500 text-white',
    'CSS':        'bg-pink-500 text-white',
    'SQL':        'bg-cyan-500 text-white',
    'PHP':        'bg-indigo-500 text-white',
    'Autre':      'bg-gray-500 text-white'
}
// badgeColors : associe chaque langage à ses classes Tailwind

/**
 * Retourne les classes Tailwind du badge selon le langage.
 * @param {string} [language='Autre'] - Langage de programmation
 * @returns {string} Classes Tailwind du badge
 */
function getBadge(language = 'Autre') {
    return badgeColors[language] ?? badgeColors['Autre']
    // ?? : si le langage n'est pas dans la liste, retourne la couleur par défaut
}

// ============ ÉTAT GLOBAL ============
let tousLesSnippets = []
// tousLesSnippets : stocke tous les snippets en mémoire

// ============ CHARGER LES SNIPPETS ============
async function chargerSnippets() {
    try {
        const response = await fetch(`${API_URL}/snippets`)
        // fetch : envoie une requête GET à notre API

        const snippets = await response.json()
        // .json() : convertit la réponse en tableau JavaScript

        tousLesSnippets = snippets
        // Sauvegarde les snippets en mémoire

        afficherSnippets(snippets)
        // Appelle la fonction d'affichage avec les données reçues

    } catch (erreur) {
        console.error('Erreur lors du chargement :', erreur)
    }
}

// ============ AFFICHER LES SNIPPETS DANS LA SIDEBAR ============
function afficherSnippets(snippets) {
    const liste = document.getElementById('liste-snippets')
    // getElementById : trouve l'élément avec l'id "liste-snippets"

    if (snippets.length === 0) {
        liste.innerHTML = '<p class="text-gray-500 text-sm text-center mt-8">Aucun snippet pour l\'instant</p>'
        return
        // Si pas de snippets, affiche un message et arrête la fonction
    }

    liste.innerHTML = snippets.map(s => `
        <div
            data-id="${s.id}"
            class="bg-gray-800 rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-700 border border-transparent hover:border-purple-500 transition-all">
            <p class="text-white text-sm font-semibold mb-1">${s.title}</p>
            <span class="text-xs px-2 py-0.5 rounded-full font-medium ${getBadge(s.language)}">
                ${s.language}
            </span>
        </div>
    `).join('')
    // .map() : transforme chaque snippet en bloc HTML
    // data-id : stocke l'id pour la délégation d'événements
}

// ============ CONFIGURATION DE LA DÉLÉGATION D'ÉVÉNEMENTS ============
document.getElementById('liste-snippets').addEventListener('click', (e) => {
    const item = e.target.closest('[data-id]')
    // .closest() : remonte dans le DOM pour trouver l'élément avec data-id

    if (item) afficherDetail(Number(item.dataset.id))
    // Number() : convertit l'id string en nombre
})

document.getElementById('input-recherche').addEventListener('input', (e) => {
    rechercherSnippets(e.target.value)
    // Lance la recherche à chaque frappe
})

// ============ AFFICHER LE DETAIL D'UN SNIPPET ============
function afficherDetail(id) {
    const snippet = tousLesSnippets.find(s => s.id === id)
    // .find() : cherche le snippet dont l'id correspond

    if (!snippet) return
    // Si le snippet n'existe pas, arrête la fonction

    document.getElementById('detail-snippet').dataset.id = id
    // dataset.id : mémorise l'id du snippet affiché

    document.getElementById('detail-titre').textContent = snippet.title
    // Met à jour le titre dans la zone de détail

    document.getElementById('detail-code').textContent = snippet.code
    // Met à jour le code dans la zone de détail

    const badge = document.getElementById('detail-badge')
    badge.textContent = snippet.language
    badge.className = `text-xs px-2 py-0.5 rounded-full font-medium ${getBadge(snippet.language)}`
    // Met à jour le badge avec la bonne couleur
}

// ============ MODIFIER UN SNIPPET ============
function modifierSnippet() {
    const id = document.getElementById('detail-snippet').dataset.id
    // Récupère l'id du snippet actuellement affiché

    if (!id) {
        alert('Sélectionne un snippet à modifier !')
        return
    }

    window.location.href = `formulaire.html?id=${id}`
    // Redirige vers le formulaire en passant l'id dans l'URL
}

// ============ SUPPRIMER UN SNIPPET ============
async function supprimerSnippet() {
    const conteneurDetail = document.getElementById('detail-snippet')
    const id = conteneurDetail.dataset.id
    // Récupère l'id du snippet actuellement affiché

    if (!id) {
        alert('Sélectionne un snippet à supprimer !')
        return
    }

    if (!confirm('Supprimer ce snippet ?')) return
    // confirm : affiche une boîte de dialogue Oui/Non

    try {
        const response = await fetch(`${API_URL}/snippets/${id}`, {
            method: 'DELETE'
            // method DELETE : demande au serveur de supprimer le snippet
        })

        if (response.ok) {
            delete conteneurDetail.dataset.id
            // Efface l'id mémorisé après suppression

            document.getElementById('detail-titre').textContent = 'Titre du snippet'
            document.getElementById('detail-code').textContent = '// Ton code apparaîtra ici'
            const badge = document.getElementById('detail-badge')
            badge.textContent = 'Langage'
            badge.className = 'text-xs px-2 py-0.5 rounded-full font-medium bg-gray-700 text-white'
            // Remet la zone de détail à son état initial

            await chargerSnippets()
            // Recharge la liste après suppression
        }
    } catch (erreur) {
        console.error('Erreur :', erreur)
    }
}

// ============ RECHERCHER LES SNIPPETS ============
function rechercherSnippets(recherche) {
    const terme = recherche.toLowerCase().trim()
    // .toLowerCase() : insensible à la casse
    // .trim() : supprime les espaces inutiles

    if (terme === '') {
        afficherSnippets(tousLesSnippets)
        return
        // Si la recherche est vide, affiche tous les snippets
    }

    const resultats = tousLesSnippets.filter(s =>
        s.title.toLowerCase().includes(terme) ||
        s.language.toLowerCase().includes(terme) ||
        (s.tags && s.tags.toLowerCase().includes(terme))
    )
    // .filter() : garde seulement les snippets dont le titre, le langage ou les tags contiennent le terme

    afficherSnippets(resultats)
    // Affiche les snippets filtrés
}

// ============ LANCEMENT AU CHARGEMENT DE LA PAGE ============
window.onload = chargerSnippets
// window.onload : lance le chargement une fois le DOM prêt
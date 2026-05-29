// ============ URL DE L'API ============
const API_URL = 'http://localhost:3000'
// API_URL : adresse du serveur backend

let tousLesSnippets = []
// tousLesSnippets : stocke tous les snippets en mémoire pour éviter des appels API répétés

// ============ COULEURS DES BADGES PAR LANGAGE ============
const badgeColors = {
    'JavaScript': 'bg-yellow-500 text-black',
    'Python':     'bg-blue-500 text-white',
    'HTML':       'bg-orange-500 text-white',
    'CSS':        'bg-pink-500 text-white',
    'SQL':        'bg-cyan-500 text-white',
    'PHP':        'bg-indigo-500 text-white',
}
// badgeColors : associe chaque langage à ses classes Tailwind de couleur

function getBadge(language) {
    return badgeColors[language] || 'bg-gray-500 text-white'
    // || : si le langage n'est pas dans la liste, retourne la couleur par défaut
}

// ============ CHARGER LES SNIPPETS ============
async function chargerSnippets() {
    try {
        const response = await fetch(`${API_URL}/snippets`)
        // fetch : envoie une requête GET à notre API

        const snippets = await response.json()
        // .json() : convertit la réponse en tableau JavaScript

        tousLesSnippets = snippets
        // Sauvegarde les snippets en mémoire pour y accéder au clic

        afficherSnippets(snippets)
        // Appelle la fonction d'affichage avec les données reçues

    } catch (erreur) {
        console.error('Erreur lors du chargement :', erreur)
    }
}

// ============ AFFICHER LES SNIPPETS DANS LA SIDEBAR ============
function afficherSnippets(snippets) {
    const liste = document.getElementById('liste-snippets')
    // getElementById : trouve l'élément HTML avec l'id "liste-snippets"

    if (snippets.length === 0) {
        liste.innerHTML = '<p class="text-gray-500 text-sm text-center mt-8">Aucun snippet pour l\'instant</p>'
        return
        // Si pas de snippets, affiche un message et arrête la fonction
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
    // .map() : transforme chaque snippet en bloc HTML
    // .join('') : colle tous les blocs en une seule chaîne
}

// ============ AFFICHER LE DETAIL D'UN SNIPPET ============
function afficherDetail(id) {
    const snippet = tousLesSnippets.find(s => s.id === id)
    // .find() : cherche dans le tableau le snippet dont l'id correspond

    if (!snippet) return
    // Si le snippet n'existe pas, arrête la fonction

    document.getElementById('detail-snippet').dataset.id = id
    // dataset.id : mémorise l'id du snippet affiché

    document.querySelector('#detail-snippet h2').textContent = snippet.title
    // Met à jour le titre dans la zone de détail

    document.querySelector('#detail-snippet pre').textContent = snippet.code
    // Met à jour le code dans la zone de détail

    const badge = document.getElementById('badge-langage')
    if (badge) {
        badge.textContent = snippet.language
        badge.className = `text-xs px-2 py-0.5 rounded-full font-medium ${getBadge(snippet.language)}`
        // Met à jour le badge de langage avec la bonne couleur
    }
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
    const id = document.getElementById('detail-snippet').dataset.id
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
            delete document.getElementById('detail-snippet').dataset.id
            // Efface l'id mémorisé après suppression

            document.querySelector('#detail-snippet h2').textContent = 'Titre du snippet'
            document.querySelector('#detail-snippet pre').textContent = '// Ton code apparaîtra ici'
            document.getElementById('badge-langage').textContent = 'Langage'
            document.getElementById('badge-langage').className = 'text-xs px-2 py-0.5 rounded-full font-medium bg-gray-700 text-white'
            // Remet la zone de détail à son état initial

            chargerSnippets()
            // Recharge la liste après suppression
        }
    } catch (erreur) {
        console.error('Erreur :', erreur)
    }
}

// ============ LANCEMENT AU CHARGEMENT DE LA PAGE ============
chargerSnippets()
// Lance le chargement des snippets dès que la page est prête
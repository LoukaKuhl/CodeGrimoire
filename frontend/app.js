const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://[url-vercel-a-definir-en-s5].vercel.app'

const badgeColors = {
    'JavaScript': 'bg-yellow-500 text-black',
    'Python':     'bg-blue-500 text-white',
    'HTML':       'bg-orange-500 text-white',
    'CSS':        'bg-pink-500 text-white',
    'SQL':        'bg-cyan-500 text-white',
    'PHP':        'bg-indigo-500 text-white',
    'Autre':      'bg-gray-500 text-white'
}

/**
 * Retourne les classes Tailwind du badge selon le langage.
 * @param {string} [language='Autre'] - Langage de programmation
 * @returns {string} Classes Tailwind du badge
 */
function getBadge(language = 'Autre') {
    return badgeColors[language] ?? badgeColors['Autre']
}

function echapperHtml(texte) {
    const div = document.createElement('div')
    div.textContent = texte
    return div.innerHTML
}

let tousLesSnippets = []

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

function afficherSnippets(snippets, messageVide = 'Aucun snippet pour l\'instant') {
    const liste = document.getElementById('liste-snippets')

    if (snippets.length === 0) {
        liste.innerHTML = `<p class="text-gray-500 text-sm text-center mt-8">${messageVide}</p>`
        return
    }

    liste.innerHTML = snippets.map(s => `
        <div
            data-id="${s.id}"
            class="bg-gray-800 rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-700 border border-transparent hover:border-purple-500 transition-all">
            <p class="text-white text-sm font-semibold mb-1">${echapperHtml(s.title)}</p>
            <span class="text-xs px-2 py-0.5 rounded-full font-medium ${getBadge(s.language)}">
                ${echapperHtml(s.language)}
            </span>
        </div>
    `).join('')
}

document.getElementById('liste-snippets').addEventListener('click', (e) => {
    const item = e.target.closest('[data-id]')
    if (item) afficherDetail(Number(item.dataset.id))
})

document.getElementById('input-recherche').addEventListener('input', (e) => {
    rechercherSnippets(e.target.value)
})

function afficherDetail(id) {
    const snippet = tousLesSnippets.find(s => s.id === id)
    if (!snippet) return

    document.getElementById('detail-snippet').dataset.id = id
    document.getElementById('detail-titre').textContent = snippet.title
    document.getElementById('detail-code').textContent = snippet.code

    const badge = document.getElementById('detail-badge')
    badge.textContent = snippet.language
    badge.className = `text-xs px-2 py-0.5 rounded-full font-medium ${getBadge(snippet.language)}`

    const tags = document.getElementById('detail-tags')
    tags.textContent = snippet.tags ? `Tags : ${snippet.tags}` : ''
}

async function copierSnippet() {
    const id = document.getElementById('detail-snippet').dataset.id

    if (!id) {
        alert('Sélectionne un snippet à copier !')
        return
    }

    const code = document.getElementById('detail-code').textContent

    try {
        await navigator.clipboard.writeText(code)

        const bouton = document.getElementById('btn-copier')
        bouton.textContent = 'Copié !'

        setTimeout(() => {
            bouton.textContent = 'Copier'
        }, 2000)
    } catch (erreur) {
        console.error('Erreur copie :', erreur)
    }
}

function modifierSnippet() {
    const id = document.getElementById('detail-snippet').dataset.id

    if (!id) {
        alert('Sélectionne un snippet à modifier !')
        return
    }

    window.location.href = `formulaire.html?id=${id}`
}

async function supprimerSnippet() {
    const conteneurDetail = document.getElementById('detail-snippet')
    const id = conteneurDetail.dataset.id

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
            delete conteneurDetail.dataset.id

            document.getElementById('detail-titre').textContent = 'Titre du snippet'
            document.getElementById('detail-code').textContent = '// Ton code apparaîtra ici'
            const badge = document.getElementById('detail-badge')
            badge.textContent = 'Langage'
            badge.className = 'text-xs px-2 py-0.5 rounded-full font-medium bg-gray-700 text-white'

            document.getElementById('detail-tags').textContent = ''

            await chargerSnippets()
        }
    } catch (erreur) {
        console.error('Erreur :', erreur)
    }
}

function rechercherSnippets(recherche) {
    const terme = recherche.toLowerCase().trim()

    if (terme === '') {
        afficherSnippets(tousLesSnippets)
        return
    }

    const resultats = tousLesSnippets.filter(s =>
        s.title.toLowerCase().includes(terme) ||
        s.language.toLowerCase().includes(terme) ||
        (s.tags && s.tags.toLowerCase().includes(terme))
    )

    afficherSnippets(resultats, 'Aucun résultat pour cette recherche')
}

window.onload = chargerSnippets

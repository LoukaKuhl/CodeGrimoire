// ============ URL DE L'API ============
const API_URL = 'http://localhost:3000'

// ============ SAUVEGARDER UN SNIPPET ============
async function sauvegarderSnippet() {

    // Récupère les valeurs des champs du formulaire
    const title = document.getElementById('input-titre').value
    const language = document.getElementById('input-langage').value
    const tags = document.getElementById('input-tags').value
    const code = document.getElementById('input-code').value
    // .value : lit le contenu d'un champ HTML

    // Vérifie que les champs obligatoires sont remplis
    if (!title || !language || !code) {
        alert('Merci de remplir le titre, le langage et le code !')
        return
        // return : arrête la fonction si un champ est vide
    }

    try {
        const response = await fetch(`${API_URL}/snippets`, {
            method: 'POST',
            // method : indique qu'on envoie des données (POST)
            headers: {
                'Content-Type': 'application/json'
                // Content-Type : dit au serveur qu'on envoie du JSON
            },
            body: JSON.stringify({ title, language, tags, code })
            // JSON.stringify : convertit l'objet JavaScript en texte JSON
        })

        if (response.ok) {
            // response.ok : true si le serveur a répondu 200 ou 201
            alert('Snippet sauvegardé !')
            window.location.href = 'index.html'
            // window.location.href : redirige vers la page principale
        } else {
            alert('Erreur lors de la sauvegarde')
        }

    } catch (erreur) {
        console.error('Erreur :', erreur)
        alert('Impossible de contacter le serveur')
    }
}
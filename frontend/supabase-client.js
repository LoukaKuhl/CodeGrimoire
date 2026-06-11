// Initialisation du client Supabase du frontend.
// La librairie supabase-js est chargée via CDN et expose un global "supabase" ;
// on nomme donc notre client "clientSupabase" pour éviter le conflit de nom.
const urlSupabase = 'https://jktrgelumkcwrjfakyhz.supabase.co'
const clePublishable = 'sb_publishable_9RoNHRKwrqpDeFCw54nDhg_Cl1XdpCX'

// Adaptateur de stockage : selon le choix "Se souvenir de moi", la session est
// conservée dans localStorage (persistante) ou sessionStorage (effacée à la fermeture).
const stockageSession = {
    getItem(cle) {
        return sessionStorage.getItem(cle) ?? localStorage.getItem(cle)
    },
    setItem(cle, valeur) {
        if (localStorage.getItem('seSouvenir') === 'true') {
            localStorage.setItem(cle, valeur)
        } else {
            sessionStorage.setItem(cle, valeur)
        }
    },
    removeItem(cle) {
        localStorage.removeItem(cle)
        sessionStorage.removeItem(cle)
    },
}

const clientSupabase = supabase.createClient(urlSupabase, clePublishable, {
    auth: { storage: stockageSession },
})

/**
 * Construit les en-têtes d'un appel à l'API protégée avec le token de la session courante.
 * @returns {Promise<Object>} En-têtes incluant Content-Type et Authorization
 */
async function enTetesAuth() {
    const { data } = await clientSupabase.auth.getSession()
    const token = data.session.access_token
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

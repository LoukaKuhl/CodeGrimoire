// Garde de session : protège la page et gère la déconnexion.
(async () => {
    const { data } = await clientSupabase.auth.getSession()
    if (!data.session) {
        window.location.href = 'connexion.html'
    }
})()

const boutonDeconnexion = document.getElementById('bouton-deconnexion')

if (boutonDeconnexion) {
    boutonDeconnexion.addEventListener('click', async () => {
        await clientSupabase.auth.signOut()
        window.location.href = 'connexion.html'
    })
}

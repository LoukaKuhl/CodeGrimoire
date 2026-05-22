// Importation des modules nécessaires
const express = require('express')
// express : framework pour créer le serveur web

const cors = require('cors')
// cors : permet au frontend de communiquer avec le backend

require('dotenv').config()
// dotenv : charge les variables du fichier .env

// Création du serveur
const app = express()
// app : notre serveur Express

// Configuration du serveur
app.use(cors())
// Autorise les requêtes venant du frontend

app.use(express.json())
// Permet de lire les données JSON envoyées par le frontend

// Port d'écoute
const PORT = process.env.PORT || 3000
// PORT : utilise la variable d'environnement ou 3000 par défaut

// Route de test
app.get('/', (req, res) => {
    // Route GET sur / : répond quand on visite la page d'accueil
    res.json({ message: 'Bienvenue sur le serveur CodeGrimoire !' })
})

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`)
})
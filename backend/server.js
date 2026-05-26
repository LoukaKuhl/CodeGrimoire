// ============ IMPORTS ============
const express = require('express')
// express : framework pour créer le serveur web

const cors = require('cors')
// cors : permet au frontend de communiquer avec le backend

require('dotenv').config()
// dotenv : charge les variables du fichier .env

// ============ CRÉATION DU SERVEUR ============
const app = express()
// app : notre serveur Express

// ============ CONFIGURATION ============
app.use(cors())
// Autorise les requêtes venant du frontend

app.use(express.json())
// Permet de lire les données JSON envoyées par le frontend

// ============ ROUTES ============
const snippetsRouter = require('./routes/snippets')
// Importe le fichier de routes snippets

app.use('/snippets', snippetsRouter)
// Utilise les routes snippets sur /snippets

// ============ ROUTE DE TEST ============
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur le serveur CodeGrimoire !' })
})

// ============ DÉMARRAGE ============
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`)
})
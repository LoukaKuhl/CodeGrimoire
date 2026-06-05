import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import snippetsRouter from './routes/snippets'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/snippets', snippetsRouter)

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Bienvenue sur le serveur CodeGrimoire !' })
})

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`)
})

const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const cors = require('cors')
const authRoutes = require('./src/routes/authRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)


app.get('/', (req, res) => {
    res.json({ mensagem:'Olá Mundo! Servidor funcionando.'})
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})
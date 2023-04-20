require('dotenv').config()
let cors = require('cors')
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose.connect(process.env.CONNECTION_STRING)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Conectado a la base de datos'))

app.use(express.json())

// Habilita CORS solo para la ruta /api/login/userlogin
app.use('/api/login/userlogin', cors());

const loginRouter = require('./routes/login')
app.use('/api/login', loginRouter)

app.get('/', (req, res) => {
    res.end('Bienvenido')
})

app.listen(port, () => console.log('Servidor iniciado en el puerto', port))
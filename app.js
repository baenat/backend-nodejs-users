const express = require('express')
const cors = require('cors');
const dotenv = require('dotenv')
const PORT = 3000;

const app = express();

// procesar datos enviados
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Configuración de CORS
app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

// variables de entorno
dotenv.config({ path: './env/.env' })

// llamar router
app.use('/', require('./routes/router'))

app.listen(PORT, () => {
  console.log(`SERVER UP running in http://localhost:${PORT}`)
})
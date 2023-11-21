const mysql = require('mysql')

const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
})

conexion.connect((err) => {
    if (err) {
        console.log(`El error de conexion es: ${err}`)
        return
    }
    console.log(`¡Conectado a la base de datos de datos MySQL!`)
})

module.exports = conexion
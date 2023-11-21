const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')

const revokedTokens = new Set();

exports.register = async (request, response) => {

    const user = {
        email: request.body.email,
        password: bcryptjs.hashSync(request.body.password, 8)
    };

    conexion.query('INSERT INTO users SET ?', { email: user.email, password: user.password }, (error) => {
        if (error) response.status(400).json({ message: error.message });
        response.status(201).json({ message: 'Usuaio registrado exitosamente' });
    });

}

exports.login = async (request, response) => {

    const user = {
        email: request.body.email,
        password: request.body.password
    };

    if (!user.email || !user.password) {
        response.status(400).json({ message: 'El email y la contraseña son requeridos' })
    } else {

        conexion.query('SELECT * FROM users WHERE email = ?', [user.email], async (request, results) => {
            if (!results.length || !(await bcryptjs.compare(user.password, results[0].password))) {
                response.status(401).json({ message: 'Credenciales incorrectas' })
            } else {

                // Genera un token JWT
                const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET);
                response.status(200).json({ token: token })
            }
        })

    }

}

exports.logout = async (request, response) => {

    const headers = { ...request.headers }
    const token = headers.authorization.split(' ')[1];

    revokedTokens.add(token);

    response.status(200).json({ message: 'Token revokado' });
}

exports.authMiddleware = (request, response, next) => {
    
    const headers = { ...request.headers }
    
    // Verificamos si el objeto req.headers es nulo o indefinido
    if (!headers) response.status(400).json({ message: 'No se encontraron encabezados en la solicitud' });

    // Verificamos si el encabezado de autorización existe
    if (!headers.hasOwnProperty('authorization')) response.status(401).json({ message: 'No Authorization' });

    try {

        // Obtenemos el token del encabezado de autorización
        const token = headers.authorization.split(' ')[1];

        // Verifica si el token esta revocado
        if (revokedTokens.has(token)) response.status(200).json({ message: 'Token revoked' });

        try {

            // Verificacion del token
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            // Obtenemos el identificador del usuario
            const id = payload.id;

            // Verificamos si el identificador del usuario coincide con el identificador del usuario que está almacenado en la base de datos
            conexion.query('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
                if (error) {
                    response.status(500).json({ message: error });
                } else if (results.length === 0) {
                    response.status(401).json({ message: 'No autorizado' });
                } else {
                    request.user = results[0];
                    next();
                }
            });

        } catch (error) {
            response.status(401).json({ message: 'El token JWT ha expirado' });
        }

    } catch (error) {
        console.log('error -> ', error)
        // Si el token no es válido, devolvemos un error
        response.status(401).json({ message: 'No autorizado' });
    }
}

exports.revokedToken = (request, response, next) => {

    const headers = { ...request.headers }
    const token = headers.authorization.split(' ')[1];

    if (revokedTokens.has(token)) {
        response.status(200).json({ message: 'Token inválido' });
    }

    next();

}
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')

// Obtenemos todos los usuarios
exports.getUsers = (request, response) => {

    // Obtener el id del usuario en sesion
    const id = request.user.id

    conexion.query('SELECT * FROM users WHERE id <> ?', [id], (error, results) => {
        if (error) {
            response.status(500).json({ message: error });
        } else {
            response.status(200).json({ users: results });
        }
    });

};

// Creamos un nuevo usuario
exports.createUser = (request, response) => {

    const user = {
        email: request.body.email,
        password: bcryptjs.hashSync(request.body.password, 8)
    };

    conexion.query('INSERT INTO users SET ?', user, (error, results) => {
        if (error) {
            response.status(500).json({ message: error });
        } else {
            response.status(201).json({ message: 'Usuario creado exitosamente' });
        }
    });

};

// Actualizamos un usuario existente
exports.updateUser = (request, response) => {

    const user = {
        email: request.body.email,
        password: bcryptjs.hashSync(request.body.password, 8)
    };

    conexion.query('UPDATE users SET ? WHERE id = ?', [user, request.params.id], (error, results) => {
        if (error) {
            response.status(500).json({ message: error });
        } else if (results.affectedRows === 0) {
            response.status(404).json({ message: 'Usuario no encontrado' });
        } else {
            response.status(200).json({ message: 'Usuario actualizado exitosamente' });
        }
    });

};

// Eliminamos un usuario
exports.deleteUser = (request, response) => {
    
    conexion.query('DELETE FROM users WHERE id = ?', [request.params.id], (error, results) => {
        if (error) {
            response.status(500).json({ message: error });
        } else if (results.affectedRows === 0) {
            response.status(404).json({ message: 'Usuario no encontrado' });
        } else {
            response.status(200).json({ message: 'Usuario eliminado exitosamente' });
        }
    });

};
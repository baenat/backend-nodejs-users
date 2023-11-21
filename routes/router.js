const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const userCointroller = require('../controllers/userCointroller')

// auth
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authController.revokedToken, authController.logout)

// user
router.get('/users', authController.authMiddleware, userCointroller.getUsers)
router.post('/users', authController.authMiddleware, userCointroller.createUser)
router.put('/users/:id', authController.authMiddleware, userCointroller.updateUser)
router.delete('/users/:id', authController.authMiddleware, userCointroller.deleteUser)

module.exports = router
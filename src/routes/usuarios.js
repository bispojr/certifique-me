const express = require('express')
const router = express.Router()
const usuarioController = require('../controllers/usuarioController')
const auth = require('../../middleware/auth')


const validate = require('../../middleware/validate')
const usuarioSchema = require('../validators/usuario')

router.post('/login', usuarioController.login)
router.post('/logout', usuarioController.logout)
router.get('/me', auth, usuarioController.me)
router.post('/', validate(usuarioSchema), usuarioController.create)

module.exports = router

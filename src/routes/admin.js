const express = require('express')
const router = express.Router()
const authSSR = require('../middlewares/authSSR')
const rbac = require('../middlewares/rbac')
const eventoSSRController = require('../controllers/eventoSSRController')

// Todas as rotas admin exigem sessão SSR válida
router.use(authSSR)

// Dashboard admin
router.get('/dashboard', (req, res) => {
  if (!req.usuario) {
    return res.redirect('/auth/login')
  }
  res.render('admin/dashboard', {
    layout: 'layouts/admin',
    title: 'Dashboard',
    usuario: req.usuario,
  })
})

// Gestão de eventos (somente admin)
router.get('/eventos', rbac('admin'), eventoSSRController.index)
router.get('/eventos/novo', rbac('admin'), eventoSSRController.novo)
router.get('/eventos/:id/editar', rbac('admin'), eventoSSRController.editar)
router.post('/eventos', rbac('admin'), eventoSSRController.criar)
router.post('/eventos/:id', rbac('admin'), eventoSSRController.atualizar)
router.post('/eventos/:id/deletar', rbac('admin'), eventoSSRController.deletar)
router.post(
  '/eventos/:id/restaurar',
  rbac('admin'),
  eventoSSRController.restaurar,
)

module.exports = router

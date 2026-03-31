const express = require('express')
const router = express.Router()
const authSSR = require('../middlewares/authSSR')
const rbac = require('../middlewares/rbac')
const eventoSSRController = require('../controllers/eventoSSRController')
const participanteSSRController = require('../controllers/participanteSSRController')

const dashboardController = require('../controllers/dashboardController')

// Todas as rotas admin exigem sessão SSR válida
router.use(authSSR)

// Dashboard
router.get('/dashboard', dashboardController.dashboard)

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

// Gestão de participantes (todos os perfis autenticados)
router.get('/participantes', participanteSSRController.index)
router.get('/participantes/novo', participanteSSRController.novo)
router.get('/participantes/:id/editar', participanteSSRController.editar)
router.post('/participantes', participanteSSRController.criar)
router.post('/participantes/:id', participanteSSRController.atualizar)
router.post('/participantes/:id/deletar', participanteSSRController.deletar)
router.post('/participantes/:id/restaurar', participanteSSRController.restaurar)

module.exports = router

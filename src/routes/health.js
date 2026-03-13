const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/health', async (req, res) => {
  try {
    await db.sequelize.authenticate()
    res.json({ status: 'ok', db: 'connected', uptime: Math.floor(process.uptime()) })
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' })
  }
})

module.exports = router

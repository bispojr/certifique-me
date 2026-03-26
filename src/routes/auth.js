const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Usuario } = require('../models')
const authSSR = require('../middlewares/authSSR')

const JWT_SECRET = process.env.JWT_SECRET

// GET /auth/login
router.get('/login', authSSR, (req, res) => {
  if (req.usuario) return res.redirect('/admin/dashboard')
  res.render('auth/login', { title: 'Login', layout: 'layout' })
})

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body
    const usuario = await Usuario.findOne({ where: { email } })
    if (!usuario) {
      req.flash('error', 'Credenciais inválidas')
      return res.redirect('/auth/login')
    }
    const valid = await bcrypt.compare(senha, usuario.senha)
    if (!valid) {
      req.flash('error', 'Credenciais inválidas')
      return res.redirect('/auth/login')
    }
    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      JWT_SECRET,
      { expiresIn: '1h' },
    )
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' })
    return res.redirect('/admin/dashboard')
  } catch {
    req.flash('error', 'Erro interno. Tente novamente.')
    return res.redirect('/auth/login')
  }
})

// POST /auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token')
  return res.redirect('/auth/login')
})

module.exports = router

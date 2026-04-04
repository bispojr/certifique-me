const jwt = require('jsonwebtoken')
const { Usuario } = require('../models')

module.exports = async function authSSR(req, res, next) {
  const token = req.cookies?.token
  if (!token) {
    req.usuario = null
    res.locals.usuario = null
    // Se for rota SSR (admin), redireciona para login
    if (req.originalUrl.startsWith('/admin')) {
      return res.redirect('/auth/login')
    }
    return next()
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const usuario = await Usuario.findByPk(decoded.id)
    if (!usuario) {
      req.usuario = null
      res.locals.usuario = null
      if (req.originalUrl.startsWith('/admin')) {
        return res.redirect('/auth/login')
      }
      return next()
    }
    const usuarioData = {
      id: usuario.id,
      nome: usuario.nome,
      perfil: usuario.perfil,
      isAdmin: usuario.perfil === 'admin',
      isGestor: usuario.perfil === 'gestor',
    }
    req.usuario = usuarioData
    res.locals.usuario = usuarioData
    next()
  } catch {
    req.usuario = null
    res.locals.usuario = null
    if (req.originalUrl.startsWith('/admin')) {
      return res.redirect('/auth/login')
    }
    return next()
  }
}

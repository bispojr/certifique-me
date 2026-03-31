const participanteService = require('../services/participanteService')
const { Participante, Certificado, Usuario } = require('../models')
const { Op } = require('sequelize')

module.exports = {
  async index(req, res) {
    try {
      const { q } = req.query
      const textWhere = q
        ? {
            [Op.or]: [
              { nomeCompleto: { [Op.iLike]: `%${q}%` } },
              { email: { [Op.iLike]: `%${q}%` } },
            ],
          }
        : {}

      // Filtra por eventos vinculados ao usuário (exceto admin)
      let eventoIds = null
      if (req.usuario && req.usuario.perfil !== 'admin') {
        const usuarioComEventos = await Usuario.findByPk(req.usuario.id, {
          include: 'eventos',
        })
        eventoIds = (usuarioComEventos?.eventos || []).map((e) => e.id)
      }

      const certWhere = eventoIds ? { evento_id: { [Op.in]: eventoIds } } : {}

      const participantes = await Participante.findAll({
        where: textWhere,
        include: [
          {
            model: Certificado,
            as: 'certificados',
            where: eventoIds ? certWhere : undefined,
            required: eventoIds ? true : false,
          },
        ],
      })
      const arquivados = await Participante.findAll({
        paranoid: false,
        where: { deleted_at: { [Op.ne]: null } },
        include: eventoIds
          ? [
              {
                model: Certificado,
                as: 'certificados',
                where: certWhere,
                required: true,
              },
            ]
          : [],
      })

      return res.render('admin/participantes/index', {
        layout: 'layouts/admin',
        title: 'Participantes',
        participantes: participantes.map((p) => ({
          ...p.toJSON(),
          numCertificados: p.certificados ? p.certificados.length : 0,
        })),
        arquivados: arquivados.map((p) => p.toJSON()),
        q: q || '',
      })
    } catch (err) {
      req.flash('error', err.message)
      return res.redirect('/admin/dashboard')
    }
  },

  novo(req, res) {
    return res.render('admin/participantes/form', {
      layout: 'layouts/admin',
      title: 'Novo Participante',
      action: '/admin/participantes',
    })
  },

  async editar(req, res) {
    try {
      const participante = await participanteService.findById(req.params.id)
      if (!participante) {
        req.flash('error', 'Participante não encontrado.')
        return res.redirect('/admin/participantes')
      }
      return res.render('admin/participantes/form', {
        layout: 'layouts/admin',
        title: 'Editar Participante',
        action: `/admin/participantes/${req.params.id}`,
        participante: participante.toJSON(),
      })
    } catch (err) {
      req.flash('error', err.message)
      return res.redirect('/admin/participantes')
    }
  },

  async criar(req, res) {
    try {
      await participanteService.create(req.body)
      req.flash('success', 'Participante criado com sucesso.')
      return res.redirect('/admin/participantes')
    } catch (err) {
      req.flash('error', err.message)
      return res.render('admin/participantes/form', {
        layout: 'layouts/admin',
        title: 'Novo Participante',
        action: '/admin/participantes',
        participante: req.body,
      })
    }
  },

  async atualizar(req, res) {
    try {
      await participanteService.update(req.params.id, req.body)
      req.flash('success', 'Participante atualizado com sucesso.')
      return res.redirect('/admin/participantes')
    } catch (err) {
      req.flash('error', err.message)
      return res.redirect(`/admin/participantes/${req.params.id}/editar`)
    }
  },

  async deletar(req, res) {
    try {
      await participanteService.delete(req.params.id)
      req.flash('success', 'Participante removido.')
      return res.redirect('/admin/participantes')
    } catch (err) {
      req.flash('error', err.message)
      return res.redirect('/admin/participantes')
    }
  },

  async restaurar(req, res) {
    try {
      await participanteService.restore(req.params.id)
      req.flash('success', 'Participante restaurado com sucesso.')
      return res.redirect('/admin/participantes')
    } catch (err) {
      req.flash('error', err.message)
      return res.redirect('/admin/participantes')
    }
  },
}

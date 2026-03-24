'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    // Tenta criar cada índice, ignora erro se já existir
    const tryAddIndex = async (table, fields, options) => {
      try {
        await queryInterface.addIndex(table, fields, options)
      } catch (err) {
        if (
          !/already exists|duplicate|relation .* already exists/i.test(
            err.message,
          )
        ) {
          throw err
        }
      }
    }
    await tryAddIndex('certificados', ['evento_id'], {
      name: 'idx_certificados_evento_id',
    })
    await tryAddIndex('certificados', ['participante_id'], {
      name: 'idx_certificados_participante_id',
    })
    await tryAddIndex('certificados', ['status'], {
      name: 'idx_certificados_status',
    })
    await tryAddIndex('participantes', ['email'], {
      name: 'idx_participantes_email',
    })
    await tryAddIndex('usuarios', ['email'], {
      name: 'idx_usuarios_email',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('usuarios', 'idx_usuarios_email')
    await queryInterface.removeIndex('participantes', 'idx_participantes_email')
    await queryInterface.removeIndex('certificados', 'idx_certificados_status')
    await queryInterface.removeIndex(
      'certificados',
      'idx_certificados_participante_id',
    )
    await queryInterface.removeIndex(
      'certificados',
      'idx_certificados_evento_id',
    )
  },
}

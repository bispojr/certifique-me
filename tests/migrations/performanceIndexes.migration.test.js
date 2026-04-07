const { sequelize } = require('../../src/models')
const migrationIndexes = require('../../migrations/20260324083059-create-performance-indexes.js')
const migrationCertificados = require('../../migrations/20260311180841-create-certificados.js')
const migrationParticipantes = require('../../migrations/20260311180742-create-participantes.js')
const migrationEventos = require('../../migrations/20260311175950-create-eventos.js')
const migrationTipos = require('../../migrations/20260311180308-create-tipos-certificados.js')
const migrationUsuarios = require('../../migrations/20260312180000-create-usuarios.js')

const EXPECTED_INDEXES = [
  'idx_certificados_evento_id',
  'idx_certificados_participante_id',
  'idx_certificados_status',
  'idx_participantes_email',
  'idx_usuarios_email',
]

describe('Migration: performance indexes', () => {
  const queryInterface = sequelize.getQueryInterface()

  beforeEach(async () => {
    await sequelize.query('DROP SCHEMA IF EXISTS public CASCADE;')
    await sequelize.query('CREATE SCHEMA public;')
    await migrationParticipantes.up(queryInterface, sequelize.constructor)
    await migrationEventos.up(queryInterface, sequelize.constructor)
    await migrationTipos.up(queryInterface, sequelize.constructor)
    await migrationCertificados.up(queryInterface, sequelize.constructor)
    await migrationUsuarios.up(queryInterface, sequelize.constructor)
  })

  test('up adiciona os 5 índices de performance', async () => {
    await migrationIndexes.up(queryInterface, sequelize.constructor)

    const certIndexes = await queryInterface.showIndex('certificados')
    const certNames = certIndexes.map((i) => i.name)
    expect(certNames).toContain('idx_certificados_evento_id')
    expect(certNames).toContain('idx_certificados_participante_id')
    expect(certNames).toContain('idx_certificados_status')

    const partIndexes = await queryInterface.showIndex('participantes')
    const partNames = partIndexes.map((i) => i.name)
    expect(partNames).toContain('idx_participantes_email')

    const userIndexes = await queryInterface.showIndex('usuarios')
    const userNames = userIndexes.map((i) => i.name)
    expect(userNames).toContain('idx_usuarios_email')
  })

  test('down remove todos os 5 índices', async () => {
    await migrationIndexes.up(queryInterface, sequelize.constructor)
    await migrationIndexes.down(queryInterface, sequelize.constructor)

    const certIndexes = await queryInterface.showIndex('certificados')
    const certNames = certIndexes.map((i) => i.name)
    expect(certNames).not.toContain('idx_certificados_evento_id')
    expect(certNames).not.toContain('idx_certificados_participante_id')
    expect(certNames).not.toContain('idx_certificados_status')

    const partIndexes = await queryInterface.showIndex('participantes')
    expect(partIndexes.map((i) => i.name)).not.toContain(
      'idx_participantes_email',
    )

    const userIndexes = await queryInterface.showIndex('usuarios')
    expect(userIndexes.map((i) => i.name)).not.toContain('idx_usuarios_email')
  })
})

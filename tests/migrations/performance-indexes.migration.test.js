const { sequelize } = require('../../src/models')
const migration = require('../../migrations/20260324083059-create-performance-indexes.js')
const migrationCertificados = require('../../migrations/20260311180841-create-certificados.js')
const migrationParticipantes = require('../../migrations/20260311180742-create-participantes.js')
const migrationUsuarios = require('../../migrations/20260312180000-create-usuarios.js')
const migrationEventos = require('../../migrations/20260311175950-create-eventos.js')

// Testa a migration de índices de performance

describe('Migration: performance indexes', () => {
  const queryInterface = sequelize.getQueryInterface()

  beforeEach(async () => {
    // As tabelas já são criadas pelo setup global dos testes
    // Se necessário, pode-se limpar dados aqui
  })

  test('up cria os índices de performance', async () => {
    await migration.up(queryInterface, sequelize.constructor)
    // Verifica índices criados
    const indexesCertificados = await queryInterface.showIndex('certificados')
    const indexesParticipantes = await queryInterface.showIndex('participantes')
    const indexesUsuarios = await queryInterface.showIndex('usuarios')

    expect(
      indexesCertificados.some((i) => i.name === 'idx_certificados_evento_id'),
    ).toBe(true)
    expect(
      indexesCertificados.some(
        (i) => i.name === 'idx_certificados_participante_id',
      ),
    ).toBe(true)
    expect(
      indexesCertificados.some((i) => i.name === 'idx_certificados_status'),
    ).toBe(true)
    expect(
      indexesParticipantes.some((i) => i.name === 'idx_participantes_email'),
    ).toBe(true)
    expect(indexesUsuarios.some((i) => i.name === 'idx_usuarios_email')).toBe(
      true,
    )
  })

  test('down remove os índices de performance', async () => {
    await migration.up(queryInterface, sequelize.constructor)
    await migration.down(queryInterface, sequelize.constructor)
    const indexesCertificados = await queryInterface.showIndex('certificados')
    const indexesParticipantes = await queryInterface.showIndex('participantes')
    const indexesUsuarios = await queryInterface.showIndex('usuarios')

    expect(
      indexesCertificados.some((i) => i.name === 'idx_certificados_evento_id'),
    ).toBe(false)
    expect(
      indexesCertificados.some(
        (i) => i.name === 'idx_certificados_participante_id',
      ),
    ).toBe(false)
    expect(
      indexesCertificados.some((i) => i.name === 'idx_certificados_status'),
    ).toBe(false)
    expect(
      indexesParticipantes.some((i) => i.name === 'idx_participantes_email'),
    ).toBe(false)
    expect(indexesUsuarios.some((i) => i.name === 'idx_usuarios_email')).toBe(
      false,
    )
  })
})

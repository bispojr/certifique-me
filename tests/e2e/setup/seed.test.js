const { seedE2E, cleanE2E } = require('./seed')
const { sequelize } = require('../../../src/models')

describe('E2E Seed', () => {
  beforeAll(async () => {
    await cleanE2E()
  })

  afterAll(async () => {
    await cleanE2E()
    await sequelize.close()
  })

  it('seedE2E retorna todos os registros e tokens válidos', async () => {
    const result = await seedE2E()
    expect(result).toHaveProperty('admin')
    expect(result).toHaveProperty('gestor')
    expect(result).toHaveProperty('monitor')
    expect(result).toHaveProperty('evento')
    expect(result).toHaveProperty('tipo')
    expect(result).toHaveProperty('participante')
    expect(result).toHaveProperty('certificado')
    expect(result).toHaveProperty('adminToken')
    expect(result).toHaveProperty('gestorToken')
    expect(result.certificado.codigo).toBe('E2E-2026-001')
    expect(typeof result.adminToken).toBe('string')
    expect(typeof result.gestorToken).toBe('string')
  })

  it('cleanE2E remove todos os dados sem erros', async () => {
    await expect(cleanE2E()).resolves.not.toThrow()
    // Após cleanE2E, não deve haver usuários, eventos, etc.
    const {
      Usuario,
      Evento,
      TiposCertificados,
      Participante,
      Certificado,
    } = require('../../../src/models')
    const usuarios = await Usuario.findAll()
    const eventos = await Evento.findAll()
    const tipos = await TiposCertificados.findAll()
    const participantes = await Participante.findAll()
    const certificados = await Certificado.findAll()
    expect(usuarios.length).toBe(0)
    expect(eventos.length).toBe(0)
    expect(tipos.length).toBe(0)
    expect(participantes.length).toBe(0)
    expect(certificados.length).toBe(0)
  })
})

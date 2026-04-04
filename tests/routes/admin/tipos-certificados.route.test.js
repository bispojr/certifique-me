const request = require('supertest')
const app = require('../../../app')
const { Usuario, TiposCertificados, sequelize } = require('../../../src/models')
const jwt = require('jsonwebtoken')

process.env.JWT_SECRET = 'jwt_secret_teste'
const JWT_SECRET = process.env.JWT_SECRET

describe('Rotas SSR /admin/tipos-certificados', () => {
  let agent
  let gestorToken
  let adminToken
  beforeAll(async () => {
    await sequelize.sync({ force: true })
    agent = request.agent(app)
    // Usuário admin
    const admin = await Usuario.create({
      nome: 'Admin',
      email: 'admin@admin.com',
      senha: 'senha123',
      perfil: 'admin',
    })
    // Usuário gestor
    const gestor = await Usuario.create({
      nome: 'Gestor',
      email: 'gestor@gestor.com',
      senha: 'senha123',
      perfil: 'gestor',
    })
    adminToken = jwt.sign({ id: admin.id }, JWT_SECRET)
    gestorToken = jwt.sign({ id: gestor.id }, JWT_SECRET)
  })

  it('GET /admin/tipos-certificados exige autenticação SSR', async () => {
    const res = await agent.get('/admin/tipos-certificados')
    expect(res.status).toBe(302)
    expect(res.headers.location).toBe('/auth/login')
  })

  it('GET /admin/tipos-certificados exige rbac gestor/admin', async () => {
    // Simula login como admin
    const res = await agent
      .get('/admin/tipos-certificados')
      .set('Cookie', `token=${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.text).toMatch(/Tipos de Certificados/)
  })

  it('GET /admin/tipos-certificados/novo não é capturado como :id/editar', async () => {
    const res = await agent
      .get('/admin/tipos-certificados/novo')
      .set('Cookie', `token=${gestorToken}`)
    expect(res.status).toBe(200)
    expect(res.text).toMatch(/Novo Tipo de Certificado/)
  })

  it('POST /admin/tipos-certificados/:id/deletar funciona', async () => {
    // Cria tipo
    const tipo = await TiposCertificados.create({
      codigo: 'XX',
      descricao: 'Teste',
      campo_destaque: 'nome',
      texto_base: 'base',
      dados_dinamicos: {},
    })
    const res = await agent
      .post(`/admin/tipos-certificados/${tipo.id}/deletar`)
      .set('Cookie', `token=${adminToken}`)
    expect(res.status).toBe(302)
    expect(res.headers.location).toBe('/admin/tipos-certificados')
  })

  it('POST /admin/tipos-certificados/:id/restaurar funciona', async () => {
    // Cria tipo deletado
    const tipo = await TiposCertificados.create({
      codigo: 'YY',
      descricao: 'Teste2',
      campo_destaque: 'nome',
      texto_base: 'base',
      dados_dinamicos: {},
      deleted_at: new Date(),
    })
    const res = await agent
      .post(`/admin/tipos-certificados/${tipo.id}/restaurar`)
      .set('Cookie', `token=${gestorToken}`)
    expect(res.status).toBe(302)
    expect(res.headers.location).toBe('/admin/tipos-certificados')
  })

  it('NENHUMA rota de eventos é alterada', async () => {
    const res = await agent
      .get('/admin/eventos')
      .set('Cookie', `token=${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.text).toMatch(/Eventos/)
  })
})

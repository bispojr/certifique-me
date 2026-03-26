const request = require('supertest')
const app = require('../../app')
const { Usuario, sequelize } = require('../../src/models')
const jwt = require('jsonwebtoken')

process.env.JWT_SECRET = 'jwt_secret_teste'
const JWT_SECRET = process.env.JWT_SECRET

describe('Admin dashboard SSR', () => {
  let agent
  beforeAll(async () => {
    await sequelize.sync({ force: true })
    agent = request.agent(app)
    await Usuario.create({
      nome: 'Admin',
      email: 'admin@admin.com',
      senha: 'senha123',
      perfil: 'admin',
    })
  })

  it('redireciona para /auth/login se não autenticado', async () => {
    const res = await agent.get('/admin/dashboard')
    // Espera redirecionamento (302) para /auth/login
    expect(res.status).toBe(302)
    expect(res.headers.location).toBe('/auth/login')
  })

  it('permite acesso autenticado ao dashboard', async () => {
    // Cria usuário admin
    const usuario = await Usuario.findOne({
      where: { email: 'admin@admin.com' },
    })
    // Gera token JWT
    const token = jwt.sign({ id: usuario.id }, JWT_SECRET)
    // Faz requisição autenticada com cookie
    const res = await agent
      .get('/admin/dashboard')
      .set('Cookie', `token=${token}`)
    expect(res.status).toBe(200)
    expect(res.text).toMatch(/Dashboard/i)
  })
})

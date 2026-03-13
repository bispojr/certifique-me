const request = require('supertest')
const app = require('../../app')
const db = require('../../src/models')

describe('GET /health', () => {
  it('deve retornar status ok e db conectado', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('status', 'ok')
    expect(res.body).toHaveProperty('db', 'connected')
    expect(typeof res.body.uptime).toBe('number')
  })

  it('deve retornar 503 se o banco estiver indisponível', async () => {
    // Simula indisponibilidade do banco
    const originalAuthenticate = db.sequelize.authenticate
    db.sequelize.authenticate = () => Promise.reject(new Error('DB down'))

    const res = await request(app).get('/health')
    expect(res.status).toBe(503)
    expect(res.body).toEqual({ status: 'error', db: 'disconnected' })

    // Restaura função original
    db.sequelize.authenticate = originalAuthenticate
  })
})

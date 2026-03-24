const express = require('express')
const request = require('supertest')
const { z } = require('zod')
const validate = require('../../src/middlewares/validate')

describe('Middleware validate', () => {
  let app
  beforeAll(() => {
    app = express()
    app.use(express.json())
    // Rota de teste usando o middleware validate
    app.post(
      '/teste',
      validate(z.object({ nome: z.string().min(3) })),
      (req, res) => {
        res.json({ nome: req.body.nome })
      },
    )
  })

  it('deve permitir requisição válida', async () => {
    const res = await request(app).post('/teste').send({ nome: 'João' })
    expect(res.status).toBe(200)
    expect(res.body.nome).toBe('João')
  })

  it('deve bloquear requisição inválida', async () => {
    const res = await request(app).post('/teste').send({ nome: 'A' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Erro de validação')
    expect(res.body.detalhes).toBeInstanceOf(Array)
  })
})

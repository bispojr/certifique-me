const request = require('supertest')
const app = require('../../app')

describe('Página de erro customizada', () => {
  it('exibe página de erro 404 estilizada com Bootstrap', async () => {
    const res = await request(app).get('/rota-inexistente-para-teste')
    expect(res.status).toBe(404)
    expect(res.text).toMatch(/class=['"]text-center mt-5['"]?/)
    expect(res.text).toMatch(/class=['"]display-1['"]?/)
    expect(res.text).toMatch(/404/)
    expect(res.text).toMatch(/Voltar ao início/)
    expect(res.text).toMatch(/btn btn-primary/)
  })
})

const request = require('supertest');
const app = require('../../app');

describe('Rotas de Certificados', () => {
  it('deve retornar 400 ao emitir certificado com payload inválido', async () => {
    const res = await request(app)
      .post('/certificados')
      .send({ participanteId: null });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('deve retornar 404 ao buscar certificado inexistente', async () => {
    const res = await request(app)
      .get('/certificados/99999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

const request = require('supertest');
const app = require('../../app');

describe('Rotas de Participantes', () => {
  it('deve retornar 400 ao criar participante com payload inválido', async () => {
    const res = await request(app)
      .post('/participantes')
      .send({ nome: '' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('deve retornar 404 ao buscar participante inexistente', async () => {
    const res = await request(app)
      .get('/participantes/99999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

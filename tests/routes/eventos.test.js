const request = require('supertest');
const app = require('../../app');

describe('Rotas de Eventos', () => {
  it('deve retornar 400 ao criar evento com payload inválido', async () => {
    const res = await request(app)
      .post('/eventos')
      .send({ nome: '' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('deve retornar 404 ao buscar evento inexistente', async () => {
    const res = await request(app)
      .get('/eventos/99999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

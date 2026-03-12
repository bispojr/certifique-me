const request = require('supertest');
const app = require('../../app');

describe('Rotas de TiposCertificados', () => {
  it('deve retornar 400 ao criar tipo de certificado com payload inválido', async () => {
    const res = await request(app)
      .post('/tipos-certificados')
      .send({ nome: '' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('deve retornar 404 ao buscar tipo de certificado inexistente', async () => {
    const res = await request(app)
      .get('/tipos-certificados/99999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

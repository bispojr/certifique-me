const request = require('supertest');
const app = require('../../app');
const certificadoService = require('../../src/services/certificadoService');

jest.mock('../../src/services/certificadoService');

describe('CertificadoController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um certificado', async () => {
    certificadoService.create.mockResolvedValue({ id: 1, nome: 'Certificado Teste' });
    const res = await request(app)
      .post('/certificados')
      .send({ nome: 'Certificado Teste' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ id: 1, nome: 'Certificado Teste' });
  });

  it('deve retornar todos os certificados', async () => {
    certificadoService.findAll.mockResolvedValue([{ id: 1, nome: 'Certificado Teste' }]);
    const res = await request(app).get('/certificados');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 1, nome: 'Certificado Teste' }]);
  });

  it('deve retornar certificado pelo id', async () => {
    certificadoService.findById.mockResolvedValue({ id: 1, nome: 'Certificado Teste' });
    const res = await request(app).get('/certificados/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: 1, nome: 'Certificado Teste' });
  });

  it('deve retornar 404 se certificado não encontrado', async () => {
    certificadoService.findById.mockResolvedValue(null);
    const res = await request(app).get('/certificados/999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Certificado não encontrado' });
  });

  it('deve atualizar um certificado', async () => {
    certificadoService.update.mockResolvedValue({ id: 1, nome: 'Atualizado' });
    const res = await request(app)
      .put('/certificados/1')
      .send({ nome: 'Atualizado' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: 1, nome: 'Atualizado' });
  });

  it('deve deletar um certificado', async () => {
    certificadoService.delete.mockResolvedValue();
    const res = await request(app).delete('/certificados/1');
    expect(res.statusCode).toBe(204);
  });

  it('deve restaurar um certificado', async () => {
    certificadoService.restore.mockResolvedValue({ id: 1, nome: 'Restaurado' });
    const res = await request(app).post('/certificados/1/restore');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: 1, nome: 'Restaurado' });
  });

  it('deve cancelar um certificado', async () => {
    certificadoService.cancel.mockResolvedValue({ id: 1, nome: 'Cancelado' });
    const res = await request(app).post('/certificados/1/cancel');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: 1, nome: 'Cancelado' });
  });
});

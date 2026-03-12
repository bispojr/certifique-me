const request = require('supertest');
const app = require('../../app');
const participanteService = require('../../src/services/participanteService');

jest.mock('../../src/services/participanteService');

describe('ParticipanteController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um participante', async () => {
    participanteService.create.mockResolvedValue({ id: 1, nome: 'Teste' });
    const res = await request(app)
      .post('/participantes')
      .send({ nome: 'Teste' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ id: 1, nome: 'Teste' });
  });

  it('deve retornar todos os participantes', async () => {
    participanteService.findAll.mockResolvedValue([{ id: 1, nome: 'Teste' }]);
    const res = await request(app).get('/participantes');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 1, nome: 'Teste' }]);
  });

  it('deve retornar participante pelo id', async () => {
    participanteService.findById.mockResolvedValue({ id: 1, nome: 'Teste' });
    const res = await request(app).get('/participantes/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: 1, nome: 'Teste' });
  });

  it('deve retornar 404 se participante não encontrado', async () => {
    participanteService.findById.mockResolvedValue(null);
    const res = await request(app).get('/participantes/999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Participante não encontrado' });
  });

  it('deve atualizar um participante', async () => {
    participanteService.update.mockResolvedValue({ id: 1, nome: 'Atualizado' });
    const res = await request(app)
      .put('/participantes/1')
      .send({ nome: 'Atualizado' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: 1, nome: 'Atualizado' });
  });

  it('deve deletar um participante', async () => {
    participanteService.delete.mockResolvedValue();
    const res = await request(app).delete('/participantes/1');
    expect(res.statusCode).toBe(204);
  });

  it('deve restaurar um participante', async () => {
    participanteService.restore.mockResolvedValue({ id: 1, nome: 'Restaurado' });
    const res = await request(app).post('/participantes/1/restore');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: 1, nome: 'Restaurado' });
  });
});

const { Certificado } = require('../../models');

describe('Certificado Model', () => {
  beforeEach(async () => {
    await Certificado.destroy({ where: {}, force: true });
  });

  test('deve criar certificado com dados válidos', async () => {
    const certificadoData = {
      nome: 'Certificado de Minicurso',
      status: 'liberado',
      valores_dinamicos: { instrutor: 'Maria Souza', vagas: 30 },
      evento_id: 1,
      tipo_certificado_id: 1
    };
    const certificado = await Certificado.create(certificadoData);
    expect(certificado).toBeDefined();
    expect(certificado.id).toBeDefined();
    expect(certificado.nome).toBe(certificadoData.nome);
    expect(certificado.status).toBe('liberado');
    expect(certificado.valores_dinamicos).toEqual(certificadoData.valores_dinamicos);
    expect(certificado.created_at).toBeDefined();
    expect(certificado.updated_at).toBeDefined();
  });

  test('não deve criar certificado sem nome', async () => {
    await expect(
      Certificado.create({
        status: 'liberado',
        evento_id: 1,
        tipo_certificado_id: 1
      })
    ).rejects.toThrow();
  });

  test('não deve criar certificado com status inválido', async () => {
    await expect(
      Certificado.create({
        nome: 'Certificado de Oficina',
        status: 'invalido',
        evento_id: 1,
        tipo_certificado_id: 1
      })
    ).rejects.toThrow();
  });

  test('soft delete deve funcionar', async () => {
    const certificado = await Certificado.create({
      nome: 'Certificado de Palestra',
      status: 'liberado',
      evento_id: 1,
      tipo_certificado_id: 1
    });
    await certificado.destroy();
    const encontrado = await Certificado.findByPk(certificado.id);
    expect(encontrado).toBeNull();
    const comDeletados = await Certificado.findByPk(certificado.id, { paranoid: false });
    expect(comDeletados).toBeDefined();
    expect(comDeletados.deleted_at).not.toBeNull();
  });

  test('deve permitir restaurar certificado deletado', async () => {
    const certificado = await Certificado.create({
      nome: 'Certificado de Arduino',
      status: 'liberado',
      evento_id: 1,
      tipo_certificado_id: 1
    });
    await certificado.destroy();
    await certificado.restore();
    const restaurado = await Certificado.findByPk(certificado.id);
    expect(restaurado).toBeDefined();
    expect(restaurado.deleted_at).toBeNull();
  });
});

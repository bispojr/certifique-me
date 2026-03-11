const { TiposCertificados } = require('../../models');

describe('TiposCertificados Model', () => {
  beforeEach(async () => {
    await TiposCertificados.destroy({ where: {}, force: true });
  });

  test('deve criar tipos_certificados com campo_destaque e dados_dinamicos', async () => {
    const tipoData = {
      codigo: 'PA',
      descricao: 'Palestra',
      campo_destaque: 'tema',
      dados_dinamicos: { tema: '', palestrante: '', duracao: '' }
    };
    const tipo = await TiposCertificados.create(tipoData);
    expect(tipo).toBeDefined();
    expect(tipo.id).toBeDefined();
    expect(tipo.codigo).toBe(tipoData.codigo);
    expect(tipo.descricao).toBe(tipoData.descricao);
    expect(tipo.campo_destaque).toBe(tipoData.campo_destaque);
    expect(tipo.dados_dinamicos).toEqual(tipoData.dados_dinamicos);
    expect(tipo.created_at).toBeDefined();
    expect(tipo.updated_at).toBeDefined();
  });

  test('não deve criar tipos_certificados sem campo_destaque', async () => {
    await expect(
      TiposCertificados.create({ codigo: 'MC', descricao: 'Minicurso', dados_dinamicos: { instrutor: '', vagas: '' } })
    ).rejects.toThrow();
  });

  test('não deve criar tipos_certificados sem codigo', async () => {
    await expect(
      TiposCertificados.create({ descricao: 'Oficina', campo_destaque: 'material', dados_dinamicos: { material: '' } })
    ).rejects.toThrow();
  });

  test('não deve criar tipos_certificados com codigo fora do padrão', async () => {
    await expect(
      TiposCertificados.create({ codigo: '123', descricao: 'Oficina', campo_destaque: 'material', dados_dinamicos: { material: '' } })
    ).rejects.toThrow();
    await expect(
      TiposCertificados.create({ codigo: 'A', descricao: 'Oficina', campo_destaque: 'material', dados_dinamicos: { material: '' } })
    ).rejects.toThrow();
    await expect(
      TiposCertificados.create({ codigo: 'ABC', descricao: 'Oficina', campo_destaque: 'material', dados_dinamicos: { material: '' } })
    ).rejects.toThrow();
    await expect(
      TiposCertificados.create({ codigo: '1A', descricao: 'Oficina', campo_destaque: 'material', dados_dinamicos: { material: '' } })
    ).rejects.toThrow();
  });

  test('não deve criar tipos_certificados com codigo duplicado', async () => {
    await TiposCertificados.create({ codigo: 'PA', descricao: 'Palestra', campo_destaque: 'tema', dados_dinamicos: { tema: '', palestrante: '' } });
    await expect(
      TiposCertificados.create({ codigo: 'PA', descricao: 'Outra palestra', campo_destaque: 'tema', dados_dinamicos: { tema: '', palestrante: '' } })
    ).rejects.toThrow();
  });

  test('soft delete deve funcionar', async () => {
    const tipo = await TiposCertificados.create({ codigo: 'MC', descricao: 'Minicurso', campo_destaque: 'instrutor', dados_dinamicos: { instrutor: '', vagas: '' } });
    await tipo.destroy();
    const encontrado = await TiposCertificados.findByPk(tipo.id);
    expect(encontrado).toBeNull();
    const comDeletados = await TiposCertificados.findByPk(tipo.id, { paranoid: false });
    expect(comDeletados).toBeDefined();
    expect(comDeletados.deleted_at).not.toBeNull();
  });

  test('deve permitir restaurar tipos_certificados deletado', async () => {
    const tipo = await TiposCertificados.create({ codigo: 'OF', descricao: 'Oficina', campo_destaque: 'material', dados_dinamicos: { material: '' } });
    await tipo.destroy();
    await tipo.restore();
    const restaurado = await TiposCertificados.findByPk(tipo.id);
    expect(restaurado).toBeDefined();
    expect(restaurado.deleted_at).toBeNull();
  });
});

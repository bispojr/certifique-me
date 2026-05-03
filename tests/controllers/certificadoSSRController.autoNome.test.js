const request = require('supertest')
const app = require('../../app')
const {
  Participante,
  Evento,
  TiposCertificados,
  Certificado,
  Usuario,
  sequelize,
} = require('../../src/models')

// Este teste garante que o campo nome do certificado é preenchido automaticamente
// com o nomeCompleto do participante, mesmo que não seja enviado pelo formulário.
describe('Certificado SSR - preenchimento automático do nome', () => {
  let participante, evento, tipo

  beforeAll(async () => {
    await sequelize.query(
      'TRUNCATE TABLE certificados, tipos_certificados, participantes, eventos, usuarios RESTART IDENTITY CASCADE',
    )

    await Usuario.create({
      nome: 'Admin Auto',
      email: 'admin-auto-nome@certifique.me',
      senha: 'senha123',
      perfil: 'admin',
    })

    participante = await Participante.create({
      nomeCompleto: 'Fulano Teste',
      email: 'fulano-auto@certifique.me',
      instituicao: 'Inst. Teste',
    })

    evento = await Evento.create({
      nome: 'Evento Auto',
      codigo_base: 'AUT',
      ano: 2026,
    })

    tipo = await TiposCertificados.create({
      evento_id: evento.id,
      codigo: 'AU',
      descricao: 'Auto Teste',
      campo_destaque: 'tema',
      texto_base: 'Texto',
      dados_dinamicos: { tema: 'Tema' },
    })
  })

  it('preenche nome automaticamente com nomeCompleto do participante ao criar', async () => {
    const agent = request.agent(app)

    // Faz login SSR com o admin criado acima
    await agent
      .post('/login')
      .send({ email: 'admin-auto-nome@certifique.me', senha: 'senha123' })
      .redirects(1)

    // Envia POST sem o campo nome
    await agent.post('/admin/certificados').send({
      participante_id: participante.id,
      evento_id: evento.id,
      tipo_certificado_id: tipo.id,
      status: 'emitido',
      valores_dinamicos_json: JSON.stringify({ tema: 'TDD' }),
      // nome intencionalmente ausente
    })

    const cert = await Certificado.findOne({
      where: { participante_id: participante.id },
    })
    expect(cert).not.toBeNull()
    expect(cert.nome).toBe('Fulano Teste')
  })
})

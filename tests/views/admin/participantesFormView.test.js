const path = require('path')
const fs = require('fs')
const Handlebars = require('handlebars')

describe('admin/participantes/form.hbs', () => {
  let template
  beforeAll(() => {
    const filePath = path.join(
      process.cwd(),
      'views/admin/participantes/form.hbs',
    )
    const source = fs.readFileSync(filePath, 'utf8')
    template = Handlebars.compile(source)
  })

  it('renderiza formulário em branco para novo participante', () => {
    const html = template({
      title: 'Novo Participante',
      action: '/admin/participantes',
      participante: {},
    })
    expect(html).toContain('<h2>Novo Participante</h2>')
    expect(html).toContain(`form method='POST' action='/admin/participantes'`)
    expect(html).toContain(`name='nomeCompleto'`)
    expect(html).toContain(`name='email'`)
    expect(html).toContain(`name='instituicao'`)
    expect(html).toContain(`type='email'`)
    expect(html).toContain(`type='text'`)
    // Campos vazios
    expect(html).toContain(`value=''`)
  })

  it('renderiza formulário preenchido para edição', () => {
    const participante = {
      nomeCompleto: 'Fulano Teste',
      email: 'fulano@email.com',
      instituicao: 'UFSC',
    }
    const html = template({
      title: 'Editar Participante',
      action: '/admin/participantes/1/editar',
      participante,
    })
    expect(html).toContain('<h2>Editar Participante</h2>')
    expect(html).toContain(
      `form method='POST' action='/admin/participantes/1/editar'`,
    )
    expect(html).toContain(`value='Fulano Teste'`)
    expect(html).toContain(`value='fulano@email.com'`)
    expect(html).toContain(`value='UFSC'`)
  })
})

const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const cheerio = require('cheerio')

describe('views/admin/usuarios/form.hbs', () => {
  let template
  beforeAll(() => {
    const filePath = path.join(process.cwd(), 'views/admin/usuarios/form.hbs')
    const source = fs.readFileSync(filePath, 'utf8')
    Handlebars.registerHelper('eq', (a, b) => a === b)
    Handlebars.registerHelper(
      'includes',
      (arr, val) => Array.isArray(arr) && arr.includes(val),
    )
    // Helpers do sistema
    Handlebars.registerHelper('selected', function (value, expected) {
      return value === expected ? 'selected' : ''
    })
    Handlebars.registerHelper('ifSelected', function (val) {
      return val ? 'selected' : ''
    })
    template = Handlebars.compile(source)
  })

  it('renderiza formulário de novo usuário com senha required', () => {
    const html = template({
      usuario: null,
      eventos: [
        { id: 1, nome: 'Evento 1' },
        { id: 2, nome: 'Evento 2' },
      ],
      flash: {},
    })
    const $ = cheerio.load(html)
    expect($('h2').text()).toMatch(/Novo Usuário/)
    expect($('input[name="senha"]').attr('required')).toBeDefined()
    expect($('select[name="eventos"]').attr('multiple')).toBeDefined()
    expect($('option[value="1"]').attr('selected')).toBeUndefined()
    expect($('option[value="2"]').attr('selected')).toBeUndefined()
    expect($('form').attr('action')).toBe('/admin/usuarios')
  })

  it('renderiza formulário de edição com senha opcional e eventos pré-selecionados', () => {
    const html = template({
      usuario: {
        id: 42,
        nome: 'Fulano',
        email: 'f@f.com',
        perfil: 'gestor',
        eventoIds: [2],
      },
      eventos: [
        { id: 1, nome: 'Evento 1', selected: false },
        { id: 2, nome: 'Evento 2', selected: true },
      ],
      flash: {},
    })
    const $ = cheerio.load(html)
    expect($('h2').text()).toMatch(/Editar Usuário/)
    expect($('input[name="senha"]').attr('required')).toBeUndefined()
    expect($('input[name="senha"]').attr('placeholder')).toMatch(/não alterar/)
    expect($('option[value="1"]').attr('selected')).toBeUndefined()
    expect($('option[value="2"]').attr('selected')).toBeDefined()
    expect($('select[name="perfil"]').val()).toBe('gestor')
    expect($('form').attr('action')).toBe('/admin/usuarios/42')
  })

  it('não renderiza flash na view (responsabilidade do layout)', () => {
    const html = template({
      usuario: null,
      eventos: [],
      flash: { error: 'Falha!', success: 'Ok!' },
    })
    const $ = cheerio.load(html)
    expect($('.alert-danger').length).toBe(0)
    expect($('.alert-success').length).toBe(0)
  })
})

const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const cheerio = require('cheerio')

describe('views/admin/certificados/index.hbs', () => {
  let template
  beforeAll(() => {
    const filePath = path.join(process.cwd(), 'views/admin/certificados/index.hbs')
    let source = fs.readFileSync(filePath, 'utf8')
    // Extrai só o conteúdo entre as tags do layout para teste com Handlebars puro
    const match = source.match(/{{#>\s*layouts\/admin\s*}}([\s\S]*?){{\/layouts\/admin\s*}}/)
    source = match ? match[1] : source
    Handlebars.registerHelper('eq', (a, b) => a === b)
    Handlebars.registerHelper('isSelected', function (a, b) {
      return String(a) === String(b) ? 'selected' : ''
    })
    Handlebars.registerHelper('toString', val => String(val ?? ''))
    template = Handlebars.compile(source)
  })

  it('renderiza filtros com valores selecionados', () => {
    const html = template({
      eventos: [{ id: 1, nome: 'E1' }],
      tipos: [{ id: 2, descricao: 'T2' }],
      filtros: { evento_id: '1', status: 'emitido', tipo_id: '2' },
      certificados: [],
      arquivados: [],
      flash: {},
    })
    const $ = cheerio.load(html)
    expect($('select[name="evento_id"] option[selected][value="1"]').length).toBe(1)
    expect($('select[name="status"] option[selected][value="emitido"]').length).toBe(1)
    expect($('select[name="tipo_id"] option[selected][value="2"]').length).toBe(1)
  })

  it('renderiza tabela de certificados ativos', () => {
    const html = template({
      certificados: [
        { id: 1, codigo: 'C1', status: 'emitido', nome: 'Cert 1', Participante: { nomeCompleto: 'Fulano' }, Evento: { nome: 'EV' } },
        { id: 2, codigo: 'C2', status: 'pendente', nome: 'Cert 2', Participante: { nomeCompleto: 'Beltrano' }, Evento: { nome: 'EV2' } },
      ],
      eventos: [], tipos: [], filtros: {}, arquivados: [], flash: {},
    })
    const $ = cheerio.load(html)
    expect($('tbody tr').length).toBe(2)
    expect($('tbody tr').first().find('td').eq(1).text()).toContain('Fulano')
    expect($('tbody tr').last().find('td').eq(1).text()).toContain('Beltrano')
    expect($('span.badge.bg-success').text()).toContain('emitido')
    expect($('span.badge.bg-warning.text-dark').text()).toContain('pendente')
  })

  it('não mostra botão Cancelar para certificados cancelados', () => {
    const html = template({
      certificados: [
        { id: 3, codigo: 'C3', status: 'cancelado', nome: 'Cert 3', Participante: { nomeCompleto: 'Ciclano' }, Evento: { nome: 'EV3' } },
      ], eventos: [], tipos: [], filtros: {}, arquivados: [], flash: {},
    })
    const $ = cheerio.load(html)
    expect($('button[data-bs-target="#modalCancelar"]').length).toBe(0)
  })

  it('mostra botão Cancelar para certificados não cancelados', () => {
    const html = template({
      certificados: [
        { id: 4, codigo: 'C4', status: 'emitido', nome: 'Cert 4', Participante: { nomeCompleto: 'D' }, Evento: { nome: 'EV4' } },
      ], eventos: [], tipos: [], filtros: {}, arquivados: [], flash: {},
    })
    const $ = cheerio.load(html)
    expect($('button[data-bs-target="#modalCancelar"]').length).toBe(1)
  })

  it('renderiza seção de arquivados apenas se houver', () => {
    let html = template({ certificados: [], arquivados: [], eventos: [], tipos: [], filtros: {}, flash: {} })
    let $ = cheerio.load(html)
    expect($('details').length).toBe(0)
    html = template({ certificados: [], arquivados: [{ id: 5, codigo: 'C5', Participante: { nomeCompleto: 'E' }, Evento: { nome: 'EV5' } }], eventos: [], tipos: [], filtros: {}, flash: {} })
    $ = cheerio.load(html)
    expect($('details').length).toBe(1)
    expect($('details table tbody tr').length).toBe(1)
  })

  it('exibe mensagens flash de sucesso e erro', () => {
    const html = template({ certificados: [], arquivados: [], eventos: [], tipos: [], filtros: {}, flash: { success: 'OK', error: 'ERRO' } })
    const $ = cheerio.load(html)
    expect($('.alert-success').text()).toContain('OK')
    expect($('.alert-danger').text()).toContain('ERRO')
  })
})

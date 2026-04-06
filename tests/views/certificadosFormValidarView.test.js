const path = require('path')
const fs = require('fs')
const cheerio = require('cheerio')
const handlebars = require('handlebars')

describe('View: certificados/form-validar.hbs', () => {
  let template
  beforeAll(() => {
    const filePath = path.join(
      __dirname,
      '../../views/certificados/form-validar.hbs',
    )
    const source = fs.readFileSync(filePath, 'utf8')
    template = handlebars.compile(source)
  })

  it('renderiza ids e spinner corretamente', () => {
    const html = template({ mensagem: null })
    const $ = cheerio.load(html)
    expect($('#form-validar').length).toBe(1)
    expect($('#btn-validar').length).toBe(1)
    expect($('#spinner-validar').length).toBe(1)
    expect($('#spinner-validar').attr('style')).toMatch(/display:\s*none/)
  })

  it('renderiza mensagem de erro se presente', () => {
    const html = template({ mensagem: 'Erro!' })
    expect(html).toMatch(/alert/)
    expect(html).toMatch(/Erro!/)
  })

  it('inclui script para desabilitar botão e exibir spinner', () => {
    const html = template({})
    expect(html).toMatch(/addEventListener\('submit'/)
    expect(html).toMatch(/btn-validar/)
    expect(html).toMatch(/spinner-validar/)
  })
})

const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

describe('views/admin/eventos', () => {
  describe('index.hbs', () => {
    const viewPath = path.join(__dirname, '../../views/admin/eventos/index.hbs')
    let html
    beforeAll(() => {
      html = fs.readFileSync(viewPath, 'utf8')
    })
    it('exibe mensagem quando lista de eventos está vazia', () => {
      expect(html).toMatch(/{{else}}[\s\S]*Nenhum evento cadastrado\./)
    })
    it('botão Remover tem confirm()', () => {
      expect(html).toMatch(
        /onsubmit="return confirm\('Remover este evento\?'\)"/,
      )
    })
    it('seção de arquivados usa <details> e summary', () => {
      expect(html).toMatch(/<details[\s\S]*<summary[^>]*>Eventos arquivados/)
    })
  })

  describe('form.hbs', () => {
    const viewPath = path.join(__dirname, '../../views/admin/eventos/form.hbs')
    let html
    beforeAll(() => {
      html = fs.readFileSync(viewPath, 'utf8')
    })
    it('campo codigo_base tem pattern e maxlength corretos', () => {
      expect(html).toMatch(/name='codigo_base'[\s\S]*pattern='\[A-Za-z\]\{3\}'/)
      expect(html).toMatch(/name='codigo_base'[\s\S]*maxlength='3'/)
    })
  })
})

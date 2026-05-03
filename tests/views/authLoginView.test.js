// tests/views/authLoginView.test.js
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

describe('views/auth/login.hbs', () => {
  const viewPath = path.join(__dirname, '../../views/auth/login.hbs')
  let html

  beforeAll(() => {
    html = fs.readFileSync(viewPath, 'utf8')
  })

  it('existe em views/auth/login.hbs', () => {
    expect(fs.existsSync(viewPath)).toBe(true)
  })

  it("contém <form action='/login' method='POST'>", () => {
    expect(html).toMatch(
      /<form[^>]+action=['"]?\/login['"]?[^>]*method=['"]?POST['"]?/,
    )
  })

  it('não renderiza flash na view (responsabilidade do layout)', () => {
    expect(html).not.toMatch(/{{#if +flash\.error}}/)
    expect(html).not.toMatch(/{{#if +flash\.success}}/)
  })

  it('contém campo email e senha', () => {
    expect(html).toMatch(/name=['\"]email['\"]/) // campo email
    expect(html).toMatch(/name=['\"]senha['\"]/) // campo senha
  })
})

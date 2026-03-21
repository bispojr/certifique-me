const request = require('supertest')
const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const exphbs = require('express-handlebars')

describe('TASK-028-B: Configuração de sessão e flash', () => {
  let app
  beforeAll(() => {
    // Cria o template temporário ANTES de inicializar o app
    const fs = require('fs')
    const tempView = path.join(__dirname, '../../views/flash-test.hbs')
    fs.writeFileSync(
      tempView,
      '<!DOCTYPE html><html><body>{{#if flash.success}}{{#each flash.success}}<div id="msg">{{this}}</div>{{/each}}{{/if}}</body></html>',
    )
    app = express()
    app.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: false }))
    app.set('view engine', 'hbs')
    app.set('views', path.join(__dirname, '../../views'))
    app.use(express.urlencoded({ extended: false }))
    app.use(
      session({
        secret: 'test-secret',
        resave: false,
        saveUninitialized: false,
      }),
    )
    app.use(flash())
    app.use((req, res, next) => {
      res.locals.flash = {
        success: req.flash('success'),
        error: req.flash('error'),
      }
      next()
    })
    // Rota que seta uma mensagem flash e redireciona
    app.get('/set-flash', (req, res) => {
      req.flash('success', 'Mensagem de sucesso!')
      res.redirect('/show-flash')
    })
    // Rota que exibe a mensagem flash
    app.get('/show-flash', (req, res) => {
      res.render('flash-test', { title: 'Flash Test' })
    })
    // Middleware de erro para debug
    app.use((err, req, res, next) => {
      // eslint-disable-next-line no-console
      console.error('ERRO NO TESTE:', err)
      res.status(500).send('Erro: ' + err.message + '\n' + err.stack)
    })
  })

  it('deve permitir setar e ler mensagem flash via req.flash e exibir no template', async () => {
    const agent = request.agent(app)
    const res = await agent.get('/set-flash').redirects(1)
    expect(res.status).toBe(200)
    expect(res.text).toContain('Mensagem de sucesso!')
    // Limpa o template temporário
    const fs = require('fs')
    const tempView = path.join(__dirname, '../../views/flash-test.hbs')
    fs.unlinkSync(tempView)
  })
})

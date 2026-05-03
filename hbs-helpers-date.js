const hbs = require('hbs')

function pad2(n) {
  return n < 10 ? '0' + n : '' + n
}

hbs.registerHelper('formatDatePtBr', function (date) {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d)) return ''
  const dia = pad2(d.getDate())
  const mes = pad2(d.getMonth() + 1)
  const ano = ('' + d.getFullYear()).slice(-2)
  const hora = pad2(d.getHours())
  const min = pad2(d.getMinutes())
  return `${dia}/${mes}/${ano}, ${hora}h${min}, Horário de Brasília.`
})

// Também registra no Handlebars puro (usado em testes)
try {
  const Handlebars = require('handlebars')
  Handlebars.registerHelper('formatDatePtBr', function (date) {
    if (!date) return ''
    const d = new Date(date)
    if (isNaN(d)) return ''
    const dia = pad2(d.getDate())
    const mes = pad2(d.getMonth() + 1)
    const ano = ('' + d.getFullYear()).slice(-2)
    const hora = pad2(d.getHours())
    const min = pad2(d.getMinutes())
    return `${dia}/${mes}/${ano}, ${hora}h${min}, Horário de Brasília.`
  })
} catch (e) {}

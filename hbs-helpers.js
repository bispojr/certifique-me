const hbs = require('hbs')
hbs.registerHelper('json', function (context) {
  return JSON.stringify(context || {})
})

hbs.registerHelper('eq', function (a, b) {
  return a === b
})

hbs.registerHelper('selected', function (value, expected) {
  return value === expected ? 'selected' : ''
})

hbs.registerHelper('ifSelected', function (val) {
  return val ? 'selected' : ''
})

hbs.registerHelper('toString', function (val) {
  return String(val ?? '')
})

hbs.registerHelper('isSelected', function (a, b) {
  return String(a) === String(b) ? 'selected' : ''
})

// Adicione outros helpers aqui se necessário
hbs.registerHelper('getPerfilBadgeClass', function (perfil) {
  if (perfil === 'admin') return 'bg-danger'
  if (perfil === 'gestor') return 'bg-warning text-dark'
  return 'bg-info text-dark'
})

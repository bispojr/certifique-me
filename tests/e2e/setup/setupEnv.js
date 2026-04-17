// Define o ambiente e2e antes que qualquer módulo seja carregado
process.env.NODE_ENV = 'e2e'
require('dotenv').config({
  path: require('path').resolve(__dirname, '../../../.env'),
})

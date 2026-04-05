require('dotenv').config()


function requiredEnv(varName, opts = {}) {
  const value = process.env[varName]
  if (!value) {
    // Permite ignorar variáveis só usadas em ambiente específico
    if (opts.optionalInProd && process.env.NODE_ENV === 'production') {
      return undefined
    }
    throw new Error(`Variável de ambiente obrigatória não definida: ${varName}`)
  }
  return value
}

module.exports = {
  development: {
    username: requiredEnv('DB_USER'),
    password: requiredEnv('DB_PASSWORD'),
    database: requiredEnv('DB_NAME'),
    host: requiredEnv('DB_HOST'),
    port: parseInt(requiredEnv('DB_PORT'), 10),
    dialect: 'postgres',
    logging: console.log,
  },
  test: {
    username: requiredEnv('DB_USER'),
    password: requiredEnv('DB_PASSWORD'),
    database: requiredEnv('DB_NAME_TEST', { optionalInProd: true }),
    host: requiredEnv('DB_HOST'),
    port: parseInt(requiredEnv('DB_PORT_TEST'), 10),
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: requiredEnv('DB_USER'),
    password: requiredEnv('DB_PASSWORD'),
    database: requiredEnv('DB_NAME'),
    host: requiredEnv('DB_HOST'),
    port: parseInt(requiredEnv('DB_PORT'), 10),
    dialect: 'postgres',
    logging: false,
    ssl: true,
  },
}

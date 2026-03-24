const { ZodError } = require('zod')

module.exports = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body)
    next()
  } catch (err) {
    if (err instanceof ZodError) {
      return res
        .status(400)
        .json({ error: 'Erro de validação', detalhes: err.errors })
    }
    next(err)
  }
}

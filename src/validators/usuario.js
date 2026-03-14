const { z } = require('zod')

const usuarioSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(6),
  perfil: z.enum(['admin', 'gestor', 'monitor']),
  eventos: z.array(z.number().int()).optional(),
})

module.exports = usuarioSchema

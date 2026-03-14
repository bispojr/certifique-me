const usuarioSchema = require('../../src/validators/usuario')

describe('Validação Zod - Usuario', () => {
  it('valida um usuario válido sem eventos', () => {
    const valido = {
      nome: 'Maria Silva',
      email: 'maria@email.com',
      senha: '123456',
      perfil: 'admin',
    }
    expect(() => usuarioSchema.parse(valido)).not.toThrow()
  })

  it('valida um usuario válido com eventos', () => {
    const valido = {
      nome: 'João Eventos',
      email: 'joao@eventos.com',
      senha: 'abcdef',
      perfil: 'monitor',
      eventos: [1, 2, 3],
    }
    expect(() => usuarioSchema.parse(valido)).not.toThrow()
  })

  it('rejeita email inválido', () => {
    const invalido = {
      nome: 'João',
      email: 'joaoemail.com',
      senha: '123456',
      perfil: 'gestor',
    }
    expect(() => usuarioSchema.parse(invalido)).toThrow()
  })

  it('rejeita perfil inválido', () => {
    const invalido = {
      nome: 'Ana',
      email: 'ana@email.com',
      senha: '123456',
      perfil: 'visitante',
    }
    expect(() => usuarioSchema.parse(invalido)).toThrow()
  })

  it('rejeita senha curta', () => {
    const invalido = {
      nome: 'Carlos',
      email: 'carlos@email.com',
      senha: '123',
      perfil: 'monitor',
    }
    expect(() => usuarioSchema.parse(invalido)).toThrow()
  })

  it('rejeita eventos não numéricos', () => {
    const invalido = {
      nome: 'Lucas',
      email: 'lucas@email.com',
      senha: 'abcdef',
      perfil: 'monitor',
      eventos: ['a', 2],
    }
    expect(() => usuarioSchema.parse(invalido)).toThrow()
  })
})

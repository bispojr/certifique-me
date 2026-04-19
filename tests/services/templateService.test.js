const templateService = require('../../src/services/templateService')

describe('templateService.interpolate', () => {
  it('substitui ${evento} pelo valor em valoresDinamicos', () => {
    const texto = 'Evento: ${evento}'
    const valores = { evento: 'EduComp 2026' }
    const nome = 'João'
    const resultado = templateService.interpolate(texto, valores, nome)
    expect(resultado).toBe('Evento: EduComp 2026')
  })

  it('não sobrescreve ${nome} com nome do evento', () => {
    const texto = 'Participante: ${nome}, Evento: ${evento}'
    const valores = { evento: 'EduComp 2026' }
    const nome = 'Maria Silva'
    const resultado = templateService.interpolate(texto, valores, nome)
    expect(resultado).toBe('Participante: Maria Silva, Evento: EduComp 2026')
  })
  it('substitui ${nome} pelo campo nome quando não está em valoresDinamicos', () => {
    const texto = 'Certificamos que ${nome} participou.'
    const valores = {}
    const result = templateService.interpolate(texto, valores, 'Maria Silva')
    expect(result).toBe('Certificamos que Maria Silva participou.')
  })

  it('prioriza valoresDinamicos["nome"] sobre o campo nome', () => {
    const texto = 'Certificamos que ${nome} participou.'
    const valores = { nome: 'João Souza' }
    const result = templateService.interpolate(texto, valores, 'Maria Silva')
    expect(result).toBe('Certificamos que João Souza participou.')
  })
  it('substitui chaves por valores', () => {
    const texto = 'Olá, ${nome}! Seu código é ${codigo}.'
    const valores = { nome: 'João', codigo: 'ABC123' }
    const result = templateService.interpolate(texto, valores)
    expect(result).toBe('Olá, João! Seu código é ABC123.')
  })

  it('mantém chaves sem valor', () => {
    const texto = 'Olá, ${nome}! Seu código é ${codigo}.'
    const valores = { nome: 'João' }
    const result = templateService.interpolate(texto, valores)
    expect(result).toBe('Olá, João! Seu código é ${codigo}.')
  })

  it('funciona com texto sem chaves', () => {
    const texto = 'Sem variáveis aqui.'
    const valores = { nome: 'João' }
    const result = templateService.interpolate(texto, valores)
    expect(result).toBe('Sem variáveis aqui.')
  })

  it('remove espaços e quebras de linha do início e fim após interpolação', () => {
    const textoBase = `\n\n   Certificamos que ${'${nome}'} participou do evento.   \n\n`
    const valores = { nome: 'Maria' }
    const resultado = templateService
      .interpolate(textoBase, valores, valores.nome)
      .trim()
    // Não deve ter espaços/quebras de linha no início/fim
    expect(resultado.startsWith('Certificamos')).toBe(true)
    expect(resultado.endsWith('evento.')).toBe(true)
    expect(resultado).toBe('Certificamos que Maria participou do evento.')
  })

  it('não remove espaços internos válidos', () => {
    const textoBase = 'Certificamos que ${nome} participou do evento.'
    const valores = { nome: 'João da Silva' }
    const resultado = templateService
      .interpolate(textoBase, valores, valores.nome)
      .trim()
    expect(resultado).toBe(
      'Certificamos que João da Silva participou do evento.',
    )
  })

  it('mantém texto limpo mesmo com valores com espaços', () => {
    const textoBase = 'Certificamos que ${nome} participou.'
    const valores = { nome: '   Ana   ' }
    const resultado = templateService
      .interpolate(textoBase, valores, valores.nome)
      .trim()
    expect(resultado).toBe('Certificamos que    Ana    participou.')
  })
})

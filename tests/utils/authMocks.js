// tests/utils/authMocks.js
/**
 * Mocka login SSR para testes, setando a sessão com o perfil desejado.
 * @param {import('supertest').SuperAgentTest} agent
 * @param {'monitor'|'gestor'|'admin'} perfil
 */
async function mockLogin(agent, perfil = 'monitor') {
  // Simula login SSR: seta cookie de sessão com usuário fake
  // Ajuste conforme o formato real da sessão SSR
  const fakeUser = {
    id: 999,
    nome: 'Usuário Teste',
    email: 'teste@certifique.me',
    perfil,
    getEventos: async () => [{ id: 1, nome: 'Evento Teste' }],
  }
  // Faz uma requisição que seta a sessão SSR
  await agent
    .get('/admin/dashboard')
    .set('x-mock-user', JSON.stringify(fakeUser))
  // O middleware authSSR pode ser adaptado para aceitar esse header em ambiente de teste
}

module.exports = { mockLogin }

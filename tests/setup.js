const { sequelize } = require('../models');

// Configuração global para testes
beforeAll(async () => {
  // Sincroniza banco de dados de teste
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Fecha conexão após todos os testes
  await sequelize.close();
});

// Limpa dados entre testes se necessário
beforeEach(async () => {
  // Cada teste começa com banco limpo
  // Adicionar limpeza específica se necessário
});
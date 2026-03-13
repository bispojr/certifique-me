# ADR 001 — ORM Sequelize

## Contexto

O projeto utiliza o Sequelize como ORM para abstração do banco de dados PostgreSQL.

## Decisão

- Sequelize escolhido por sua maturidade, suporte a migrations, integração com Node.js e facilidade de uso.
- Permite uso de hooks, validações, soft delete (paranoid) e relacionamentos.

## Consequências

- Facilita manutenção e evolução do schema.
- Permite integração com ferramentas de CI/CD.
- Possibilita uso de features avançadas como JSONB.

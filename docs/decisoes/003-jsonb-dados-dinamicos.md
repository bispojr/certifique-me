# ADR 003 — Uso de JSONB para dados_dinamicos

## Contexto

O campo `dados_dinamicos` em TiposCertificados utiliza o tipo JSONB do PostgreSQL.

## Decisão

- JSONB escolhido para flexibilidade na definição de campos dinâmicos.
- Permite armazenar estruturas variadas sem alterar o schema.

## Consequências

- Facilita customização de certificados.
- Permite validações cross-field.
- Exige atenção na manipulação e validação dos dados.

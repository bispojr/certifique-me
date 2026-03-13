# ADR 002 — Soft Delete (Paranoid)

## Contexto

O projeto utiliza soft delete (paranoid) nas entidades principais.

## Decisão

- Soft delete implementado via opção `paranoid: true` no Sequelize.
- Registros não são removidos fisicamente, apenas marcados com `deleted_at`.

## Consequências

- Permite restauração de registros.
- Evita perda acidental de dados.
- Facilita auditoria e rastreabilidade.

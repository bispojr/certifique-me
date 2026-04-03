# certifique-me

[![Build Status](https://github.com/bispojr/certifique-me/actions/workflows/ci.yml/badge.svg)](https://github.com/bispojr/certifique-me/actions) [![codecov](https://codecov.io/github/bispojr/certifique-me/graph/badge.svg?token=6QENAQ10EH)](https://codecov.io/github/bispojr/certifique-me)


## Configuração de ambiente

1. Copie o arquivo `.env.example` para `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edite as variáveis conforme necessário.
   - **JWT_SECRET é obrigatório**: defina uma chave secreta forte para autenticação JWT. O sistema não funcionará sem essa variável.

3. O arquivo `.env` já está ignorado pelo git.

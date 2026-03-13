# Especificações do Projeto

## Implementado

- [x] Model Participante com soft delete e testes automatizados
- [x] Configuração de testes com PostgreSQL dedicado
- [x] Estrutura Docker para produção e testes
- [x] Testes de validação, unicidade e restauração

## Planejado

- [ ] Model Certificado com testes
- [ ] Model TiposCertificados (relacionamento)
- [ ] Rotas de API para CRUD
- [ ] Views Handlebars para interação
- [ ] Validação de certificados
- [ ] Geração de PDFs
- [ ] Testes de integração das rotas

## Testes planejados

### Participante

- [x] Não deve criar participante sem nomeCompleto (campo obrigatório)
- [x] Não deve criar participante sem email (campo obrigatório)
- [x] Não deve criar participante com email inválido
- [x] Deve restaurar participante após soft delete
- [ ] Deve associar participante a certificados (aguardando implementação dos models participacoes e certificados)

### Certificado

- [x] Deve criar certificado com dados válidos
- [x] Não deve criar certificado sem nome (campo obrigatório)
- [x] Não deve criar certificado com status inválido
- [x] Soft delete deve funcionar
- [x] Deve permitir restaurar certificado deletado

### Evento

- [x] Deve criar evento com dados válidos
- [x] Não deve criar evento sem ano (campo obrigatório)
- [x] Não deve criar evento sem nome (campo obrigatório)
- [x] Não deve criar evento sem codigo_base (campo obrigatório)
- [x] Não deve criar evento com codigo_base duplicado
- [x] Soft delete deve funcionar
- [x] Deve permitir restaurar evento deletado

### TiposCertificados

- [x] Deve criar tipos_certificados com campo_destaque, texto_base e dados_dinamicos
- [x] Não deve criar tipos_certificados sem texto_base
- [x] Não deve criar tipos_certificados sem campo_destaque
- [x] Não deve criar tipos_certificados sem codigo (duas letras, alfabético)
- [x] Não deve criar tipos_certificados com codigo fora do padrão
- [x] Não deve criar tipos_certificados com codigo duplicado
- [x] Soft delete deve funcionar
- [x] Deve permitir restaurar tipos_certificados deletado
- [ ] Deve validar se campo_destaque corresponde a um campo válido de certificado ou dados_dinamicos

---

## Estrutura das tabelas principais

### Tabela eventos

- id: Identificador único
- nome: Nome do evento
- codigo_base: Código base para geração de certificados (exatamente três letras, apenas caracteres alfabéticos, ex: EDU, CMP, OFC)
- ano: Ano do evento (obrigatório)
- created_at: Data de criação
- updated_at: Data de atualização
- deleted_at: Soft delete

### Tabela tipos_certificados

- id: Identificador único
- codigo: Código do tipo de certificado (exatamente duas letras, formato alfabético, ex: PA, MC, OF) — obrigatório, único
- descricao: Descrição do tipo (ex: palestra, minicurso, oficina) — obrigatório
- campo_destaque: Nome do campo a ser exibido para cada tipo de certificado (obrigatório, não pode ser null)
  - Usado para exibição do certificado quando o usuário visualizar todos os seus certificados
  - Deve referenciar o nome do campo 'nome' do model certificado ou um campo de dados_dinamicos
- dados_dinamicos: Campo JSONB para definir os campos dinâmicos do tipo de certificado
- texto_base: Texto obrigatório que servirá como base para o template do certificado. Pode conter expressões como ${nome_completo}, ${funcao}, etc., que serão substituídas pelos valores correspondentes ao instanciar certificados desse tipo. Exemplo: "Certificamos para os devidos fins que ${nome_completo} participou do Comitê de Programa Especial para a escolha dos melhores trabalhos do IV Simpósio Brasileiro de Educação em Computação (EduComp 2024) na condição de ${funcao}."
- created_at: Data de criação
- updated_at: Data de atualização
- deleted_at: Soft delete

### Tabela certificados

- id: Identificador único
- participante_id: Referência ao participante (chave estrangeira)
- evento_id: Referência ao evento
- tipo_certificado_id: Referência ao tipo de certificado (chave estrangeira)
- nome: Nome do certificado
- status: "emitido", "pendente" ou "cancelado" (restrito a esses valores)
- valores_dinamicos: Campo JSONB para armazenar os valores dos campos definidos em tipos_certificados
- created_at: Data de criação
- updated_at: Data de atualização
- deleted_at: Soft delete

### Tabela participantes

- id: Identificador único
- nomeCompleto: Nome completo
- email: E-mail (único)
- instituicao: Instituição
- created_at: Data de criação
- updated_at: Data de atualização
- deleted_at: Soft delete

### Tabela usuarios

- id: Identificador único
- nome: Nome completo
- email: E-mail (único)
- senha: Hash da senha
- perfil: "admin", "gestor" ou "monitor"
- evento_id: Referência ao evento (chave estrangeira, exceto para admin)
- created_at: Data de criação
- updated_at: Data de atualização
- deleted_at: Soft delete

---

## Justificativa e exemplos

- O uso de uma tabela tipos_certificados permite centralizar códigos, descrições e campos dinâmicos, facilitando manutenção e consultas.
- Certificado referencia tipos_certificados via chave estrangeira e preenche os valores dos campos dinâmicos.
- Participante referencia certificado via chave estrangeira, permitindo rastrear participação.
- Cada certificado herda os campos definidos em tipos_certificados, preenchendo os valores específicos.

### Exemplo de dados_dinamicos

```json
{
  "palestrante": "Dr. João Silva",
  "tema": "Inovações em IA",
  "duracao": "2h"
}
```

Para uma oficina:

```json
{
  "instrutor": "Maria Souza",
  "materiais": ["computador", "arduino"],
  "vagas": 30
}
```

### Exemplos de queries (PostgreSQL)

- Buscar todos os certificados com palestrante:
  ```sql
  SELECT * FROM certificados WHERE valores_dinamicos->>'palestrante' IS NOT NULL;
  ```
- Buscar certificados de oficina com vagas > 20:
  ```sql
  SELECT * FROM certificados WHERE tipos_certificados.codigo = 'OF' AND (valores_dinamicos->>'vagas')::int > 20;
  ```

### Migração de planilhas

Cada linha da planilha pode ser convertida para um registro em certificados, com os campos específicos agrupados em `valores_dinamicos`.

---

## Perfis de usuário e permissões

### Admin

- Gerencia todo o site.
- Tem todas as permissões: criar, editar e remover gestores, monitores, certificados, eventos e tipos de certificados.
- Pode acessar e administrar todos os eventos.

### Gestor (login obrigatório)

- Permissão P1: Criar tipos de certificados.
- Permissão P2: Inserir dados para um certificado.
- Pode acessar todas as funcionalidades administrativas do evento.

### Monitor (login obrigatório)

- Permissão P2: Inserir dados para um certificado.
- Não pode criar tipos de certificados.
- Acesso restrito às funcionalidades administrativas.

### Público

- Pode acessar e validar certificados sem necessidade de login.

## Rotas para acesso público (sem login)

- /certificado/:id — Visualizar ou validar um certificado específico.
- /validar/:codigo — Página de validação de certificado por código.

## Rotas para usuários autenticados

### Gestor (login obrigatório)

- /dashboard — Painel administrativo do evento.
- /evento/:eventoId/tipos-certificados — Gerenciar tipos de certificados (P1).
- /evento/:eventoId/certificados — Listar, criar, editar e deletar certificados (P2).
- /evento/:eventoId/participantes — Gerenciar participantes.
- /evento/:eventoId/monitor — Gerenciar monitores e permissões.

### Monitor (login obrigatório)

- /evento/:eventoId/certificados — Inserir dados para certificados (P2).
- /evento/:eventoId/participantes — Visualizar participantes (se permitido).

## Rotas para admin (login obrigatório)

- /admin/dashboard — Painel administrativo global.
- /admin/usuarios — Gerenciar todos os usuários (gestores, monitores, admins).
- /admin/eventos — Gerenciar todos os eventos.
- /admin/certificados — Gerenciar todos os certificados.
- /admin/tipos-certificados — Gerenciar todos os tipos de certificados.
- /admin/relatorios — Visualizar relatórios e estatísticas do sistema.

## Modelo de usuário e autenticação

### Tabela usuarios

- id: Identificador único
- nome: Nome completo
- email: E-mail (único)
- senha: Hash da senha
- perfil: "admin", "gestor" ou "monitor"
- evento_id: Referência ao evento (chave estrangeira, exceto para admin)
- created_at: Data de criação
- updated_at: Data de atualização
- deleted_at: Soft delete

### Autenticação

- Usuários gestores e monitores devem realizar login para acessar rotas administrativas.
- Middleware de autorização verifica o perfil e libera acesso conforme permissões.
- Público não precisa autenticação para rotas de validação e busca de certificados.

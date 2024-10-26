# Projeto: To-Do List com Autenticação

## Visão Geral
Este projeto é uma aplicação de lista de tarefas ("To-Do List") que inclui funcionalidades de autenticação de usuário e gerenciamento de tarefas. O projeto permite que o usuário faça login, registre-se e gerencie suas tarefas, além de possibilitar a visualização e edição de sua lista pessoal de tarefas.

### Principais Tecnologias
- Frontend: HTML, CSS e JavaScript
- Backend: Node.js com Express
- Banco de Dados: MySQL (configuração em `db_config.js`)
- Autenticação: Sessions (express-session)
- Documentação: Swagger para a API

## Estrutura de Arquivos

### 1. `index.html`
- **Descrição:** Arquivo principal de interface do usuário.
- **Elementos principais:**
  - Formulários de login e cadastro.
  - Botões para adicionar e gerenciar tarefas.
  - Elementos HTML para exibição das tarefas na lista.
- **Scripts:** Inclui `app.js`, onde estão os manipuladores de eventos e a lógica de interação com a API.

### 2. `app.js`
- **Descrição:** Arquivo JavaScript para manipulação do DOM e chamadas assíncronas para a API no servidor.
- **Funcionalidades principais:**
  - Controle de exibição de formulários (login/cadastro) e alternância de visibilidade.
  - Lógica de submissão para formulários de login e registro com validação e chamadas assíncronas para `/login` e `/register`.
  - Manipulação da lista de tarefas, incluindo:
    - Adição de novas tarefas.
    - Marcação de tarefas como completas ou pendentes.
    - Edição e exclusão de tarefas com atualização imediata na interface.
  - Botão de logout para terminar a sessão do usuário【7†source】【8†source】.

### 3. `server.js`
- **Descrição:** Arquivo principal do servidor Node.js.
- **Principais funcionalidades:**
  - Configurações:
    - Middleware `body-parser` para tratamento de JSON.
    - Middleware `express-session` para autenticação de sessão.
    - Configuração e exibição da documentação da API com Swagger.
  - **Rotas de Autenticação:**
    - **`POST /login`**: Valida as credenciais do usuário.
    - **`POST /logout`**: Encerra a sessão ativa.
    - **`POST /register`**: Cadastra um novo usuário com hashing de senha (usando `bcrypt`).
  - **Rotas de Tarefas:**
    - **`GET /tasks`**: Retorna a lista de tarefas do usuário autenticado.
    - **`POST /tasks`**: Cria uma nova tarefa.
    - **`PATCH /tasks/:id`**: Atualiza o status da tarefa.
    - **`PUT /tasks/:id`**: Atualiza a descrição da tarefa.
    - **`DELETE /tasks/:id`**: Exclui a tarefa especificada.
  - **Funções auxiliares:** 
    - `hashPassword` e `comparePassword` para segurança de senha.
    - Middleware `checkAuthentication` para garantir que apenas usuários autenticados acessem determinadas rotas【9†source】.

### 4. `Swagger` - Documentação da API
- **Descrição:** A documentação da API foi configurada com Swagger.
- **Acesso:** Disponível em `/api-docs` no servidor.
- **Principais Endpoints Documentados:**
  - **Autenticação**
    - `POST /login`
    - `POST /logout`
    - `POST /register`
  - **Tarefas**
    - `GET /tasks`
    - `POST /tasks`
    - `PATCH /tasks/{id}`
    - `PUT /tasks/{id}`
    - `DELETE /tasks/{id}`

---

Essa documentação fornece uma visão geral e detalhada da estrutura, das funcionalidades e das principais rotas implementadas no projeto. Acesse `/api-docs` para detalhes completos da API.

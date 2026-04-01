# Sistema de Gerenciamento de Tarefas

Aplicação web para gerenciamento de tarefas no formato Kanban.

## Diagrama US
![](https://raw.githubusercontent.com/samuelmarc/simsaep/refs/heads/main/US.png)

👤 Autor: Renato Tilger da Silva

## Tecnologias

- **Backend:** Node.js + Express + PostgreSQL
- **Frontend:** Bootstrap 5 + JavaScript

## Pré-requisitos

- Node.js 18+
- PostgreSQL 14+

## Instalação

### 1. Banco de dados

Crie o banco no PostgreSQL:

```sql
CREATE DATABASE task_manager;
```

### 2. Backend

```bash
cd backend
cp .env.example .env
```

Edite o `.env` com suas credenciais do PostgreSQL:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=task_manager
PORT=3000
```

Instale as dependências e inicie o servidor:

```bash
npm install
npm start
```

O servidor irá criar as tabelas automaticamente na primeira execução.

### 3. Acesso

Abra o navegador em: [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

```
task-manager/
├── backend/
│   ├── routes/
│   │   ├── usuarios.js
│   │   └── tarefas.js
│   ├── db.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── utils.js
│   │   ├── kanban.js
│   │   ├── usuarios.js
│   │   └── tarefas.js
│   ├── index.html      ← Tela inicial (Quadro Kanban)
│   ├── usuarios.html   ← Cadastro de usuários
│   └── tarefas.html    ← Cadastro de tarefas
└── database.sql
```

## Funcionalidades

- **Quadro Kanban** com colunas: A Fazer, Fazendo, Pronto
- **Cadastro de usuários** com validação de e-mail
- **Cadastro de tarefas** com associação a usuário, setor e prioridade
- **Edição de tarefas** com modal
- **Exclusão de tarefas** com confirmação
- **Alteração de status** direto nos cards

## API Endpoints

### Usuários
| Método | Rota              | Descrição          |
|--------|-------------------|--------------------|
| GET    | /api/usuarios     | Listar todos       |
| GET    | /api/usuarios/:id | Buscar por ID      |
| POST   | /api/usuarios     | Criar              |
| PUT    | /api/usuarios/:id | Atualizar          |
| DELETE | /api/usuarios/:id | Remover            |

### Tarefas
| Método | Rota                     | Descrição             |
|--------|--------------------------|-----------------------|
| GET    | /api/tarefas             | Listar todas          |
| GET    | /api/tarefas/:id         | Buscar por ID         |
| POST   | /api/tarefas             | Criar                 |
| PUT    | /api/tarefas/:id         | Atualizar             |
| PATCH  | /api/tarefas/:id/status  | Alterar status        |
| DELETE | /api/tarefas/:id         | Remover               |

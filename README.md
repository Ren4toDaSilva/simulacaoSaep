# SAEP Kanban — Gerenciador de Tarefas

> **Simulação SAEP** — Projeto de desenvolvimento de software

---

👤 Autor: Renato Tilger da Silva

---

 📋 Descrição do Projeto

Aplicação web de **gerenciamento de tarefas no formato Kanban** desenvolvida para uma indústria do ramo alimentício. O sistema permite o controle visual das tarefas por meio de três colunas de status:

| Coluna | Descrição |
|---|---|
| 🔵 **A Fazer** | Tarefas ainda não iniciadas |
| 🟠 **Fazendo** | Tarefas em andamento |
| 🟢 **Pronto** | Tarefas concluídas |

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** — Estrutura da aplicação
- **CSS3** — Estilização com variáveis CSS e responsividade
- **JavaScript (Vanilla)** — Lógica da aplicação e persistência via `localStorage`
- **SQL (MySQL)** — Modelagem relacional do banco de dados

---

## 📁 Estrutura do Repositório

```
/
├── index.html          ← Aplicação principal (SPA)
├── setup_banco.sql     ← Script SQL de criação e configuração do banco
├── README.md           ← Este arquivo
└── docs/
    ├── der.png         ← Diagrama Entidade-Relacionamento (DER)
    └── caso_de_uso.png ← Diagrama de Caso de Uso
```

---

## ⚙️ Funcionalidades

### Usuários
- ✅ Cadastrar usuário (nome + e-mail)
- ✅ Validação de e-mail (formato e duplicidade)
- ✅ Editar usuário
- ✅ Excluir usuário (com confirmação)
- ✅ Listagem em tabela

### Tarefas
- ✅ Cadastrar tarefa (vinculada a um usuário)
- ✅ Campos: descrição, setor, prioridade (Baixa / Média / Alta)
- ✅ Status inicial automático: **A Fazer**
- ✅ Alterar status diretamente no quadro Kanban
- ✅ Editar tarefa (redireciona com campos preenchidos)
- ✅ Excluir tarefa (com confirmação)

### Quadro Kanban
- ✅ Visualização em 3 colunas por status
- ✅ Filtros por setor, prioridade e usuário
- ✅ Painel de estatísticas (total, em andamento, concluídas, alta prioridade)

---

## 🎨 Identidade Visual

| Elemento | Valor |
|---|---|
| Fonte | `Segoe UI` |
| Cor principal | `#0056b3` (Azul) |
| Cor secundária | `#FFFFFF` (Branco) |
| Cor de texto | `#000000` (Preto) |

---

## 🗄️ Banco de Dados

### Tabela `usuarios`
| Campo | Tipo | Restrições |
|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT |
| `nome` | VARCHAR(100) | NOT NULL |
| `email` | VARCHAR(150) | NOT NULL, UNIQUE |

### Tabela `tarefas`
| Campo | Tipo | Restrições |
|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT |
| `usuario_id` | INT | FK → usuarios(id) |
| `descricao` | TEXT | NOT NULL |
| `setor` | VARCHAR(60) | NOT NULL |
| `prioridade` | ENUM | Baixa / Média / Alta |
| `data_cadastro` | DATE | NOT NULL, DEFAULT hoje |
| `status` | ENUM | A Fazer / Fazendo / Pronto |

**Relacionamento:** Um usuário pode ter várias tarefas; uma tarefa pertence a apenas um usuário (1:N).

---

## 🚀 Como Executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/SEU_USUARIO/saep-kanban.git
   ```
2. Abra o arquivo `index.html` em qualquer navegador moderno.
3. (Opcional) Execute o `setup_banco.sql` em um servidor MySQL para configurar o banco.

---

## 📚 Observações

- Os dados da versão web são persistidos no **localStorage** do navegador.
- Todos os campos de cadastro são obrigatórios e possuem validação.
- A aplicação é **responsiva** e funciona em dispositivos móveis.

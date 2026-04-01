Autor: Renato Tilger da Silva

🚀 Simulação SAEP: Gerenciador de Tarefas Kanban
 
📌 Contextualização
Uma indústria do ramo alimentício utiliza o método Kanban para gerenciar as tarefas de seus setores. Atualmente, o controle é feito de forma simplificada (To-Do List) com as etapas: A Fazer, Fazendo e Pronto

A empresa precisa de uma aplicação que integre as informações entre todos os setores e aumente a visibilidade das tarefas.

🛠️ O Desafio
Sua missão é desenvolver uma aplicação de gerenciamento de tarefas no formato To-Do List utilizando as linguagens aprendidas no curso.
 
Regras de Negócio:
Dados do Usuário: ID, Nome e E-mail.

Dados da Tarefa: ID da tarefa, ID do usuário, Descrição, Setor, Prioridade (Baixa, Média, Alta), Data de Cadastro e Status.

Padrão de Status: Toda tarefa inicia como "A Fazer".

Relacionamento: Um usuário pode ter várias tarefas, mas uma tarefa pertence a apenas um usuário.

Interface: As tarefas devem ser exibidas em uma tabela/painel com 3 colunas baseadas no status.

Integridade: Todos os campos de cadastro são de preenchimento obrigatório.
 
📥 Entregas (Via GitHub)
Todo o material deve ser enviado em um único repositório no GitHub. Organize os arquivos conforme as orientações abaixo:
 
1. Modelagem e Documentação
DER (Diagrama Entidade-Relacionamento): Arquivo .jpg ou .png do modelo lógico do banco de dados.

Diagrama de Caso de Uso: Arquivo .jpg ou .png ilustrando os atores e ações do sistema.
 
Dica: Salve-os em uma pasta chamada /docs no seu repositório.
 
2. Banco de Dados
Script SQL: Arquivo .sql contendo a estrutura das tabelas e relacionamentos necessários.

Dica: Nomeie como setup_banco.sql na raiz do projeto.
 
3. Aplicação (Código-Fonte)
O código deve refletir as seguintes funcionalidades:

Tela de Cadastro de Usuários: Com validação de e-mail e mensagem de sucesso.

Tela de Cadastro de Tarefas: Com seleção de usuários já cadastrados e definição de prioridade.

Tela de Gerenciamento: Visualização em colunas, opção de editar (redirecionando para o cadastro com dados preenchidos), excluir (com confirmação) e alterar status.
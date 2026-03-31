CREATE DATABASE saep_kanban;

CREATE TYPE prioridade_enum AS ENUM ('Baixa','Média','Alta');
CREATE TYPE status_enum AS ENUM ('A Fazer','Fazendo','Pronto');

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE tarefas (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    descricao TEXT NOT NULL,
    setor VARCHAR(60) NOT NULL,
    prioridade prioridade_enum NOT NULL,
    data_cadastro DATE NOT NULL DEFAULT CURRENT_DATE,
    status status_enum NOT NULL DEFAULT 'A Fazer',

    CONSTRAINT fk_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
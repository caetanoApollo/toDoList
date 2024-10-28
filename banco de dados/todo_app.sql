create database todo_app;
use todo_app;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao TEXT NOT NULL,
    status ENUM('pendente', 'concluida') NOT NULL DEFAULT 'pendente',
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
CREATE DATABASE petshop_db;

USE petshop_db;

CREATE TABLE animais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raca VARCHAR(100),
    idade INT,
    tutor VARCHAR(100) NOT NULL,
    telefone VARCHAR(20)
);

CREATE TABLE servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    data DATE NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Agendado',
    observacoes TEXT,
    FOREIGN KEY (animal_id)
        REFERENCES animais(id)
        ON DELETE CASCADE
);

-- Dados de exemplo para testes
INSERT INTO animais (nome, especie, raca, idade, tutor, telefone) VALUES
('Carcaça', 'Cachorro', 'Vira-lata', 8, 'Raul', '11999999999'),
('Pipoca', 'Cachorro', 'Vira-lata', 10, 'Ana', '11888888888');

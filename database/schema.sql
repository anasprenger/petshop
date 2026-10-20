-- PetCare: estrutura do banco petshop_db (MySQL 8+)
-- Banco novo: mysql -u root -p < database/schema.sql
-- Se o petshop_db já existe, rode database/atualizar_petshop_db.sql no lugar deste.

SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS petshop_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE petshop_db;

CREATE TABLE IF NOT EXISTS animais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raca VARCHAR(100),
    idade INT,
    tutor VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    observacoes VARCHAR(500)
);

-- tipo:   banho, tosa, consulta, vacinacao, hospedagem, outro
-- status: agendado, em_andamento, concluido
CREATE TABLE IF NOT EXISTS servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    data DATE NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'agendado',
    observacoes TEXT,
    -- Ao excluir um animal, os serviços dele também são excluídos (sem registros órfãos)
    FOREIGN KEY (animal_id)
        REFERENCES animais(id)
        ON DELETE CASCADE
);

-- PetCare: ajusta o banco petshop_db que você já tem para funcionar com o app.
-- Rode UMA vez: mysql -u root -p < database/atualizar_petshop_db.sql
-- Não apaga nenhum registro: só adiciona as observações do animal
-- e padroniza os valores de tipo e status dos serviços.

SET NAMES utf8mb4;
SET SQL_SAFE_UPDATES = 0;
USE petshop_db;

-- 1. Observações do animal (campo do cadastro de animais)
ALTER TABLE animais ADD COLUMN observacoes VARCHAR(500) NULL AFTER telefone;

-- 2. Status: o app usa 'agendado', 'em_andamento' e 'concluido'
ALTER TABLE servicos ALTER COLUMN status SET DEFAULT 'agendado';

UPDATE servicos SET status = CASE
  WHEN status LIKE 'agend%'      THEN 'agendado'
  WHEN status LIKE '%andamento%' THEN 'em_andamento'
  WHEN status LIKE 'conclu%'     THEN 'concluido'
  ELSE status
END;

-- 3. Tipo: o app usa 'banho', 'tosa', 'consulta', 'vacinacao', 'hospedagem' e 'outro'
UPDATE servicos SET tipo = CASE
  WHEN tipo LIKE 'banho%'    THEN 'banho'
  WHEN tipo LIKE 'tosa%'     THEN 'tosa'
  WHEN tipo LIKE 'consulta%' THEN 'consulta'
  WHEN tipo LIKE 'vacina%'   THEN 'vacinacao'
  WHEN tipo LIKE 'hospeda%'  THEN 'hospedagem'
  WHEN tipo LIKE 'outro%'    THEN 'outro'
  ELSE tipo
END;

-- Tipos fora da lista viram 'outro', e o texto original vai para as observações do serviço
UPDATE servicos
SET observacoes = CONCAT_WS(' - ', tipo, observacoes),
    tipo = 'outro'
WHERE tipo NOT IN ('banho', 'tosa', 'consulta', 'vacinacao', 'hospedagem', 'outro');

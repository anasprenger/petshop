-- PetCare: DADOS DE EXEMPLO (opcional, apenas para testes)
-- Uso: mysql -u root -p < database/seed.sql
-- As datas são relativas ao dia em que o script é executado.

SET NAMES utf8mb4;
USE petshop_db;

INSERT INTO animais (nome, especie, raca, idade, tutor, telefone, observacoes) VALUES
  ('Thor',   'Cachorro', 'Golden Retriever',   4, 'Mariana Costa',  '(11) 98765-4321', 'Pele sensível: usar shampoo hipoalergênico.'),
  ('Mel',    'Gato',     'Siamês',             2, 'Rafael Lima',    '(11) 99876-1234', 'Fica agitada com o barulho do secador.'),
  ('Paçoca', 'Cachorro', 'Shih Tzu',           9, 'Beatriz Souza',  '(21) 98123-4567', 'Idoso, tem artrose. Manusear com cuidado.'),
  ('Kiwi',   'Ave',      'Calopsita',          3, 'Lucas Almeida',  '(31) 99654-3210', NULL),
  ('Nina',   'Gato',     'SRD',                0, 'Camila Rocha',   '(11) 97777-8888', 'Filhote resgatada. Primeira dose da antirrábica pendente.'),
  ('Bolota', 'Roedor',   'Porquinho-da-índia', 1, 'Pedro Henrique', '(11) 96543-2109', NULL);

INSERT INTO servicos (animal_id, tipo, data, valor, observacoes, status)
SELECT a.id, s.tipo, DATE_ADD(CURDATE(), INTERVAL s.dias DAY), s.valor, s.obs, s.status
FROM (
  SELECT 'Thor' AS animal, 'vacinacao' AS tipo, -62 AS dias, 120.00 AS valor, 'Vacina V10 (reforço anual).' AS obs, 'concluido' AS status
  UNION ALL SELECT 'Thor',   'banho',      -12,  75.00, 'Banho com shampoo hipoalergênico e secagem.',       'concluido'
  UNION ALL SELECT 'Thor',   'tosa',         2,  90.00, 'Tosa higiênica e corte de unhas.',                  'agendado'
  UNION ALL SELECT 'Mel',    'consulta',     0, 180.00, 'Consulta de rotina e exame de sangue.',             'em_andamento'
  UNION ALL SELECT 'Mel',    'hospedagem',   9, 240.00, 'Hospedagem de 3 diárias durante viagem da família.', 'agendado'
  UNION ALL SELECT 'Paçoca', 'consulta',    -7, 200.00, 'Check-up geriátrico.',                              'concluido'
  UNION ALL SELECT 'Paçoca', 'banho',        1,  65.00, 'Banho com hidratação.',                             'agendado'
  UNION ALL SELECT 'Kiwi',   'outro',       -3,  45.00, 'Corte de unhas e lixamento do bico.',               'concluido'
  UNION ALL SELECT 'Nina',   'vacinacao',    5,  95.00, 'Primeira dose da antirrábica.',                     'agendado'
) AS s
JOIN animais a ON a.nome = s.animal;

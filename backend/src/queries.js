// Colunas do banco petshop_db com os nomes que a API e o app usam:
// animais.tutor vira tutor_nome e servicos.observacoes vira descricao.
const COLUNAS_ANIMAL = `
  a.id, a.nome, a.especie, a.raca, a.idade,
  a.tutor AS tutor_nome, a.telefone, a.observacoes`;

const COLUNAS_SERVICO = `
  s.id, s.animal_id, s.tipo, s.data, s.valor,
  s.observacoes AS descricao, s.status`;

// Serviço com os dados do animal relacionado (usado em listagens, detalhes e no resumo).
const SELECT_SERVICO = `
  SELECT ${COLUNAS_SERVICO},
         a.nome AS animal_nome, a.especie AS animal_especie,
         a.tutor AS tutor_nome, a.telefone AS tutor_telefone
  FROM servicos s
  JOIN animais a ON a.id = s.animal_id`;

module.exports = { COLUNAS_ANIMAL, COLUNAS_SERVICO, SELECT_SERVICO };

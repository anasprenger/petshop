const TIPOS = ['banho', 'tosa', 'consulta', 'vacinacao', 'hospedagem', 'outro'];
const STATUS = ['agendado', 'em_andamento', 'concluido'];

const texto = (valor) => (valor === undefined || valor === null ? '' : String(valor).trim());
const vazio = (valor) => valor === undefined || valor === null || valor === '';

// Aceita apenas 'AAAA-MM-DD' que exista no calendário.
function dataValida(valor) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const [ano, mes, dia] = valor.split('-').map(Number);
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  return data.getUTCFullYear() === ano && data.getUTCMonth() === mes - 1 && data.getUTCDate() === dia;
}

function validarAnimal(body = {}) {
  const dados = {
    nome: texto(body.nome),
    especie: texto(body.especie),
    raca: texto(body.raca) || null,
    idade: vazio(body.idade) ? null : Number(body.idade),
    tutor_nome: texto(body.tutor_nome),
    telefone: texto(body.telefone),
    observacoes: texto(body.observacoes) || null,
  };
  const campos = {};

  if (!dados.nome) campos.nome = 'Informe o nome do animal.';
  else if (dados.nome.length > 100) campos.nome = 'Use no máximo 100 caracteres.';

  if (!dados.especie) campos.especie = 'Informe a espécie.';
  else if (dados.especie.length > 50) campos.especie = 'Use no máximo 50 caracteres.';

  if (dados.raca && dados.raca.length > 100) campos.raca = 'Use no máximo 100 caracteres.';

  if (dados.idade !== null && (!Number.isInteger(dados.idade) || dados.idade < 0 || dados.idade > 40)) {
    campos.idade = 'A idade deve ser um número inteiro entre 0 e 40.';
  }

  if (!dados.tutor_nome) campos.tutor_nome = 'Informe o nome do tutor.';
  else if (dados.tutor_nome.length > 100) campos.tutor_nome = 'Use no máximo 100 caracteres.';

  const digitos = dados.telefone.replace(/\D/g, '');
  if (!dados.telefone) campos.telefone = 'Informe o telefone do tutor.';
  else if (digitos.length < 10 || digitos.length > 13 || dados.telefone.length > 20) {
    campos.telefone = 'Informe um telefone válido com DDD.';
  }

  if (dados.observacoes && dados.observacoes.length > 500) campos.observacoes = 'Use no máximo 500 caracteres.';

  return { dados, campos };
}

function validarServico(body = {}) {
  const dados = {
    animal_id: Number(body.animal_id),
    tipo: texto(body.tipo),
    data: texto(body.data),
    valor: vazio(body.valor) ? NaN : Number(body.valor),
    descricao: texto(body.descricao) || null,
    status: texto(body.status),
  };
  const campos = {};

  if (!Number.isInteger(dados.animal_id) || dados.animal_id <= 0) campos.animal_id = 'Selecione o animal.';
  if (!TIPOS.includes(dados.tipo)) campos.tipo = 'Escolha um tipo de serviço válido.';

  if (!dados.data) campos.data = 'Informe a data.';
  else if (!dataValida(dados.data)) campos.data = 'Use uma data válida no formato AAAA-MM-DD.';

  if (!Number.isFinite(dados.valor) || dados.valor < 0 || dados.valor > 99999999.99) {
    campos.valor = 'Informe um valor válido, igual ou maior que zero.';
  } else {
    dados.valor = Math.round(dados.valor * 100) / 100;
  }

  if (!STATUS.includes(dados.status)) campos.status = 'Escolha um status válido.';
  if (dados.descricao && dados.descricao.length > 500) campos.descricao = 'Use no máximo 500 caracteres.';

  return { dados, campos };
}

// Converte o :id da URL em inteiro positivo (ou null se for inválido).
function lerId(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

const temErros = (campos) => Object.keys(campos).length > 0;

module.exports = { TIPOS, STATUS, validarAnimal, validarServico, lerId, temErros };

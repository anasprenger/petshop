import { brToISO, hojeISO, isoToBR, maskPhone, moneyToInput, parseMoney } from './format';

/* ---------- Animal ---------- */

export function animalParaForm(animal) {
  return {
    nome: animal?.nome ?? '',
    especie: animal?.especie ?? '',
    raca: animal?.raca ?? '',
    idade: animal?.idade === null || animal?.idade === undefined ? '' : String(animal.idade),
    tutor_nome: animal?.tutor_nome ?? '',
    telefone: maskPhone(animal?.telefone ?? ''),
    observacoes: animal?.observacoes ?? '',
  };
}

export function validarAnimal(form) {
  const erros = {};
  if (!form.nome.trim()) erros.nome = 'Informe o nome do animal.';
  if (!form.especie) erros.especie = 'Escolha a espécie.';
  if (form.idade !== '' && Number(form.idade) > 40) erros.idade = 'Use um número entre 0 e 40.';
  if (!form.tutor_nome.trim()) erros.tutor_nome = 'Informe o nome do tutor.';
  const digitos = form.telefone.replace(/\D/g, '');
  if (!digitos) erros.telefone = 'Informe o telefone do tutor.';
  else if (digitos.length < 10) erros.telefone = 'Inclua o DDD, como em (11) 98765-4321.';
  return erros;
}

export function animalPayload(form) {
  return {
    nome: form.nome.trim(),
    especie: form.especie,
    raca: form.raca.trim() || null,
    idade: form.idade === '' ? null : Number(form.idade),
    tutor_nome: form.tutor_nome.trim(),
    telefone: form.telefone.trim(),
    observacoes: form.observacoes.trim() || null,
  };
}

/* ---------- Serviço ---------- */

export function servicoParaForm(servico, animalId) {
  return {
    animal_id: servico?.animal_id ?? animalId ?? null,
    tipo: servico?.tipo ?? '',
    data: isoToBR(servico?.data ?? hojeISO()),
    valor: servico ? moneyToInput(servico.valor) : '',
    status: servico?.status ?? 'agendado',
    descricao: servico?.descricao ?? '',
  };
}

export function validarServico(form) {
  const erros = {};
  if (!form.animal_id) erros.animal_id = 'Selecione o animal atendido.';
  if (!form.tipo) erros.tipo = 'Escolha o tipo de serviço.';
  if (!form.data) erros.data = 'Informe a data.';
  else if (!brToISO(form.data)) erros.data = 'Use uma data válida no formato DD/MM/AAAA.';
  if (!form.valor) erros.valor = 'Informe o valor.';
  else if (Number.isNaN(parseMoney(form.valor))) erros.valor = 'Use um valor válido, como 80,00.';
  if (!form.status) erros.status = 'Escolha o status.';
  return erros;
}

export function servicoPayload(form) {
  return {
    animal_id: Number(form.animal_id),
    tipo: form.tipo,
    data: brToISO(form.data),
    valor: parseMoney(form.valor),
    status: form.status,
    descricao: form.descricao.trim() || null,
  };
}

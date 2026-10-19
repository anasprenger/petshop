const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const MESES_LONGOS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

const doisDigitos = (n) => String(n).padStart(2, '0');

export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function toISO(date) {
  return `${date.getFullYear()}-${doisDigitos(date.getMonth() + 1)}-${doisDigitos(date.getDate())}`;
}

export const hojeISO = () => toISO(new Date());

// 'AAAA-MM-DD' -> Date local (sem deslocamento de fuso)
export function parseISO(iso) {
  const [ano, mes, dia] = iso.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

export function formatDate(iso) {
  const d = parseISO(iso);
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateLong(iso) {
  const d = parseISO(iso);
  return capitalize(`${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES_LONGOS[d.getMonth()]} de ${d.getFullYear()}`);
}

export function formatToday() {
  const d = new Date();
  return capitalize(`${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES_LONGOS[d.getMonth()]}`);
}

export function relativeDay(iso) {
  const diff = Math.round((parseISO(iso) - parseISO(hojeISO())) / 86400000);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Amanhã';
  if (diff === -1) return 'Ontem';
  return formatDate(iso);
}

export function formatMoney(valor) {
  const [inteiro, centavos] = (Number(valor) || 0).toFixed(2).split('.');
  return `R$ ${inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${centavos}`;
}

export function formatAge(idade) {
  if (idade === null || idade === undefined || idade === '') return '';
  const n = Number(idade);
  if (n === 0) return 'menos de 1 ano';
  return n === 1 ? '1 ano' : `${n} anos`;
}

/* ---------- Máscaras dos campos de formulário ---------- */

export function maskPhone(valor) {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function maskDate(valor) {
  const d = valor.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

// Mantém só dígitos e uma vírgula com até 2 casas (o ponto do teclado vira vírgula)
export function maskMoney(valor) {
  const [inteiro, ...resto] = valor.replace(/\./g, ',').replace(/[^\d,]/g, '').split(',');
  return resto.length ? `${inteiro},${resto.join('').slice(0, 2)}` : inteiro;
}

export const maskAge = (valor) => valor.replace(/\D/g, '').slice(0, 2);

/* ---------- Conversões entre formulário e API ---------- */

// 'DD/MM/AAAA' -> 'AAAA-MM-DD' (ou null se a data não existir)
export function brToISO(br) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(br || '');
  if (!m) return null;
  const [, dia, mes, ano] = m;
  const d = new Date(Number(ano), Number(mes) - 1, Number(dia));
  if (d.getFullYear() !== Number(ano) || d.getMonth() !== Number(mes) - 1 || d.getDate() !== Number(dia)) return null;
  return `${ano}-${mes}-${dia}`;
}

export function isoToBR(iso) {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

// '80,5' -> 80.5 (NaN se inválido)
export function parseMoney(valor) {
  const s = String(valor ?? '').trim();
  if (!/^\d+(,\d{1,2})?$/.test(s)) return NaN;
  return Number(s.replace(',', '.'));
}

export const moneyToInput = (valor) => Number(valor).toFixed(2).replace('.', ',');

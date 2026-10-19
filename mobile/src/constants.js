// Valores aceitos pela API (iguais aos ENUMs do MySQL) e como aparecem na tela.
export const TIPOS = [
  { value: 'banho', label: 'Banho', icon: 'water-outline', color: '#2F72CF', bg: '#E6F0FC' },
  { value: 'tosa', label: 'Tosa', icon: 'cut-outline', color: '#C74B7D', bg: '#FBE7EF' },
  { value: 'consulta', label: 'Consulta veterinária', short: 'Consulta', icon: 'medkit-outline', color: '#C2531F', bg: '#FDEDE3' },
  { value: 'vacinacao', label: 'Vacinação', icon: 'shield-checkmark-outline', color: '#1F8547', bg: '#E3F5E9' },
  { value: 'hospedagem', label: 'Hospedagem', icon: 'bed-outline', color: '#6A52C4', bg: '#EEE9FB' },
  { value: 'outro', label: 'Outro', icon: 'ellipsis-horizontal-circle-outline', color: '#6F676B', bg: '#EFECEE' },
];

export const STATUS = [
  { value: 'agendado', label: 'Agendado', plural: 'Agendados', color: '#2F64D6', bg: '#E8EFFD' },
  { value: 'em_andamento', label: 'Em andamento', plural: 'Em andamento', color: '#A35F00', bg: '#FFF1D9' },
  { value: 'concluido', label: 'Concluído', plural: 'Concluídos', color: '#1F8547', bg: '#E3F5E9' },
];

export const ESPECIES = ['Cachorro', 'Gato', 'Ave', 'Roedor', 'Réptil', 'Outro'];

const CORES_ESPECIE = {
  Cachorro: { color: '#B8436F', bg: '#FBE3EC' },
  Gato: { color: '#6A52C4', bg: '#EEE9FB' },
  Ave: { color: '#1F7F64', bg: '#E1F4EC' },
  Roedor: { color: '#B05C1A', bg: '#FDEEE1' },
  Réptil: { color: '#4C7A22', bg: '#EAF4DF' },
  Outro: { color: '#6F676B', bg: '#EFECEE' },
};

export const tipoInfo = (value) => TIPOS.find((t) => t.value === value) || TIPOS[TIPOS.length - 1];
export const statusInfo = (value) => STATUS.find((s) => s.value === value) || STATUS[0];
export const coresEspecie = (especie) => CORES_ESPECIE[especie] || CORES_ESPECIE.Outro;

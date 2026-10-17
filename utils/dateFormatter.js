export function dataParaTela(data) {
  if (!data) return "";

  const valor = String(data).slice(0, 10);

  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    const [ano, mes, dia] = valor.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  return valor;
}

export function dataParaBanco(data) {
  const valor = String(data || "").trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return valor;
  }

  const partes = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (partes) {
    return `${partes[3]}-${partes[2]}-${partes[1]}`;
  }

  return null;
}

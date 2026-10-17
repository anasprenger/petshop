const API_URL = "http://localhost:3000";

export async function requisicao(caminho, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers: {
      "Content-Type": "application/json",
      ...(opcoes.headers || {}),
    },
  });

  const texto = await resposta.text();
  let dados = null;

  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      throw new Error(
        "A API nao retornou JSON. Confira se o backend esta rodando em http://localhost:3000."
      );
    }
  }

  if (!resposta.ok) {
    throw new Error(
      dados?.erro ||
        dados?.mensagem ||
        `Erro na requisicao (${resposta.status}).`
    );
  }

  return dados;
}

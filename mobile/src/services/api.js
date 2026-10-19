import { API_URL, REQUEST_TIMEOUT_MS } from '../config';

// Erro com a mensagem pronta para exibir e, quando houver, os erros por campo enviados pela API.
export class ApiError extends Error {
  constructor(message, status = 0, campos = null) {
    super(message);
    this.status = status;
    this.campos = campos;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    throw new ApiError(
      err.name === 'AbortError'
        ? 'O servidor demorou para responder. Tente novamente.'
        : 'Não foi possível conectar ao servidor. Verifique a conexão e o endereço da API.',
    );
  } finally {
    clearTimeout(timer);
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null; // resposta sem corpo JSON
  }

  if (!response.ok) {
    const mensagem = data?.erro || `O servidor respondeu com erro ${response.status}.`;
    throw new ApiError(mensagem, response.status, data?.campos ?? null);
  }
  return data;
}

export const api = {
  resumo: () => request('/resumo'),

  listarAnimais: () => request('/animais'),
  buscarAnimal: (id) => request(`/animais/${id}`),
  criarAnimal: (dados) => request('/animais', { method: 'POST', body: dados }),
  atualizarAnimal: (id, dados) => request(`/animais/${id}`, { method: 'PUT', body: dados }),
  excluirAnimal: (id) => request(`/animais/${id}`, { method: 'DELETE' }),

  listarServicos: () => request('/servicos'),
  buscarServico: (id) => request(`/servicos/${id}`),
  criarServico: (dados) => request('/servicos', { method: 'POST', body: dados }),
  atualizarServico: (id, dados) => request(`/servicos/${id}`, { method: 'PUT', body: dados }),
  excluirServico: (id) => request(`/servicos/${id}`, { method: 'DELETE' }),
};

// Endereço da API REST (backend/). Defina EXPO_PUBLIC_API_URL no arquivo .env:
// - celular físico: IP do computador na rede, ex.: http://192.168.0.10:3000/api
// - emulador Android: http://10.0.2.2:3000/api
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Tempo máximo de espera por uma resposta da API
export const REQUEST_TIMEOUT_MS = 10000;

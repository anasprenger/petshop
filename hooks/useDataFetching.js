import { useEffect, useState } from "react";
import { requisicao } from "../utils/api";
import { normalizarAnimal, normalizarServico } from "../utils/normalizers";

export function useDataFetching() {
  const [animais, setAnimais] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarDados() {
    setErro("");

    try {
      const [animaisApi, servicosApi] = await Promise.all([
        requisicao("/animais"),
        requisicao("/servicos"),
      ]);

      setAnimais(animaisApi.map(normalizarAnimal));
      setServicos(servicosApi.map(normalizarServico));
    } catch (error) {
      setErro(error.message || "Nao foi possivel carregar os dados.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  return { animais, servicos, carregando, erro, carregarDados, requisicao };
}

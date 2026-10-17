import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDataFetching } from "./hooks/useDataFetching";
import { useFormModal } from "./hooks/useFormModal";
import { AnimalCard } from "./components/Cards/AnimalCard";
import { ServicoCard } from "./components/Cards/ServicoCard";
import { FormModal } from "./components/Forms/FormModal";
import { requisicao } from "./utils/api";
import { dataParaBanco } from "./utils/dateFormatter";
import { cores } from "./styles/colors";

export default function App() {
  const { animais, servicos, carregando, erro, carregarDados, requisicao: api } = useDataFetching();
  const [aba, setAba] = useState("animais");
  const [filtroAnimalId, setFiltroAnimalId] = useState(null);
  const {
    modal,
    setModal,
    editando,
    form,
    atualizarCampo,
    abrirCadastro,
    abrirEdicao,
    fecharModal,
  } = useFormModal(aba, animais);

  async function salvar() {
    try {
      if (aba === "animais") {
        if (!form.nome?.trim() || !form.especie?.trim() || !form.tutor?.trim()) {
          Alert.alert("Atencao", "Informe o nome do animal, a especie e o nome do tutor.");
          return;
        }

        const dados = {
          nome: form.nome.trim(),
          especie: form.especie,
          raca: form.raca?.trim() || null,
          idade: form.idade === "" ? null : Number(form.idade),
          tutor: form.tutor.trim(),
          telefone: form.telefone?.trim() || null,
        };

        if (dados.idade !== null && (!Number.isInteger(dados.idade) || dados.idade < 0)) {
          Alert.alert("Atencao", "Informe uma idade valida em anos.");
          return;
        }

        await api(editando ? `/animais/${editando}` : "/animais", {
          method: editando ? "PUT" : "POST",
          body: JSON.stringify(dados),
        });
      } else {
        if (!form.animalId || !form.data?.trim() || form.valor === "" || !form.tipo) {
          Alert.alert("Atencao", "Selecione um animal e informe o tipo de servico, a data e o valor.");
          return;
        }

        const dataBanco = dataParaBanco(form.data);

        if (!dataBanco) {
          Alert.alert("Data invalida", "Informe a data como DD/MM/AAAA ou AAAA-MM-DD.");
          return;
        }

        const valor = Number(String(form.valor).replace(",", "."));

        if (!Number.isFinite(valor) || valor < 0) {
          Alert.alert("Atencao", "Informe um valor valido.");
          return;
        }

        const dados = {
          animal_id: Number(form.animalId),
          tipo: form.tipo,
          data: dataBanco,
          valor,
          status: form.status || "Agendado",
          observacoes: form.observacoes?.trim() || null,
        };

        await api(editando ? `/servicos/${editando}` : "/servicos", {
          method: editando ? "PUT" : "POST",
          body: JSON.stringify(dados),
        });
      }

      fecharModal();
      await carregarDados();

      Alert.alert("Sucesso", editando ? "Registro atualizado." : "Registro cadastrado.");
    } catch (error) {
      Alert.alert("Nao foi possivel salvar", error.message || "Verifique a conexao com a API.");
    }
  }

  function excluir(item) {
    const nomeItem = aba === "animais" ? item.nome : item.tipo;

    Alert.alert("Confirmar exclusao", `Deseja excluir ${nomeItem}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const caminho = aba === "animais" ? `/animais/${item.id}` : `/servicos/${item.id}`;
            await api(caminho, { method: "DELETE" });

            if (aba === "animais" && filtroAnimalId === item.id) {
              setFiltroAnimalId(null);
            }

            await carregarDados();
            Alert.alert("Sucesso", "Registro excluido.");
          } catch (error) {
            Alert.alert("Nao foi possivel excluir", error.message || "Verifique a conexao com a API.");
          }
        },
      },
    ]);
  }

  function nomeAnimal(id) {
    return animais.find((animal) => String(animal.id) === String(id))?.nome || "Animal";
  }

  const servicosVisiveis = servicos.filter(
    (servico) => !filtroAnimalId || String(servico.animalId) === String(filtroAnimalId)
  );

  return (
    <View style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.cabecalho}>
          <Text style={styles.marca}>PET & CIA</Text>
          <Text style={styles.titulo}>Cuidado que vem do coração</Text>
          <Text style={styles.subtitulo}>Gerenciamento de animais e serviços</Text>
        </View>

        <View style={styles.resumo}>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoNumero}>{animais.length}</Text>
            <Text style={styles.resumoTexto}>Animais</Text>
          </View>

          <View style={styles.resumoCard}>
            <Text style={styles.resumoNumero}>{servicos.length}</Text>
            <Text style={styles.resumoTexto}>Serviços</Text>
          </View>
        </View>

        <View style={styles.navegacao}>
          {[
            { id: "animais", titulo: "Animais" },
            { id: "servicos", titulo: "Serviços" },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.aba, aba === item.id && styles.abaAtiva]}
              onPress={() => {
                setAba(item.id);
                setFiltroAnimalId(null);
              }}
            >
              <Text style={[styles.abaTexto, aba === item.id && styles.abaTextoAtivo]}>
                {item.titulo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.linhaTitulo}>
          <View style={styles.tituloSecaoContainer}>
            <Text style={styles.secaoTitulo}>
              {aba === "animais" ? "Nossos animais" : "Serviços realizados"}
            </Text>

            <Text style={[styles.subtitulo, { color: cores.texto }]}>
              {aba === "animais"
                ? "Gerencie os animais cadastrados"
                : filtroAnimalId
                ? `Atendimentos de ${nomeAnimal(filtroAnimalId)}`
                : "Acompanhe os atendimentos"}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.botaoPrincipal,
              aba === "servicos" && animais.length === 0 && styles.botaoDesativado,
            ]}
            onPress={abrirCadastro}
            disabled={aba === "servicos" && animais.length === 0}
          >
            <Text style={styles.botaoPrincipalTexto}>+ Novo</Text>
          </TouchableOpacity>
        </View>

        {carregando ? (
          <View style={styles.estado}>
            <ActivityIndicator size="large" color={cores.verde} />
            <Text style={styles.vazioTexto}>Carregando dados...</Text>
          </View>
        ) : erro ? (
          <View style={styles.estado}>
            <Text style={styles.erroTexto}>{erro}</Text>
            <TouchableOpacity style={styles.botaoPrincipal} onPress={carregarDados}>
              <Text style={styles.botaoPrincipalTexto}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : aba === "animais" ? (
          animais.length === 0 ? (
            <Text style={styles.vazio}>
              Nenhum animal cadastrado. Use "+ Novo" para comecar.
            </Text>
          ) : (
            animais.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                servicos={servicos}
                onViewServicos={() => {
                  setAba("servicos");
                  setFiltroAnimalId(animal.id);
                }}
                onEdit={() => {
                  setAba("animais");
                  abrirEdicao(animal);
                }}
                onDelete={() => excluir(animal)}
                setAba={setAba}
                setFiltroAnimalId={setFiltroAnimalId}
              />
            ))
          )
        ) : servicosVisiveis.length === 0 ? (
          <Text style={styles.vazio}>
            {filtroAnimalId
              ? "Nenhum servico registrado para este animal."
              : "Nenhum servico registrado."}
          </Text>
        ) : (
          servicosVisiveis.map((servico) => (
            <ServicoCard
              key={servico.id}
              servico={servico}
              nomeAnimal={nomeAnimal(servico.animalId)}
              onEdit={() => abrirEdicao(servico)}
              onDelete={() => excluir(servico)}
            />
          ))
        )}
      </ScrollView>

      <FormModal
        visible={modal}
        onClose={fecharModal}
        onSave={salvar}
        editando={editando}
        aba={aba}
        form={form}
        atualizarCampo={atualizarCampo}
        animais={animais}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    padding: 22,
    paddingBottom: 48,
  },
  cabecalho: {
    backgroundColor: cores.verde,
    borderRadius: 22,
    padding: 26,
    marginBottom: 18,
  },
  marca: {
    color: "#DDE9D3",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 3,
  },
  titulo: {
    color: cores.branco,
    fontSize: 28,
    fontWeight: "700",
    marginTop: 14,
  },
  subtitulo: {
    color: "#E8D4C8",
    fontSize: 13,
    marginTop: 5,
  },
  resumo: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  resumoCard: {
    flex: 1,
    backgroundColor: cores.branco,
    borderRadius: 16,
    padding: 18,
  },
  resumoNumero: {
    fontSize: 27,
    color: cores.verde,
    fontWeight: "700",
  },
  resumoTexto: {
    color: cores.marrom,
    marginTop: 4,
  },
  navegacao: {
    flexDirection: "row",
    backgroundColor: "#EAE7DE",
    padding: 5,
    borderRadius: 14,
    marginBottom: 24,
  },
  aba: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
  },
  abaAtiva: {
    backgroundColor: cores.branco,
  },
  abaTexto: {
    color: cores.marrom,
    fontWeight: "600",
  },
  abaTextoAtivo: {
    color: cores.verde,
  },
  linhaTitulo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  tituloSecaoContainer: {
    flex: 1,
  },
  secaoTitulo: {
    fontSize: 20,
    fontWeight: "700",
    color: cores.texto,
  },
  botaoPrincipal: {
    backgroundColor: cores.verde,
    borderRadius: 11,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  botaoDesativado: {
    opacity: 0.45,
  },
  botaoPrincipalTexto: {
    color: cores.branco,
    fontWeight: "700",
  },
  vazio: {
    textAlign: "center",
    color: cores.marrom,
    backgroundColor: cores.branco,
    padding: 28,
    borderRadius: 16,
  },
  estado: {
    alignItems: "center",
    gap: 14,
    backgroundColor: cores.branco,
    padding: 28,
    borderRadius: 16,
  },
  vazioTexto: {
    color: cores.marrom,
  },
  erroTexto: {
    color: cores.vermelho,
    textAlign: "center",
  },
});

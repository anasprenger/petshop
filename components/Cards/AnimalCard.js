import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { cores } from "../../styles/colors";

export function AnimalCard({ animal, servicos, onViewServicos, onEdit, onDelete, setAba, setFiltroAnimalId }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardCabecalho}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>
            {animal.nome.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardTitulo}>
            {animal.nome}
          </Text>

          <Text style={styles.cardDescricao}>
            {animal.especie} · {" "}
            {animal.raca || "Raca nao informada"}
          </Text>
        </View>
      </View>

      <View style={styles.divisor} />

      <Text style={styles.detalhe}>
        Tutor: {animal.tutor}
      </Text>

      <Text style={styles.detalhe}>
        Idade: {animal.idade || "Nao informada"}
      </Text>

      <Text style={styles.detalhe}>
        Servicos:{" "}
        {servicos.filter((s) => s.animalId === animal.id).length}
      </Text>

      <View style={styles.acoes}>
        <TouchableOpacity
          style={styles.botaoSecundario}
          onPress={() => {
            setAba("servicos");
            setFiltroAnimalId(animal.id);
          }}
        >
          <Text style={styles.botaoSecundarioTexto}>
            Ver servicos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoSecundario}
          onPress={() => onEdit(animal)}
        >
          <Text style={styles.botaoSecundarioTexto}>
            Editar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={() => onDelete(animal)}
        >
          <Text style={styles.botaoExcluirTexto}>
            Excluir
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 17,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E9E5DB",
  },
  cardCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: cores.verdeClaro,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTexto: {
    color: cores.verde,
    fontSize: 20,
    fontWeight: "700",
  },
  cardInfo: {
    flex: 1,
  },
  cardTitulo: {
    fontSize: 17,
    fontWeight: "700",
    color: cores.texto,
  },
  cardDescricao: {
    color: cores.marrom,
    marginTop: 4,
  },
  divisor: {
    height: 1,
    backgroundColor: "#EEEAE1",
    marginVertical: 14,
  },
  detalhe: {
    color: "#555A52",
    marginTop: 7,
    fontSize: 14,
  },
  acoes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  botaoSecundario: {
    backgroundColor: cores.verdeClaro,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 9,
  },
  botaoSecundarioTexto: {
    color: cores.verde,
    fontWeight: "600",
  },
  botaoExcluir: {
    backgroundColor: "#F8E8E5",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 9,
  },
  botaoExcluirTexto: {
    color: cores.vermelho,
    fontWeight: "600",
  },
});

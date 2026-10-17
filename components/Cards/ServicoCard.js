import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { cores } from "../../styles/colors";

export function ServicoCard({ servico, nomeAnimal, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitulo}>
        {servico.tipo}
      </Text>

      <Text style={styles.cardDescricao}>
        Animal: {nomeAnimal}
      </Text>

      <Text style={styles.detalhe}>
        Data: {servico.data}
      </Text>

      <Text style={styles.detalhe}>
        Valor:{" "}
        {Number(servico.valor).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </Text>

      <View style={styles.status}>
        <Text style={styles.statusTexto}>
          {servico.status}
        </Text>
      </View>

      <View style={styles.acoes}>
        <TouchableOpacity
          style={styles.botaoSecundario}
          onPress={() => onEdit(servico)}
        >
          <Text style={styles.botaoSecundarioTexto}>
            Editar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={() => onDelete(servico)}
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
  cardTitulo: {
    fontSize: 17,
    fontWeight: "700",
    color: cores.texto,
  },
  cardDescricao: {
    color: cores.marrom,
    marginTop: 4,
  },
  detalhe: {
    color: "#555A52",
    marginTop: 7,
    fontSize: 14,
  },
  status: {
    alignSelf: "flex-start",
    backgroundColor: cores.verdeClaro,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  statusTexto: {
    color: cores.verde,
    fontWeight: "600",
    fontSize: 12,
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

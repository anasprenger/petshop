import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { ESPECIES, TIPOS_SERVICO, STATUS_SERVICO } from "../../constants/selectOptions";
import { cores } from "../../styles/colors";

export function FormModal({
  visible,
  onClose,
  onSave,
  editando,
  aba,
  form,
  atualizarCampo,
  animais,
}) {
  const renderField = (rotulo, chave, placeholder = "") => (
    <View style={styles.campo} key={chave}>
      <Text style={styles.rotulo}>{rotulo}</Text>

      <TextInput
        style={styles.input}
        value={String(form[chave] ?? "")}
        onChangeText={(valor) => atualizarCampo(chave, valor)}
        placeholder={placeholder || rotulo}
        placeholderTextColor="#999999"
      />
    </View>
  );

  const renderOptions = (rotulo, chave, valores) => (
    <View style={styles.campo} key={chave}>
      <Text style={styles.rotulo}>{rotulo}</Text>

      <View style={styles.opcoes}>
        {valores.map((valor) => (
          <TouchableOpacity
            key={valor}
            style={[
              styles.opcao,
              form[chave] === valor && styles.opcaoSelecionada,
            ]}
            onPress={() => atualizarCampo(chave, valor)}
          >
            <Text
              style={[
                styles.opcaoTexto,
                form[chave] === valor &&
                  styles.opcaoTextoSelecionado,
              ]}
            >
              {valor}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.fundoModal}>
        <View style={styles.modal}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={styles.secaoTitulo}>
              {editando ? "Editar" : "Cadastrar"}{" "}
              {aba === "animais" ? "animal" : "servico"}
            </Text>

            {aba === "animais" ? (
              <>
                {renderField("Nome do animal", "nome")}

                {renderOptions("Especie", "especie", ESPECIES)}

                {renderField("Raca", "raca")}
                {renderField("Idade", "idade", "Idade em anos")}
                {renderField("Nome do tutor", "tutor")}
                {renderField("Telefone do tutor", "telefone")}
              </>
            ) : (
              <>
                <Text style={styles.rotulo}>Animal</Text>

                {animais.map((animal) => (
                  <TouchableOpacity
                    key={animal.id}
                    style={[
                      styles.seletorAnimal,
                      String(form.animalId) === animal.id &&
                        styles.opcaoSelecionada,
                    ]}
                    onPress={() =>
                      atualizarCampo("animalId", animal.id)
                    }
                  >
                    <Text>
                      {animal.nome} — {animal.especie}
                    </Text>
                  </TouchableOpacity>
                ))}

                {renderOptions("Tipo de servico", "tipo", TIPOS_SERVICO)}

                {renderField("Data", "data", "DD/MM/AAAA")}
                {renderField("Valor (R$)", "valor", "Ex.: 80,00")}

                {renderOptions("Status", "status", STATUS_SERVICO)}

                {renderField("Observacoes (opcional)", "observacoes")}
              </>
            )}

            <TouchableOpacity
              style={styles.botaoSalvar}
              onPress={onSave}
            >
              <Text style={styles.botaoSalvarTexto}>
                {editando ? "Salvar alteracoes" : "Cadastrar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={onClose}
            >
              <Text style={styles.botaoCancelarTexto}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundoModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    backgroundColor: cores.fundo,
    borderRadius: 20,
    padding: 22,
    maxHeight: "90%",
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },
  secaoTitulo: {
    fontSize: 20,
    fontWeight: "700",
    color: cores.texto,
  },
  campo: {
    marginTop: 15,
  },
  rotulo: {
    fontWeight: "600",
    color: cores.texto,
    marginBottom: 7,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DEDCCF",
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontSize: 15,
    color: cores.texto,
  },
  opcoes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  opcao: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#DEDCCF",
  },
  opcaoSelecionada: {
    backgroundColor: cores.verdeClaro,
    borderColor: cores.verde,
  },
  opcaoTexto: {
    color: cores.texto,
    fontSize: 13,
  },
  opcaoTextoSelecionado: {
    color: cores.verde,
    fontWeight: "700",
  },
  seletorAnimal: {
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DEDCCF",
    borderRadius: 9,
    marginTop: 7,
  },
  botaoSalvar: {
    marginTop: 24,
    backgroundColor: cores.verde,
    borderRadius: 11,
    padding: 15,
    alignItems: "center",
  },
  botaoSalvarTexto: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  botaoCancelar: {
    alignItems: "center",
    padding: 14,
  },
  botaoCancelarTexto: {
    color: cores.marrom,
    fontWeight: "600",
  },
});

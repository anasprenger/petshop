import { useHeaderHeight } from '@react-navigation/elements';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button, { CancelButton } from '../components/Button';
import { ChoiceField, FormBanner, FormCard, TextField } from '../components/Form';
import { ErrorState, LoadingState } from '../components/States';
import { useToast } from '../components/Toast';
import { ESPECIES } from '../constants';
import { api } from '../services/api';
import { colors } from '../theme';
import { maskAge, maskPhone } from '../utils/format';
import { animalPayload, animalParaForm, validarAnimal } from '../utils/validation';

const OPCOES_ESPECIE = ESPECIES.map((e) => ({ value: e, label: e }));

export default function AnimalFormScreen({ route, navigation }) {
  const id = route.params?.id;
  const toast = useToast();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);

  const [form, setForm] = useState(animalParaForm(null));
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState(null);
  const [carregando, setCarregando] = useState(Boolean(id));
  const [erroCarga, setErroCarga] = useState(null);
  const [salvando, setSalvando] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: id ? 'Editar animal' : 'Novo animal',
      headerLeft: () => <CancelButton onPress={() => navigation.goBack()} />,
    });
  }, [navigation, id]);

  // Na edição, preenche o formulário com os dados atuais do animal
  const carregar = useCallback(async () => {
    if (!id) return;
    setCarregando(true);
    setErroCarga(null);
    try {
      setForm(animalParaForm(await api.buscarAnimal(id)));
    } catch (err) {
      setErroCarga(err.message);
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function alterar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => {
      if (!atual[campo]) return atual;
      const { [campo]: _removido, ...resto } = atual;
      return resto;
    });
  }

  async function salvar() {
    const encontrados = validarAnimal(form);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) {
      setErroGeral('Confira os campos destacados.');
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    setErroGeral(null);
    setSalvando(true);
    try {
      const dados = animalPayload(form);
      if (id) await api.atualizarAnimal(id, dados);
      else await api.criarAnimal(dados);
      toast.show(id ? 'Alterações salvas' : 'Animal cadastrado');
      navigation.goBack();
    } catch (err) {
      setSalvando(false);
      setErroGeral(err.message);
      if (err.campos) setErros(err.campos);
    }
  }

  if (carregando) return <LoadingState />;
  if (erroCarga) return <ErrorState message={erroCarga} onRetry={carregar} />;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {erroGeral && <FormBanner message={erroGeral} />}

        <FormCard>
          <TextField label="Nome" required value={form.nome} onChangeText={(v) => alterar('nome', v)}
            placeholder="Ex.: Thor" maxLength={80} error={erros.nome} />
          <ChoiceField label="Espécie" required options={OPCOES_ESPECIE} value={form.especie}
            onChange={(v) => alterar('especie', v)} error={erros.especie} />
          <TextField label="Raça" value={form.raca} onChangeText={(v) => alterar('raca', v)}
            placeholder="Ex.: Golden Retriever" maxLength={60} error={erros.raca} />
          <TextField label="Idade" value={form.idade} onChangeText={(v) => alterar('idade', maskAge(v))}
            placeholder="0" keyboardType="number-pad" suffix="anos" error={erros.idade} />
        </FormCard>

        <FormCard title="Tutor">
          <TextField label="Nome do tutor" required value={form.tutor_nome} onChangeText={(v) => alterar('tutor_nome', v)}
            placeholder="Ex.: Mariana Costa" maxLength={100} autoCapitalize="words" error={erros.tutor_nome} />
          <TextField label="Telefone" required value={form.telefone} onChangeText={(v) => alterar('telefone', maskPhone(v))}
            placeholder="(11) 98765-4321" keyboardType="phone-pad" error={erros.telefone} />
        </FormCard>

        <FormCard>
          <TextField label="Observações" value={form.observacoes} onChangeText={(v) => alterar('observacoes', v)}
            placeholder="Alergias, comportamento, cuidados especiais…" multiline maxLength={500} error={erros.observacoes} />
        </FormCard>

        <Text style={styles.hint}>
          <Text style={{ color: colors.rose }}>*</Text> Campos obrigatórios
        </Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Button
          title={salvando ? 'Salvando…' : id ? 'Salvar alterações' : 'Cadastrar animal'}
          loading={salvando}
          onPress={salvar}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, gap: 22 },
  hint: { marginTop: -8, paddingHorizontal: 4, fontSize: 13, color: colors.ink2 },
  footer: {
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.canvas,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
});

import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimalPicker from '../components/AnimalPicker';
import { AnimalAvatar } from '../components/Badges';
import Button, { CancelButton } from '../components/Button';
import { ChoiceField, Field, FormBanner, FormCard, TextField } from '../components/Form';
import { EmptyState, ErrorState, LoadingState } from '../components/States';
import { useToast } from '../components/Toast';
import { STATUS, TIPOS } from '../constants';
import { useFocusData } from '../hooks/useFocusData';
import { api } from '../services/api';
import { colors } from '../theme';
import { maskDate, maskMoney } from '../utils/format';
import { servicoParaForm, servicoPayload, validarServico } from '../utils/validation';

const OPCOES_TIPO = TIPOS.map((t) => ({ value: t.value, label: t.label, icon: t.icon }));
const OPCOES_STATUS = STATUS.map((s) => ({ value: s.value, label: s.label }));

export default function ServiceFormScreen({ route, navigation }) {
  const id = route.params?.id;
  const animalInicial = route.params?.animalId;
  const toast = useToast();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);

  // Lista de animais (recarregada ao voltar para a tela) e, na edição, o serviço atual
  const loader = useCallback(async () => {
    const [animais, servico] = await Promise.all([api.listarAnimais(), id ? api.buscarServico(id) : null]);
    return { animais, servico };
  }, [id]);
  const { data, error, loading, retry } = useFocusData(loader);

  const [form, setForm] = useState(null);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [seletorAberto, setSeletorAberto] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: id ? 'Editar serviço' : 'Novo serviço',
      headerLeft: () => <CancelButton onPress={() => navigation.goBack()} />,
    });
  }, [navigation, id]);

  useEffect(() => {
    if (data && !form) setForm(servicoParaForm(data.servico, animalInicial));
  }, [data, form, animalInicial]);

  function alterar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => {
      if (!atual[campo]) return atual;
      const { [campo]: _removido, ...resto } = atual;
      return resto;
    });
  }

  async function salvar() {
    const encontrados = validarServico(form);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) {
      setErroGeral('Confira os campos destacados.');
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    setErroGeral(null);
    setSalvando(true);
    try {
      const dados = servicoPayload(form);
      if (id) await api.atualizarServico(id, dados);
      else await api.criarServico(dados);
      toast.show(id ? 'Alterações salvas' : 'Serviço cadastrado');
      navigation.goBack();
    } catch (err) {
      setSalvando(false);
      setErroGeral(err.message);
      if (err.campos) setErros(err.campos);
    }
  }

  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (loading || !form) return <LoadingState />;

  if (data.animais.length === 0) {
    return (
      <EmptyState
        icon="paw-outline"
        title="Nenhum animal cadastrado"
        message="Cadastre um animal antes de registrar um serviço."
        action={<Button small icon="add" title="Cadastrar animal" onPress={() => navigation.navigate('AnimalForm')} />}
      />
    );
  }

  const animal = data.animais.find((a) => a.id === Number(form.animal_id));

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {erroGeral && <FormBanner message={erroGeral} />}

        <FormCard>
          <Field label="Animal" required error={erros.animal_id}>
            <Pressable
              onPress={() => setSeletorAberto(true)}
              accessibilityRole="button"
              accessibilityLabel={animal ? `Animal: ${animal.nome}. Toque para trocar` : 'Selecionar animal'}
              style={styles.select}
            >
              {animal ? (
                <>
                  <AnimalAvatar nome={animal.nome} especie={animal.especie} size={32} />
                  <View style={styles.selectText}>
                    <Text style={styles.selectName}>{animal.nome}</Text>
                    <Text style={styles.selectSub}>{animal.especie} · {animal.tutor_nome}</Text>
                  </View>
                </>
              ) : (
                <Text style={styles.placeholder}>Selecionar animal</Text>
              )}
              <Ionicons name="chevron-down" size={18} color={colors.ink3} />
            </Pressable>
          </Field>
          <ChoiceField label="Tipo de serviço" required variant="tiles" options={OPCOES_TIPO} value={form.tipo}
            onChange={(v) => alterar('tipo', v)} error={erros.tipo} />
        </FormCard>

        <FormCard>
          <TextField label="Data" required value={form.data} onChangeText={(v) => alterar('data', maskDate(v))}
            placeholder="DD/MM/AAAA" keyboardType="number-pad" maxLength={10} error={erros.data} />
          <TextField label="Valor" required value={form.valor} onChangeText={(v) => alterar('valor', maskMoney(v))}
            placeholder="0,00" keyboardType="decimal-pad" prefix="R$" maxLength={10} error={erros.valor} />
          <ChoiceField label="Status" required variant="segmented" options={OPCOES_STATUS} value={form.status}
            onChange={(v) => alterar('status', v)} error={erros.status} />
        </FormCard>

        <FormCard>
          <TextField label="Descrição" value={form.descricao} onChangeText={(v) => alterar('descricao', v)}
            placeholder="Detalhes do atendimento…" multiline maxLength={500} error={erros.descricao} />
        </FormCard>

        <Text style={styles.hint}>
          <Text style={{ color: colors.rose }}>*</Text> Campos obrigatórios
        </Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Button
          title={salvando ? 'Salvando…' : id ? 'Salvar alterações' : 'Cadastrar serviço'}
          loading={salvando}
          onPress={salvar}
        />
      </View>

      <AnimalPicker
        visible={seletorAberto}
        animais={data.animais}
        selectedId={Number(form.animal_id)}
        onClose={() => setSeletorAberto(false)}
        onSelect={(animalId) => {
          alterar('animal_id', animalId);
          setSeletorAberto(false);
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, gap: 22 },
  select: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  selectText: { flex: 1 },
  selectName: { fontSize: 16, fontWeight: '600', color: colors.ink },
  selectSub: { fontSize: 13, color: colors.ink2 },
  placeholder: { flex: 1, fontSize: 17, color: colors.ink3 },
  hint: { marginTop: -8, paddingHorizontal: 4, fontSize: 13, color: colors.ink2 },
  footer: {
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.canvas,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
});

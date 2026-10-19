import { useCallback, useLayoutEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AnimalAvatar } from '../components/Badges';
import Button from '../components/Button';
import Group from '../components/Group';
import { InfoRow, ServiceRow } from '../components/Rows';
import { EmptyCard, ErrorState, LoadingState } from '../components/States';
import { useToast } from '../components/Toast';
import { useFocusData } from '../hooks/useFocusData';
import { api } from '../services/api';
import { colors, type } from '../theme';
import { confirmarExclusao } from '../utils/confirmar';
import { formatAge } from '../utils/format';

export default function AnimalDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const toast = useToast();
  const loader = useCallback(() => api.buscarAnimal(id), [id]);
  const { data: animal, error, loading, refreshing, retry, refresh } = useFocusData(loader);
  const [excluindo, setExcluindo] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: animal?.nome ?? '' });
  }, [navigation, animal?.nome]);

  function pedirConfirmacao() {
    const total = animal.servicos.length;
    const aviso =
      total === 0 ? '' : total === 1
        ? 'O serviço do histórico também será excluído. '
        : `Os ${total} serviços do histórico também serão excluídos. `;
    confirmarExclusao({
      titulo: `Excluir ${animal.nome}?`,
      mensagem: `${aviso}Esta ação não pode ser desfeita.`,
      onConfirmar: excluir,
    });
  }

  async function excluir() {
    setExcluindo(true);
    try {
      await api.excluirAnimal(id);
      toast.show('Animal excluído');
      navigation.popToTop();
    } catch (err) {
      setExcluindo(false);
      toast.show(err.message, 'error');
    }
  }

  if (loading && !animal) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={retry} />;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.rose} />}
    >
      <View style={styles.hero}>
        <AnimalAvatar nome={animal.nome} especie={animal.especie} size={92} />
        <Text style={styles.name}>{animal.nome}</Text>
        <Text style={styles.meta}>{[animal.especie, animal.raca, formatAge(animal.idade)].filter(Boolean).join(' · ')}</Text>
        <View style={styles.actions}>
          <Button small variant="tinted" icon="create-outline" title="Editar" style={styles.flex}
            onPress={() => navigation.navigate('AnimalForm', { id })} />
          <Button small variant="tinted" icon="add" title="Novo serviço" style={styles.flex}
            onPress={() => navigation.navigate('ServiceForm', { animalId: id })} />
        </View>
      </View>

      <Group inset={58}>
        <InfoRow icon="person-outline" label="Tutor" value={animal.tutor_nome} />
        <InfoRow icon="call-outline" label="Telefone" value={animal.telefone || 'Não informado'} muted={!animal.telefone} />
        <InfoRow
          icon="document-text-outline"
          label="Observações"
          value={animal.observacoes || 'Nenhuma observação.'}
          muted={!animal.observacoes}
        />
      </Group>

      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Text style={type.sectionTitle}>Histórico de serviços</Text>
          <Text style={styles.count}>{animal.servicos.length}</Text>
        </View>
        {animal.servicos.length > 0 ? (
          <Group>
            {animal.servicos.map((s) => (
              <ServiceRow key={s.id} servico={s} showAnimal={false} onPress={() => navigation.push('ServiceDetail', { id: s.id })} />
            ))}
          </Group>
        ) : (
          <EmptyCard text={`Nenhum serviço registrado para ${animal.nome}.`} />
        )}
      </View>

      <Button
        variant="danger"
        icon="trash-outline"
        title={excluindo ? 'Excluindo…' : 'Excluir animal'}
        loading={excluindo}
        onPress={pedirConfirmacao}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40, gap: 24 },
  flex: { flex: 1 },
  hero: { alignItems: 'center', gap: 4 },
  name: { marginTop: 10, fontSize: 26, fontWeight: '700', letterSpacing: -0.5, color: colors.ink, textAlign: 'center' },
  meta: { fontSize: 15, color: colors.ink2, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 10, alignSelf: 'stretch', marginTop: 14 },
  section: { gap: 8 },
  sectionHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 4 },
  count: { fontSize: 15, color: colors.ink3 },
});

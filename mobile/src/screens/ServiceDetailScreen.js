import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusPill, TipoBadge } from '../components/Badges';
import Button from '../components/Button';
import Group from '../components/Group';
import { AnimalRow, InfoRow } from '../components/Rows';
import { ErrorState, LoadingState } from '../components/States';
import { useToast } from '../components/Toast';
import { tipoInfo } from '../constants';
import { useFocusData } from '../hooks/useFocusData';
import { api } from '../services/api';
import { colors, radius, shadow, type } from '../theme';
import { confirmarExclusao } from '../utils/confirmar';
import { formatDate, formatDateLong, formatMoney } from '../utils/format';

export default function ServiceDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const toast = useToast();
  const loader = useCallback(() => api.buscarServico(id), [id]);
  const { data: servico, error, loading, refreshing, retry, refresh } = useFocusData(loader);
  const [excluindo, setExcluindo] = useState(false);

  function pedirConfirmacao() {
    const tipo = tipoInfo(servico.tipo).label.toLowerCase();
    confirmarExclusao({
      titulo: `Excluir ${tipo} de ${servico.animal_nome}?`,
      mensagem: `Serviço de ${formatDate(servico.data)}. Esta ação não pode ser desfeita.`,
      onConfirmar: excluir,
    });
  }

  async function excluir() {
    setExcluindo(true);
    try {
      await api.excluirServico(id);
      toast.show('Serviço excluído');
      navigation.goBack();
    } catch (err) {
      setExcluindo(false);
      toast.show(err.message, 'error');
    }
  }

  if (loading && !servico) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={retry} />;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.rose} />}
    >
      <View style={[styles.hero, shadow]}>
        <TipoBadge tipo={servico.tipo} size={68} />
        <Text style={styles.title}>{tipoInfo(servico.tipo).label}</Text>
        <StatusPill status={servico.status} />
        <Text style={styles.value}>{formatMoney(servico.valor)}</Text>
        <Text style={styles.date}>{formatDateLong(servico.data)}</Text>
        <Button small variant="tinted" icon="create-outline" title="Editar serviço" style={styles.edit}
          onPress={() => navigation.navigate('ServiceForm', { id })} />
      </View>

      <View style={styles.section}>
        <Text style={[type.sectionTitle, styles.sectionTitle]}>Animal</Text>
        <Group>
          <AnimalRow
            animal={{ nome: servico.animal_nome, especie: servico.animal_especie, tutor_nome: servico.tutor_nome }}
            onPress={() => navigation.push('AnimalDetail', { id: servico.animal_id })}
          />
        </Group>
      </View>

      <Group inset={58}>
        <InfoRow
          icon="call-outline"
          label="Telefone do tutor"
          value={servico.tutor_telefone || 'Não informado'}
          muted={!servico.tutor_telefone}
        />
        <InfoRow
          icon="document-text-outline"
          label="Descrição"
          value={servico.descricao || 'Sem descrição.'}
          muted={!servico.descricao}
        />
      </Group>

      <Button
        variant="danger"
        icon="trash-outline"
        title={excluindo ? 'Excluindo…' : 'Excluir serviço'}
        loading={excluindo}
        onPress={pedirConfirmacao}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40, gap: 24 },
  hero: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 22,
    paddingBottom: 18,
    paddingHorizontal: 18,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  title: { marginTop: 6, fontSize: 24, fontWeight: '700', letterSpacing: -0.4, color: colors.ink, textAlign: 'center' },
  value: { marginTop: 6, fontSize: 34, fontWeight: '700', color: colors.ink, fontVariant: ['tabular-nums'] },
  date: { fontSize: 15, color: colors.ink2, textAlign: 'center' },
  edit: { alignSelf: 'stretch', marginTop: 8 },
  section: { gap: 8 },
  sectionTitle: { paddingHorizontal: 4 },
});

import { Ionicons } from '@expo/vector-icons';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button, { TextButton } from '../components/Button';
import Group from '../components/Group';
import { ServiceRow } from '../components/Rows';
import ScreenHeader from '../components/ScreenHeader';
import { EmptyCard, ErrorState, LoadingState } from '../components/States';
import { useFocusData } from '../hooks/useFocusData';
import { api } from '../services/api';
import { colors, radius, shadow, type } from '../theme';
import { formatMoney, formatToday } from '../utils/format';

const TONS = {
  rose: { bg: colors.blush, fg: colors.rose },
  info: { bg: colors.infoSoft, fg: colors.info },
  warn: { bg: colors.warnSoft, fg: colors.warn },
  ok: { bg: colors.okSoft, fg: colors.ok },
};

function StatCard({ icon, tone, value, label, onPress }) {
  const t = TONS[tone];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${value} ${label}`}
      style={({ pressed }) => [styles.stat, shadow, pressed && { transform: [{ scale: 0.98 }] }]}
    >
      <View style={styles.statTop}>
        <View style={[styles.statIcon, { backgroundColor: t.bg }]}>
          <Ionicons name={icon} size={19} color={t.fg} />
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.ink3} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Pressable>
  );
}

export default function HomeScreen({ navigation }) {
  const { data, error, loading, refreshing, retry, refresh } = useFocusData(api.resumo);

  const verServicos = (status) => navigation.navigate('Servicos', { status });
  const abrirServico = (id) => navigation.navigate('ServiceDetail', { id });

  let content;
  if (loading && !data) {
    content = <LoadingState />;
  } else if (error) {
    content = <ErrorState message={error} onRetry={retry} />;
  } else {
    content = (
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.rose} />}
      >
        <View style={styles.stats}>
          <View style={styles.statsRow}>
            <StatCard icon="paw" tone="rose" value={data.total_animais} label="Animais cadastrados" onPress={() => navigation.navigate('Animais')} />
            <StatCard icon="calendar-outline" tone="info" value={data.agendados} label="Agendados" onPress={() => verServicos('agendado')} />
          </View>
          <View style={styles.statsRow}>
            <StatCard icon="time-outline" tone="warn" value={data.em_andamento} label="Em andamento" onPress={() => verServicos('em_andamento')} />
            <StatCard icon="checkmark-circle-outline" tone="ok" value={data.concluidos} label="Concluídos" onPress={() => verServicos('concluido')} />
          </View>
        </View>

        <View style={styles.revenue}>
          <Text style={[type.overline, { color: colors.rose }]}>Faturamento</Text>
          <View style={styles.revenueRow}>
            <View style={styles.revenueItem}>
              <Text style={styles.revenueValue}>{formatMoney(data.receita_concluida)}</Text>
              <Text style={styles.revenueLabel}>Recebido</Text>
            </View>
            <View style={[styles.revenueItem, styles.revenueDivider]}>
              <Text style={styles.revenueValue}>{formatMoney(data.receita_prevista)}</Text>
              <Text style={styles.revenueLabel}>Previsto em aberto</Text>
            </View>
          </View>
        </View>

        <View style={styles.quick}>
          <Button title="Novo animal" icon="add" onPress={() => navigation.navigate('AnimalForm')} style={styles.flex} />
          <Button title="Novo serviço" icon="add" variant="tinted" onPress={() => navigation.navigate('ServiceForm')} style={styles.flex} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={type.sectionTitle}>Próximos agendamentos</Text>
            {data.proximos.length > 0 && <TextButton title="Ver todos" onPress={() => verServicos('agendado')} />}
          </View>
          {data.proximos.length > 0 ? (
            <Group>
              {data.proximos.map((s) => (
                <ServiceRow key={s.id} servico={s} onPress={() => abrirServico(s.id)} />
              ))}
            </Group>
          ) : (
            <EmptyCard text="Nenhum serviço agendado a partir de hoje." />
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="PetCare" eyebrow={formatToday()} />
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 32, gap: 24 },
  flex: { flex: 1 },
  stats: { gap: 12 },
  statsRow: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1, padding: 14, gap: 10, borderRadius: radius.lg, backgroundColor: colors.surface },
  statTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statIcon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 30, fontWeight: '700', color: colors.ink, fontVariant: ['tabular-nums'] },
  statLabel: { fontSize: 14, fontWeight: '500', color: colors.ink2 },
  revenue: {
    padding: 16,
    gap: 8,
    borderRadius: radius.lg,
    backgroundColor: colors.blush,
    borderWidth: 1,
    borderColor: colors.blushLine,
  },
  revenueRow: { flexDirection: 'row', gap: 14 },
  revenueItem: { flex: 1, gap: 2 },
  revenueDivider: { borderLeftWidth: 1, borderLeftColor: colors.blushLine, paddingLeft: 14 },
  revenueValue: { fontSize: 21, fontWeight: '700', color: colors.ink, fontVariant: ['tabular-nums'] },
  revenueLabel: { fontSize: 13, color: colors.ink2 },
  quick: { flexDirection: 'row', gap: 12 },
  section: { gap: 8 },
  sectionHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 4 },
});

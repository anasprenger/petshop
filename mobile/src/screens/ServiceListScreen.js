import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button, { IconButton } from '../components/Button';
import { GroupSeparator, groupItemStyle } from '../components/Group';
import { ServiceRow } from '../components/Rows';
import ScreenHeader from '../components/ScreenHeader';
import { EmptyCard, EmptyState, ErrorState, LoadingState } from '../components/States';
import { STATUS, statusInfo } from '../constants';
import { useFocusData } from '../hooks/useFocusData';
import { api } from '../services/api';
import { colors } from '../theme';

const FILTROS = [{ value: 'todos', label: 'Todos' }, ...STATUS.map((s) => ({ value: s.value, label: s.plural }))];

export default function ServiceListScreen({ navigation, route }) {
  const { data, error, loading, refreshing, retry, refresh } = useFocusData(api.listarServicos);
  const [filtro, setFiltro] = useState('todos');

  // Filtro vindo dos cartões da tela Início
  const statusRecebido = route.params?.status;
  useEffect(() => {
    if (statusRecebido) {
      setFiltro(statusRecebido);
      navigation.setParams({ status: undefined });
    }
  }, [statusRecebido, navigation]);

  const servicos = useMemo(
    () => (data ?? []).filter((s) => filtro === 'todos' || s.status === filtro),
    [data, filtro],
  );
  const contar = (valor) => (valor === 'todos' ? data.length : data.filter((s) => s.status === valor).length);
  const novoServico = () => navigation.navigate('ServiceForm');

  let content;
  if (loading && !data) {
    content = <LoadingState />;
  } else if (error) {
    content = <ErrorState message={error} onRetry={retry} />;
  } else {
    content = (
      <FlatList
        data={servicos}
        keyExtractor={(s) => String(s.id)}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.rose} />}
        ListHeaderComponent={
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filters}>
            {FILTROS.map((f) => {
              const ativo = f.value === filtro;
              return (
                <Pressable
                  key={f.value}
                  onPress={() => setFiltro(f.value)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: ativo }}
                  style={[styles.filter, ativo && styles.filterOn]}
                >
                  <Text style={[styles.filterText, ativo && styles.filterTextOn]}>{f.label}</Text>
                  <Text style={[styles.filterCount, ativo && styles.filterCountOn]}>{contar(f.value)}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        }
        ItemSeparatorComponent={GroupSeparator}
        renderItem={({ item, index }) => (
          <View style={groupItemStyle(index, servicos.length)}>
            <ServiceRow servico={item} onPress={() => navigation.navigate('ServiceDetail', { id: item.id })} />
          </View>
        )}
        ListEmptyComponent={
          data.length > 0 ? (
            <EmptyCard text={`Nenhum serviço com status “${statusInfo(filtro).label}”.`} />
          ) : (
            <EmptyState
              icon="calendar-outline"
              title="Nenhum serviço registrado"
              message="Cadastre banhos, tosas, consultas e outros atendimentos."
              action={<Button small icon="add" title="Novo serviço" onPress={novoServico} />}
            />
          )
        }
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Serviços" right={<IconButton icon="add" label="Cadastrar serviço" onPress={novoServico} />} />
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: 16, paddingBottom: 32 },
  filtersScroll: { marginHorizontal: -16, marginBottom: 16, marginTop: 4, flexGrow: 0 },
  filters: { paddingHorizontal: 16, gap: 8 },
  filter: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  filterOn: { backgroundColor: colors.rose, borderColor: colors.rose },
  filterText: { fontSize: 14, fontWeight: '500', color: colors.ink },
  filterTextOn: { color: colors.onRose },
  filterCount: { fontSize: 14, color: colors.ink3, fontVariant: ['tabular-nums'] },
  filterCountOn: { color: 'rgba(255,255,255,0.78)' },
});

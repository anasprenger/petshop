import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button, { IconButton } from '../components/Button';
import { SearchField } from '../components/Form';
import { GroupSeparator, groupItemStyle } from '../components/Group';
import { AnimalRow } from '../components/Rows';
import ScreenHeader from '../components/ScreenHeader';
import { EmptyCard, EmptyState, ErrorState, LoadingState } from '../components/States';
import { useFocusData } from '../hooks/useFocusData';
import { api } from '../services/api';
import { colors } from '../theme';

export default function AnimalListScreen({ navigation }) {
  const { data, error, loading, refreshing, retry, refresh } = useFocusData(api.listarAnimais);
  const [busca, setBusca] = useState('');

  const animais = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!data || !termo) return data ?? [];
    return data.filter((a) =>
      [a.nome, a.raca, a.especie, a.tutor_nome].some((v) => String(v ?? '').toLowerCase().includes(termo)),
    );
  }, [data, busca]);

  const novoAnimal = () => navigation.navigate('AnimalForm');

  let content;
  if (loading && !data) {
    content = <LoadingState />;
  } else if (error) {
    content = <ErrorState message={error} onRetry={retry} />;
  } else {
    content = (
      <FlatList
        data={animais}
        keyExtractor={(a) => String(a.id)}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.rose} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <SearchField value={busca} onChangeText={setBusca} placeholder="Buscar por nome, raça ou tutor" />
            {animais.length > 0 && (
              <Text style={styles.caption}>
                {animais.length} {animais.length === 1 ? 'animal' : 'animais'}
              </Text>
            )}
          </View>
        }
        ItemSeparatorComponent={GroupSeparator}
        renderItem={({ item, index }) => (
          <View style={groupItemStyle(index, animais.length)}>
            <AnimalRow animal={item} onPress={() => navigation.navigate('AnimalDetail', { id: item.id })} />
          </View>
        )}
        ListEmptyComponent={
          data.length > 0 ? (
            <EmptyCard text={`Nenhum animal encontrado para “${busca.trim()}”.`} />
          ) : (
            <EmptyState
              icon="paw-outline"
              title="Nenhum animal cadastrado"
              message="Cadastre o primeiro animal para começar a registrar serviços."
              action={<Button small icon="add" title="Cadastrar animal" onPress={novoAnimal} />}
            />
          )
        }
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Animais" right={<IconButton icon="add" label="Cadastrar animal" onPress={novoAnimal} />} />
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: 16, paddingBottom: 32 },
  header: { gap: 16, paddingTop: 4, paddingBottom: 8 },
  caption: { fontSize: 13, color: colors.ink2, paddingHorizontal: 4 },
});

import { Ionicons } from '@expo/vector-icons';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { AnimalAvatar } from './Badges';
import { TextButton } from './Button';
import { GroupSeparator, groupItemStyle } from './Group';

// Lista de animais em uma folha modal para escolher o animal do serviço
export default function AnimalPicker({ visible, animais, selectedId, onSelect, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.title}>Selecionar animal</Text>
          <TextButton title="Fechar" onPress={onClose} />
        </View>
        <FlatList
          data={animais}
          keyExtractor={(a) => String(a.id)}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={GroupSeparator}
          renderItem={({ item, index }) => {
            const selected = item.id === selectedId;
            return (
              <View style={groupItemStyle(index, animais.length)}>
                <Pressable
                  onPress={() => onSelect(item.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.rowPress }]}
                >
                  <AnimalAvatar nome={item.nome} especie={item.especie} />
                  <View style={styles.main}>
                    <Text style={styles.name} numberOfLines={1}>{item.nome}</Text>
                    <Text style={styles.sub} numberOfLines={1}>{item.especie} · {item.tutor_nome}</Text>
                  </View>
                  {selected && <Ionicons name="checkmark" size={22} color={colors.rose} />}
                </Pressable>
              </View>
            );
          }}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  title: { fontSize: 17, fontWeight: '600', color: colors.ink },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 60, paddingVertical: 10, paddingHorizontal: 16 },
  main: { flex: 1, minWidth: 0 },
  name: { fontSize: 16, fontWeight: '600', color: colors.ink },
  sub: { fontSize: 14, color: colors.ink2 },
});

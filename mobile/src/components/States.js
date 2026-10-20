import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';
import Button from './Button';

export function LoadingState() {
  return (
    <View style={styles.state} accessibilityLiveRegion="polite">
      <ActivityIndicator size="large" color={colors.rose} />
      <Text style={styles.message}>Carregando…</Text>
    </View>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.state} accessibilityRole="alert">
      <View style={[styles.icon, { backgroundColor: colors.dangerSoft }]}>
        <Ionicons name="alert-circle-outline" size={28} color={colors.danger} />
      </View>
      <Text style={styles.title}>Não foi possível carregar</Text>
      <Text style={styles.message}>{message}</Text>
      <Button title="Tentar novamente" icon="refresh" variant="tinted" small onPress={onRetry} style={styles.action} />
    </View>
  );
}

export function EmptyState({ icon, title, message, action }) {
  return (
    <View style={styles.state}>
      <View style={styles.icon}>
        <Ionicons name={icon} size={28} color={colors.rose} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

// Aviso discreto dentro de uma lista (ex.: nenhum resultado na busca)
export function EmptyCard({ text }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  state: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 56, paddingHorizontal: 28 },
  icon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.blush,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  title: { fontSize: 17, fontWeight: '600', color: colors.ink, textAlign: 'center' },
  message: { fontSize: 15, color: colors.ink2, textAlign: 'center', maxWidth: 280 },
  action: { marginTop: 10 },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, paddingVertical: 22, paddingHorizontal: 16 },
  cardText: { fontSize: 15, color: colors.ink2, textAlign: 'center' },
});

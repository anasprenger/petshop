import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { coresEspecie, statusInfo, tipoInfo } from '../constants';

// Círculo com a inicial do animal, colorido pela espécie
export function AnimalAvatar({ nome, especie, size = 40 }) {
  const cores = coresEspecie(especie);
  const inicial = String(nome || '?').trim().charAt(0).toUpperCase();
  return (
    <View style={[styles.center, { width: size, height: size, borderRadius: size / 2, backgroundColor: cores.bg }]}>
      <Text style={{ color: cores.color, fontSize: size * 0.43, fontWeight: '600' }}>{inicial}</Text>
    </View>
  );
}

// Ícone do tipo de serviço
export function TipoBadge({ tipo, size = 40 }) {
  const info = tipoInfo(tipo);
  return (
    <View style={[styles.center, { width: size, height: size, borderRadius: size * 0.3, backgroundColor: info.bg }]}>
      <Ionicons name={info.icon} size={size * 0.52} color={info.color} />
    </View>
  );
}

export function StatusPill({ status }) {
  const info = statusInfo(status);
  return (
    <View style={[styles.pill, { backgroundColor: info.bg }]}>
      <View style={[styles.dot, { backgroundColor: info.color }]} />
      <Text style={[styles.pillText, { color: info.color }]}>{info.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  pillText: { fontSize: 12, fontWeight: '600' },
});

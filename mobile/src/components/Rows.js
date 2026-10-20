import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tipoInfo } from '../constants';
import { colors } from '../theme';
import { formatMoney, relativeDay } from '../utils/format';
import { AnimalAvatar, StatusPill, TipoBadge } from './Badges';

function Row({ onPress, accessibilityLabel, children }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {children}
      <Ionicons name="chevron-forward" size={16} color={colors.ink3} />
    </Pressable>
  );
}

export function AnimalRow({ animal, onPress }) {
  const total = animal.total_servicos;
  return (
    <Row onPress={onPress} accessibilityLabel={`${animal.nome}, ${animal.especie}, tutor ${animal.tutor_nome}`}>
      <AnimalAvatar nome={animal.nome} especie={animal.especie} />
      <View style={styles.main}>
        <Text style={styles.title} numberOfLines={1}>{animal.nome}</Text>
        <Text style={styles.sub} numberOfLines={1}>{[animal.especie, animal.raca].filter(Boolean).join(' · ')}</Text>
        <Text style={styles.sub2} numberOfLines={1}>Tutor: {animal.tutor_nome}</Text>
      </View>
      {total !== undefined && <Text style={styles.meta}>{total} {total === 1 ? 'serviço' : 'serviços'}</Text>}
    </Row>
  );
}

export function ServiceRow({ servico, onPress, showAnimal = true }) {
  const tipo = tipoInfo(servico.tipo);
  return (
    <Row onPress={onPress} accessibilityLabel={`${tipo.label}${showAnimal ? ` de ${servico.animal_nome}` : ''}, ${relativeDay(servico.data)}`}>
      <TipoBadge tipo={servico.tipo} />
      <View style={styles.main}>
        <Text style={styles.title} numberOfLines={1}>
          {tipo.short || tipo.label}
          {showAnimal && <Text style={styles.titleSub}> · {servico.animal_nome}</Text>}
        </Text>
        <Text style={styles.sub}>{relativeDay(servico.data)}</Text>
      </View>
      <View style={styles.end}>
        <Text style={styles.value}>{formatMoney(servico.valor)}</Text>
        <StatusPill status={servico.status} />
      </View>
    </Row>
  );
}

// Linha de informação (rótulo + valor) usada nas telas de detalhes
export function InfoRow({ icon, label, value, muted = false }) {
  return (
    <View style={styles.info}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={17} color={colors.rose} />
      </View>
      <View style={styles.main}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, muted && { color: colors.ink3 }]} selectable>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 60,
    paddingVertical: 11,
    paddingLeft: 16,
    paddingRight: 14,
    backgroundColor: colors.surface,
  },
  pressed: { backgroundColor: colors.rowPress },
  main: { flex: 1, minWidth: 0, gap: 1 },
  title: { fontSize: 16, fontWeight: '600', color: colors.ink },
  titleSub: { fontWeight: '400', color: colors.ink2 },
  sub: { fontSize: 14, color: colors.ink2 },
  sub2: { fontSize: 13, color: colors.ink3 },
  meta: { fontSize: 13, color: colors.ink3 },
  end: { alignItems: 'flex-end', gap: 4 },
  value: { fontSize: 15, fontWeight: '600', color: colors.ink, fontVariant: ['tabular-nums'] },
  info: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 12, paddingHorizontal: 16 },
  infoIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: colors.blush,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: { fontSize: 13, color: colors.ink2 },
  infoValue: { fontSize: 16, color: colors.ink },
});

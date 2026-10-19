import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text } from 'react-native';
import { colors, shadow } from '../theme';

const VARIANTS = {
  primary: { bg: colors.rose, pressed: colors.rosePress, fg: colors.onRose },
  tinted: { bg: colors.blush, pressed: colors.blushLine, fg: colors.rose },
  danger: { bg: colors.surface, pressed: colors.dangerSoft, fg: colors.danger },
};

export default function Button({ title, onPress, variant = 'primary', icon, loading = false, disabled = false, small = false, style }) {
  const v = VARIANTS[variant];
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        small && styles.small,
        variant === 'danger' && shadow,
        { backgroundColor: pressed ? v.pressed : v.bg, opacity: disabled ? 0.6 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        icon && <Ionicons name={icon} size={small ? 17 : 19} color={v.fg} />
      )}
      <Text style={[styles.text, small && styles.textSmall, { color: v.fg }]}>{title}</Text>
    </Pressable>
  );
}

// Botão redondo do cabeçalho (ex.: "+")
export function IconButton({ icon, label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={({ pressed }) => [styles.round, pressed && { backgroundColor: colors.blushLine }]}
    >
      <Ionicons name={icon} size={22} color={colors.rose} />
    </Pressable>
  );
}

// Texto clicável usado no cabeçalho (ex.: "Cancelar") e em links de seção
export function TextButton({ title, onPress, strong = false, style }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" hitSlop={10} style={style}>
      {({ pressed }) => (
        <Text style={[styles.link, strong && styles.linkStrong, pressed && { opacity: 0.5 }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  small: { height: 40, paddingHorizontal: 14, borderRadius: 12 },
  text: { fontSize: 16, fontWeight: '600' },
  textSmall: { fontSize: 15 },
  round: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.blush,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: { fontSize: 16, color: colors.rose },
  linkStrong: { fontWeight: '600' },
});

// "Cancelar" no cabeçalho dos formulários (no navegador, o cabeçalho não tem margem lateral)
export function CancelButton({ onPress }) {
  return <TextButton title="Cancelar" onPress={onPress} style={Platform.OS === 'web' ? { paddingHorizontal: 16 } : null} />;
}

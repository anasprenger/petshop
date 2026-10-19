import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, type } from '../theme';
import Group from './Group';

export function FormCard({ title, children }) {
  return (
    <View style={styles.card}>
      {title && <Text style={[type.overline, styles.cardTitle]}>{title}</Text>}
      <Group inset={16} flat>
        {children}
      </Group>
    </View>
  );
}

// Rótulo + controle + mensagem de erro
export function Field({ label, required, error, focused, children }) {
  return (
    <View style={[styles.field, focused && styles.fieldFocused]}>
      <Text style={[type.label, focused && { color: colors.rose }, error && { color: colors.danger }]}>
        {label}
        {required && <Text style={{ color: colors.rose }}> *</Text>}
      </Text>
      {children}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

export function TextField({ label, required, error, prefix, suffix, multiline, ...inputProps }) {
  const [focused, setFocused] = useState(false);
  return (
    <Field label={label} required={required} error={error} focused={focused}>
      <View style={styles.control}>
        {prefix && <Text style={styles.affix}>{prefix}</Text>}
        <TextInput
          {...inputProps}
          multiline={multiline}
          accessibilityLabel={label}
          placeholderTextColor={colors.ink3}
          selectionColor={colors.rose}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.input, multiline && styles.multiline]}
        />
        {suffix && <Text style={styles.affix}>{suffix}</Text>}
      </View>
    </Field>
  );
}

// Aparência de cada variante de escolha: lista, opção e opção selecionada
const VARIANTES = {
  chips: { list: 'chipList', item: 'chip', itemOn: 'chipOn' },
  tiles: { list: 'tileList', item: 'tile', itemOn: 'tileOn' },
  segmented: { list: 'segList', item: 'seg', itemOn: 'segOn' },
};

// Escolha única entre opções: 'chips', 'tiles' (com ícone) ou 'segmented'
export function ChoiceField({ label, required, error, options, value, onChange, variant = 'chips' }) {
  const v = VARIANTES[variant];
  return (
    <Field label={label} required={required} error={error}>
      <View style={styles[v.list]} accessibilityRole="radiogroup">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={option.label}
              style={[styles[v.item], selected && styles[v.itemOn]]}
            >
              {option.icon && <Ionicons name={option.icon} size={22} color={selected ? colors.rose : colors.ink} />}
              <Text
                numberOfLines={2}
                style={[
                  styles.optionText,
                  variant === 'tiles' && styles.tileText,
                  selected && (variant === 'segmented' ? styles.segTextOn : styles.optionTextOn),
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Field>
  );
}

export function FormBanner({ message }) {
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Ionicons name="alert-circle-outline" size={20} color={colors.danger} />
      <Text style={styles.bannerText}>{message}</Text>
    </View>
  );
}

export function SearchField({ value, onChangeText, placeholder }) {
  return (
    <View style={styles.search}>
      <Ionicons name="search" size={18} color={colors.ink2} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.ink3}
        selectionColor={colors.rose}
        style={styles.searchInput}
        clearButtonMode="while-editing"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel={placeholder}
      />
    </View>
  );
}

// No navegador, o destaque do campo em foco é o rótulo rosa (sem o contorno padrão)
const semContorno = Platform.OS === 'web' ? { outlineStyle: 'none' } : null;

const styles = StyleSheet.create({
  card: { gap: 8 },
  cardTitle: { paddingHorizontal: 4 },
  field: { paddingVertical: 12, paddingHorizontal: 16, gap: 6 },
  fieldFocused: { backgroundColor: '#FFF8FB' },
  control: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  input: { flex: 1, fontSize: 17, color: colors.ink, paddingVertical: 2, ...semContorno },
  multiline: { minHeight: 68, textAlignVertical: 'top' },
  affix: { fontSize: 16, color: colors.ink2 },
  error: { fontSize: 13, fontWeight: '500', color: colors.danger },

  optionText: { fontSize: 15, fontWeight: '500', color: colors.ink, textAlign: 'center' },
  optionTextOn: { color: colors.rose, fontWeight: '600' },

  chipList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    justifyContent: 'center',
    backgroundColor: colors.fill,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipOn: { backgroundColor: colors.blush, borderColor: colors.rose },

  tileList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: {
    flexBasis: '30%',
    flexGrow: 1,
    minHeight: 74,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.fill,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  tileOn: { backgroundColor: colors.blush, borderColor: colors.rose },
  tileText: { fontSize: 13 },

  segList: { flexDirection: 'row', backgroundColor: colors.fill, borderRadius: 11, padding: 3, gap: 2 },
  seg: { flex: 1, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  segOn: {
    backgroundColor: colors.surface,
    shadowColor: '#3C1428',
    shadowOpacity: 0.14,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segTextOn: { fontWeight: '600' },

  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.dangerSoft,
  },
  bannerText: { flex: 1, fontSize: 14, fontWeight: '500', color: colors.danger },

  search: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.fill,
  },
  searchInput: { flex: 1, fontSize: 16, color: colors.ink, paddingVertical: 0, ...semContorno },
});

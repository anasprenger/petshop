import { StyleSheet, Text, View } from 'react-native';
import { colors, type } from '../theme';

// Cabeçalho com título grande das telas principais (abas)
export default function ScreenHeader({ title, eyebrow, right }) {
  return (
    <View style={styles.header}>
      <View style={styles.top}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : <View />}
        {right}
      </View>
      <Text style={type.largeTitle} accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 12 },
  top: { minHeight: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { fontSize: 13, fontWeight: '600', color: colors.ink2 },
});

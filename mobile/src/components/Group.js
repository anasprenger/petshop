import { Children, Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, shadow } from '../theme';

// Cartão branco arredondado com linhas separadas por um traço fino (lista agrupada estilo iOS)
export default function Group({ children, inset = 68, flat = false, style }) {
  const items = Children.toArray(children).filter(Boolean);
  return (
    <View style={[!flat && shadow, styles.outer, style]}>
      <View style={styles.inner}>
        {items.map((child, i) => (
          <Fragment key={i}>
            {i > 0 && <View style={[styles.separator, { marginLeft: inset }]} />}
            {child}
          </Fragment>
        ))}
      </View>
    </View>
  );
}

// Para FlatList: arredonda o primeiro e o último item, formando um único cartão
export function groupItemStyle(index, total) {
  return [
    styles.item,
    index === 0 && styles.first,
    index === total - 1 && styles.last,
  ];
}

export function GroupSeparator() {
  return (
    <View style={styles.item}>
      <View style={[styles.separator, { marginLeft: 68 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { borderRadius: radius.md, backgroundColor: colors.surface },
  inner: { borderRadius: radius.md, overflow: 'hidden' },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
  item: { backgroundColor: colors.surface, overflow: 'hidden' },
  first: { borderTopLeftRadius: radius.md, borderTopRightRadius: radius.md },
  last: { borderBottomLeftRadius: radius.md, borderBottomRightRadius: radius.md },
});

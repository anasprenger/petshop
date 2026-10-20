import { Platform } from 'react-native';

export const colors = {
  rose: '#C74B7D',
  rosePress: '#A93C68',
  onRose: '#FFFFFF',
  blush: '#FBE7EF',
  blushLine: '#F2CFDD',
  canvas: '#F6F3F5',
  surface: '#FFFFFF',
  fill: '#EFEAED',
  fillStrong: '#E2DADF',
  ink: '#221C20',
  ink2: '#70676C',
  ink3: '#A69DA2',
  line: '#ECE4E8',
  rowPress: '#FAF3F6',
  danger: '#D23B4E',
  dangerSoft: '#FDECEE',
  ok: '#1F8547',
  okSoft: '#E3F5E9',
  info: '#2F64D6',
  infoSoft: '#E8EFFD',
  warn: '#A35F00',
  warnSoft: '#FFF1D9',
};

export const radius = { sm: 12, md: 18, lg: 22 };

export const shadow = Platform.select({
  ios: {
    shadowColor: '#501E37',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  default: { elevation: 1 },
});

export const type = {
  largeTitle: { fontSize: 32, fontWeight: '700', letterSpacing: -0.6, color: colors.ink },
  sectionTitle: { fontSize: 20, fontWeight: '600', letterSpacing: -0.2, color: colors.ink },
  label: { fontSize: 13, fontWeight: '600', color: colors.ink2 },
  overline: { fontSize: 12, fontWeight: '700', letterSpacing: 0.7, textTransform: 'uppercase', color: colors.ink2 },
};

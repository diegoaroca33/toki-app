// src/theme.js — Design tokens for TOKI app

export const colors = {
  BG: '#0B1D3A',
  BG2: '#122548',
  BG3: '#1A3060',
  GOLD: '#F0C850',
  GREEN: '#2ECC71',
  RED: '#E74C3C',
  BLUE: '#3498DB',
  PURPLE: '#9B59B6',
  DIM: '#A0AEC0',
  TXT: '#ECF0F1',
  CARD: '#152D55',
  BORDER: '#1E3A6A',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  xxl: 20,
  round: '50%',
};

export const fontSizes = {
  xs: 11,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 22,
  xxxl: 24,
  display: 26,
};

export const shadows = {
  none: 'none',
  soft: '0 4px 12px rgba(0,0,0,.18)',
  card: '0 6px 18px rgba(0,0,0,.18)',
  raised: '4px 4px 0 rgba(0,0,0,.22)',
  green: '4px 4px 0 #1e8449',
  blue: '4px 4px 0 #1a5276',
  purple: '4px 4px 0 #6c3483',
  gold: '4px 4px 0 #b7950b',
  orange: '4px 4px 0 #a04000',
  danger: '4px 4px 0 #b03a2e',
  glowGold: '0 0 0 2px rgba(240,200,80,.16), 0 10px 24px rgba(240,200,80,.18)',
};

export const breakpoints = {
  xs: 360,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1100,
};

export const fontFamily = {
  base: "'Fredoka', sans-serif",
  handwriting: "'Caveat', cursive",
};

export const theme = {
  colors,
  spacing,
  radius,
  fontSizes,
  shadows,
  breakpoints,
  fontFamily,
};

export default theme;

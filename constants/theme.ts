// Paradise Garden v3.0 - Design Tokens
// Sistema de diseño sereno, flat y delicado

export const colors = {
  // Primary — Sage Green
  primary: {
    50: '#E8F2F2',
    100: '#D1E5E5',
    200: '#A3CBCB',
    300: '#7BBDBD',
    400: '#5BA4A4',
    500: '#5BA4A4', // Principal
    600: '#4A8F8F',
    700: '#3A7A7A',
  },

  // Secondary — Warm Taupe
  secondary: {
    50: '#F5F2EB',
    100: '#EBE5DB',
    200: '#D7CBB7',
    300: '#C4A484',
    400: '#C4A484',
    500: '#C4A484', // Principal
    600: '#B49474',
    700: '#A48464',
  },

  // Blush — Accent Pink
  blush: {
    50: '#F9F0F1',
    100: '#F5EBEB',
    200: '#EBCFD1',
    300: '#E8B4B8',
    400: '#E8B4B8',
    500: '#E8B4B8', // Principal
    600: '#D49EA2',
    700: '#C0888C',
  },

  // Semantic
  success: '#7BAA9E',
  successLight: '#E8F2F0',
  error: '#C47070',
  errorLight: '#F5EBEB',
  warning: '#D4C4A5',
  warningLight: '#F5F2EB',
  info: '#5BA4A4',
  infoLight: '#E8F2F2',

  // Neutral (Light theme)
  neutral: {
    0: '#FFFFFF',
    50: '#FAFBF9',
    100: '#F5F6F4',
    200: '#F0F0F0',
    300: '#E5E5E5',
    400: '#9A9A9A',
    500: '#6A6A6A',
    600: '#3D3D3D',
    700: '#2D2D2D',
    800: '#1D1D1D',
    900: '#0D0D0D',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// Paradise Garden: Sin border radius excepto avatares
export const borderRadius = {
  none: 0,
  sm: 0,
  md: 0,
  lg: 0,
  xl: 0,
  '2xl': 0,
  full: 9999, // Solo para avatares circulares
};

export const typography = {
  // Display — Cormorant Garamond (títulos)
  h1: {
    fontSize: 32,
    fontWeight: '300' as const,
    lineHeight: 40,
    fontFamily: 'CormorantGaramond_300Light',
  },
  h2: {
    fontSize: 24,
    fontWeight: '300' as const,
    lineHeight: 32,
    fontFamily: 'CormorantGaramond_300Light',
  },
  h3: {
    fontSize: 20,
    fontWeight: '400' as const,
    lineHeight: 28,
    fontFamily: 'CormorantGaramond_400Regular',
  },
  // Script — Dancing Script (taglines)
  tagline: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 24,
    fontFamily: 'DancingScript_400Regular',
  },
  // Body — Nunito (UI, párrafos)
  body: {
    fontSize: 16,
    fontWeight: '300' as const,
    lineHeight: 24,
    fontFamily: 'Nunito_300Light',
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '300' as const,
    lineHeight: 28,
    fontFamily: 'Nunito_300Light',
  },
  bodySm: {
    fontSize: 14,
    fontWeight: '300' as const,
    lineHeight: 20,
    fontFamily: 'Nunito_300Light',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    fontFamily: 'Nunito_400Regular',
  },
  // Buttons y labels — Nunito Regular
  button: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    fontFamily: 'Nunito_400Regular',
  },
  buttonSm: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    fontFamily: 'Nunito_400Regular',
  },
  label: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    fontFamily: 'Nunito_400Regular',
  },
};

// Paradise Garden: Sin sombras
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  md: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  lg: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
};

// Tema principal (Light - Paradise Garden solo tiene light theme)
export const theme = {
  background: colors.neutral[50],
  surface: colors.neutral[0],
  surfaceAlt: colors.neutral[100],
  text: colors.neutral[600],
  textSecondary: colors.neutral[500],
  textMuted: colors.neutral[400],
  border: colors.neutral[300],
  borderLight: colors.neutral[200],
  primary: colors.primary[500],
  primaryLight: colors.primary[300],
  primaryDark: colors.primary[600],
  secondary: colors.secondary[500],
  blush: colors.blush[500],
  blushDark: colors.blush[600],
};

// Mantener compatibilidad con imports existentes
export const lightTheme = theme;
export const darkTheme = theme; // Ya no hay dark theme, pero mantener export

export type Theme = typeof theme;

export default {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  theme,
  lightTheme,
  darkTheme,
};

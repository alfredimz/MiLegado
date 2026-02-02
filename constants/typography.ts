// Paradise Garden v3.0 - Typography System
// Tipografía elegante y delicada

export const fontFamilies = {
  // Display — Cormorant Garamond (para títulos H1, H2, H3)
  display: 'CormorantGaramond_300Light',
  displayRegular: 'CormorantGaramond_400Regular',

  // Script — Dancing Script (para taglines y acentos)
  script: 'DancingScript_400Regular',

  // Body — Nunito (para UI, párrafos, labels)
  body: 'Nunito_300Light',
  bodyRegular: 'Nunito_400Regular',
};

export const fontWeights = {
  light: '300' as const,
  regular: '400' as const,
  // Nota: Paradise Garden no usa bold (500+)
};

export const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

export const lineHeights = {
  tight: 1.1,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
};

// Estilos de texto predefinidos
export const textStyles = {
  // Títulos con Cormorant Garamond
  h1: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.light,
    lineHeight: 40,
    letterSpacing: 0.5,
  },
  h2: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.light,
    lineHeight: 32,
    letterSpacing: 0.25,
  },
  h3: {
    fontFamily: fontFamilies.displayRegular,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.regular,
    lineHeight: 28,
    letterSpacing: 0,
  },

  // Tagline con Dancing Script
  tagline: {
    fontFamily: fontFamilies.script,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    lineHeight: 24,
  },
  taglineLarge: {
    fontFamily: fontFamilies.script,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.regular,
    lineHeight: 28,
  },

  // Body con Nunito
  body: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.light,
    lineHeight: 24,
  },
  bodyLarge: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.light,
    lineHeight: 28,
  },
  bodySm: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.light,
    lineHeight: 20,
  },

  // UI Elements
  button: {
    fontFamily: fontFamilies.bodyRegular,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    lineHeight: 24,
  },
  buttonSm: {
    fontFamily: fontFamilies.bodyRegular,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: 20,
  },
  label: {
    fontFamily: fontFamilies.bodyRegular,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: 20,
  },
  caption: {
    fontFamily: fontFamilies.bodyRegular,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: 16,
  },

  // Tab y Navigation
  tabLabel: {
    fontFamily: fontFamilies.bodyRegular,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: 16,
  },
};

export default {
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  textStyles,
};

# Design Tokens — MiLegado v3.0

## Paradise Garden — React Native + Expo

```typescript
/**
 * 🎨 Design Tokens — MiLegado
 * Paradise Garden v3.0
 * 
 * @version 3.0.0
 * @author UNIR 2025
 */

// =============================================================================
// 🎨 COLORES
// =============================================================================

export const colors = {
  // Primary — Sage Green
  primary: {
    light: '#7BBDBD',
    DEFAULT: '#5BA4A4',
    dark: '#4A8F8F',
  },

  // Secondary — Golden Warm
  secondary: {
    light: '#D4B494',
    DEFAULT: '#C4A484',
    dark: '#A68B6A',
  },

  // Blush — Rosa Cálido
  blush: {
    light: '#F2D0D3',
    DEFAULT: '#E8B4B8',
    dark: '#D49EA2',
  },

  // Backgrounds
  background: {
    DEFAULT: '#FAFBF9',
    surface: '#FFFFFF',
    surfaceAlt: '#F5F6F4',
  },

  // Text
  text: {
    DEFAULT: '#3D3D3D',
    secondary: '#6A6A6A',
    muted: '#9A9A9A',
    disabled: '#BEBEBE',
  },

  // Borders
  border: {
    DEFAULT: '#E5E5E5',
    light: '#F0F0F0',
  },

  // Semantic
  success: {
    DEFAULT: '#7BAA9E',
    light: '#E8F2F0',
  },

  error: {
    DEFAULT: '#D4A5A5',
    dark: '#C47070',
    light: '#F5EBEB',
  },

  warning: {
    DEFAULT: '#D4C4A5',
    light: '#F5F2EB',
  },

  // Utilities
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

// =============================================================================
// 🌞 TEMA (Light Mode Only)
// =============================================================================

export const theme = {
  name: 'paradise-garden',

  // Backgrounds
  background: colors.background.DEFAULT,
  backgroundSurface: colors.background.surface,
  backgroundAlt: colors.background.surfaceAlt,

  // Borders
  border: colors.border.DEFAULT,
  borderLight: colors.border.light,
  borderFocus: colors.primary.DEFAULT,
  borderError: colors.error.dark,
  borderSuccess: colors.success.DEFAULT,

  // Text
  textPrimary: colors.text.DEFAULT,
  textSecondary: colors.text.secondary,
  textMuted: colors.text.muted,
  textDisabled: colors.text.disabled,
  textInverse: colors.white,

  // Interactive
  primary: colors.primary.DEFAULT,
  primaryHover: colors.primary.light,
  primaryActive: colors.primary.dark,

  secondary: colors.secondary.DEFAULT,
  blush: colors.blush.DEFAULT,

  // Status
  success: colors.success.DEFAULT,
  successLight: colors.success.light,
  error: colors.error.dark,
  errorLight: colors.error.light,
  warning: colors.warning.DEFAULT,
  warningLight: colors.warning.light,
} as const;

// =============================================================================
// 📝 TIPOGRAFÍA
// =============================================================================

export const typography = {
  // Font families (Google Fonts)
  fontFamily: {
    display: 'CormorantGaramond_300Light',
    displayRegular: 'CormorantGaramond_400Regular',
    script: 'DancingScript_400Regular',
    body: 'Nunito_300Light',
    bodyRegular: 'Nunito_400Regular',
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
  },

  // Font weights (300-400 ONLY)
  fontWeight: {
    light: '300',
    regular: '400',
  },

  // Line heights
  lineHeight: {
    tight: 1.1,
    snug: 1.2,
    normal: 1.4,
    relaxed: 1.5,
    loose: 1.6,
  },

  // Presets
  presets: {
    display: {
      fontSize: 40,
      fontFamily: 'CormorantGaramond_300Light',
      lineHeight: 44,
      color: colors.text.DEFAULT,
    },
    h1: {
      fontSize: 32,
      fontFamily: 'CormorantGaramond_300Light',
      lineHeight: 38,
      color: colors.text.DEFAULT,
    },
    h2: {
      fontSize: 24,
      fontFamily: 'CormorantGaramond_400Regular',
      lineHeight: 31,
      color: colors.text.DEFAULT,
    },
    script: {
      fontSize: 20,
      fontFamily: 'DancingScript_400Regular',
      lineHeight: 28,
      color: colors.secondary.DEFAULT,
    },
    bodyLarge: {
      fontSize: 18,
      fontFamily: 'Nunito_300Light',
      lineHeight: 29,
      color: colors.text.DEFAULT,
    },
    body: {
      fontSize: 16,
      fontFamily: 'Nunito_300Light',
      lineHeight: 26,
      color: colors.text.DEFAULT,
    },
    bodySmall: {
      fontSize: 14,
      fontFamily: 'Nunito_300Light',
      lineHeight: 21,
      color: colors.text.secondary,
    },
    caption: {
      fontSize: 12,
      fontFamily: 'Nunito_400Regular',
      lineHeight: 17,
      color: colors.text.muted,
    },
    button: {
      fontSize: 16,
      fontFamily: 'Nunito_400Regular',
      lineHeight: 16,
    },
  },
} as const;

// =============================================================================
// 📏 ESPACIADO
// =============================================================================

export const spacing = {
  0: 0,
  '4xs': 4,
  '3xs': 8,
  '2xs': 12,
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
  '2xl': 80,
} as const;

// =============================================================================
// 📐 BORDER RADIUS
// =============================================================================

export const borderRadius = {
  none: 0,        // DEFAULT for all
  full: 9999,     // ONLY for avatars
} as const;

// =============================================================================
// 📏 BORDER WIDTH
// =============================================================================

export const borderWidth = {
  DEFAULT: 1,
  0: 0,
  1: 1,
  2: 2,
} as const;

// =============================================================================
// 🚫 SOMBRAS (NONE)
// =============================================================================

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
} as const;

// =============================================================================
// ⏱️ ANIMACIONES
// =============================================================================

export const animation = {
  duration: {
    fast: 150,
    normal: 200,
    slow: 300,
  },
  spring: {
    damping: 15,
    stiffness: 150,
  },
} as const;

// =============================================================================
// 📐 LAYOUT
// =============================================================================

export const layout = {
  screenPaddingH: spacing.xs,    // 16px
  screenPaddingV: spacing.sm,    // 24px
  maxContentWidth: 480,
  headerHeight: 56,
  tabBarHeight: 64,
  tabBarPaddingBottom: 24,
  minTouchTarget: 44,

  buttonHeight: {
    sm: 36,
    md: 44,
    lg: 52,
  },

  inputHeight: 44,
  cardPadding: 20,

  avatarSize: {
    sm: 32,
    md: 44,
    lg: 64,
    xl: 80,
  },
} as const;

// =============================================================================
// 😊 EMOJIS (Iconografía)
// =============================================================================

export const emojis = {
  // Navigation
  home: '🏠',
  legacy: '📚',
  guardians: '👥',
  profile: '👤',

  // Content
  text: '📝',
  video: '🎬',
  audio: '🎤',
  photo: '📷',

  // Status
  heartbeat: '💓',
  active: '✨',
  check: '✓',
  warning: '⚠️',
  error: '😕',

  // Actions
  settings: '⚙️',
  security: '🔒',
  add: '➕',
  back: '←',
  dropdown: '▼',

  // Media
  play: '▶️',
  pause: '⏸️',

  // Brand
  legado: '🌿',
  peace: '🕊️',
  offline: '📡',
} as const;

// =============================================================================
// 🧩 COMPONENTES
// =============================================================================

export const components = {
  buttonPrimary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary.DEFAULT,
    borderRadius: borderRadius.none,
    height: layout.buttonHeight.md,
    paddingHorizontal: spacing.sm,
  },

  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.secondary.DEFAULT,
    borderRadius: borderRadius.none,
    height: layout.buttonHeight.md,
    paddingHorizontal: spacing.sm,
  },

  buttonBlush: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.blush.DEFAULT,
    borderRadius: borderRadius.none,
    height: layout.buttonHeight.md,
    paddingHorizontal: spacing.sm,
  },

  buttonGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    borderRadius: borderRadius.none,
    height: layout.buttonHeight.md,
    paddingHorizontal: spacing.sm,
  },

  buttonDanger: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.error.dark,
    borderRadius: borderRadius.none,
    height: layout.buttonHeight.md,
    paddingHorizontal: spacing.sm,
  },

  input: {
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    borderRadius: borderRadius.none,
    height: layout.inputHeight,
    paddingHorizontal: spacing.xs,
  },

  card: {
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    borderRadius: borderRadius.none,
    padding: layout.cardPadding,
  },

  avatar: {
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.surfaceAlt,
  },

  modal: {
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    borderRadius: borderRadius.none,
    padding: spacing.sm,
  },

  tabBar: {
    height: layout.tabBarHeight,
    paddingBottom: layout.tabBarPaddingBottom,
    backgroundColor: colors.background.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border.DEFAULT,
  },

  header: {
    height: layout.headerHeight,
    backgroundColor: colors.background.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.DEFAULT,
  },
} as const;

// =============================================================================
// 📦 EXPORT
// =============================================================================

const designTokens = {
  colors,
  theme,
  typography,
  spacing,
  borderRadius,
  borderWidth,
  shadows,
  animation,
  layout,
  emojis,
  components,
};

export default designTokens;
```

---

*MiLegado Design Tokens v3.0 — Paradise Garden*
*UNIR 2025*
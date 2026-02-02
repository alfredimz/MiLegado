# Theme Tokens — MiLegado v3.0

## Paradise Garden — React Native

```typescript
/**
 * 🎨 Theme Tokens — MiLegado
 * Paradise Garden v3.0
 * 
 * import { colors, typography, spacing } from '@/constants/theme';
 */

// =============================================================================
// 🎨 COLORES
// =============================================================================

export const colors = {
  // Primary — Sage Green
  primary: {
    50: '#E8F2F0',
    100: '#D1E5E3',
    200: '#A3CBC9',
    300: '#7BBDBD',
    400: '#5BA4A4',  // ← DEFAULT
    500: '#5BA4A4',
    600: '#4A8F8F',
    700: '#3A7A7A',
    800: '#2A6565',
    900: '#1A5050',
  },

  // Secondary — Golden Warm
  secondary: {
    50: '#F5F2EB',
    100: '#EBE5D7',
    200: '#D7CBAF',
    300: '#D4B494',
    400: '#C4A484',  // ← DEFAULT
    500: '#C4A484',
    600: '#A68B6A',
    700: '#887250',
    800: '#6A5936',
    900: '#4C401C',
  },

  // Blush — Rosa Cálido
  blush: {
    50: '#FDF5F6',
    100: '#FAEBEC',
    200: '#F2D0D3',
    300: '#E8B4B8',  // ← DEFAULT
    400: '#E8B4B8',
    500: '#D49EA2',
    600: '#C0888C',
    700: '#AC7276',
    800: '#985C60',
    900: '#84464A',
  },

  // Neutrales
  neutral: {
    0: '#FFFFFF',
    50: '#FAFBF9',   // Background
    100: '#F5F6F4',  // Surface Alt
    200: '#F0F0F0',  // Border Light
    300: '#E5E5E5',  // Border
    400: '#BEBEBE',  // Text Disabled
    500: '#9A9A9A',  // Text Muted
    600: '#6A6A6A',  // Text Secondary
    700: '#3D3D3D',  // Text Primary
    800: '#2D2D2D',
    900: '#1D1D1D',
  },

  // Semánticos
  success: {
    50: '#E8F2F0',
    500: '#7BAA9E',
  },

  warning: {
    50: '#F5F2EB',
    500: '#D4C4A5',
  },

  error: {
    50: '#F5EBEB',
    500: '#C47070',
  },

  // Utilidades
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

// =============================================================================
// 🌞 TEMA
// =============================================================================

export const theme = {
  // Backgrounds
  background: colors.neutral[50],
  backgroundSurface: colors.neutral[0],
  backgroundAlt: colors.neutral[100],

  // Borders
  border: colors.neutral[300],
  borderLight: colors.neutral[200],
  borderFocus: colors.primary[400],
  borderError: colors.error[500],
  borderSuccess: colors.success[500],

  // Text
  text: colors.neutral[700],
  textSecondary: colors.neutral[600],
  textMuted: colors.neutral[500],
  textDisabled: colors.neutral[400],
  textInverse: colors.neutral[0],

  // Interactive
  primary: colors.primary[400],
  primaryHover: colors.primary[300],
  primaryActive: colors.primary[600],

  secondary: colors.secondary[400],
  blush: colors.blush[300],

  // Status
  success: colors.success[500],
  successLight: colors.success[50],
  error: colors.error[500],
  errorLight: colors.error[50],
  warning: colors.warning[500],
  warningLight: colors.warning[50],
} as const;

// =============================================================================
// 📝 TIPOGRAFÍA
// =============================================================================

export const typography = {
  fontFamily: {
    display: 'CormorantGaramond_300Light',
    displayRegular: 'CormorantGaramond_400Regular',
    script: 'DancingScript_400Regular',
    body: 'Nunito_300Light',
    bodyRegular: 'Nunito_400Regular',
  },

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

  fontWeight: {
    light: '300',
    regular: '400',
  },

  lineHeight: {
    tight: 1.1,
    snug: 1.2,
    normal: 1.4,
    relaxed: 1.5,
    loose: 1.6,
  },

  styles: {
    display: {
      fontSize: 40,
      fontFamily: 'CormorantGaramond_300Light',
      lineHeight: 1.1,
    },
    h1: {
      fontSize: 32,
      fontFamily: 'CormorantGaramond_300Light',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 24,
      fontFamily: 'CormorantGaramond_400Regular',
      lineHeight: 1.3,
    },
    script: {
      fontSize: 20,
      fontFamily: 'DancingScript_400Regular',
      lineHeight: 1.4,
    },
    bodyLarge: {
      fontSize: 18,
      fontFamily: 'Nunito_300Light',
      lineHeight: 1.6,
    },
    body: {
      fontSize: 16,
      fontFamily: 'Nunito_300Light',
      lineHeight: 1.6,
    },
    bodySmall: {
      fontSize: 14,
      fontFamily: 'Nunito_300Light',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: 12,
      fontFamily: 'Nunito_400Regular',
      lineHeight: 1.4,
    },
    button: {
      fontSize: 16,
      fontFamily: 'Nunito_400Regular',
      lineHeight: 1,
    },
  },
} as const;

// =============================================================================
// 📏 ESPACIADO
// =============================================================================

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

// =============================================================================
// 📐 BORDER RADIUS
// =============================================================================

export const borderRadius = {
  none: 0,
  full: 9999,
} as const;

// =============================================================================
// 🚫 SOMBRAS
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

export const animations = {
  duration: {
    fast: 150,
    normal: 200,
    slow: 300,
  },
} as const;

// =============================================================================
// 📐 LAYOUT
// =============================================================================

export const layout = {
  screenPadding: spacing[4],
  headerHeight: 56,
  tabBarHeight: 64,
  tabBarPaddingBottom: 24,
  maxWidth: 480,

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

  iconSize: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
} as const;

// =============================================================================
// 🧩 COMPONENTES
// =============================================================================

export const componentStyles = {
  buttonPrimary: {
    backgroundColor: 'transparent',
    borderColor: colors.primary[400],
    borderRadius: borderRadius.none,
    height: layout.buttonHeight.md,
    paddingHorizontal: spacing[6],
    borderWidth: 1,
  },

  buttonSecondary: {
    backgroundColor: 'transparent',
    borderColor: colors.secondary[400],
    borderRadius: borderRadius.none,
    height: layout.buttonHeight.md,
    paddingHorizontal: spacing[6],
    borderWidth: 1,
  },

  input: {
    backgroundColor: colors.neutral[0],
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.none,
    height: layout.inputHeight,
    paddingHorizontal: spacing[4],
    borderWidth: 1,
  },

  card: {
    backgroundColor: colors.neutral[0],
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.none,
    padding: layout.cardPadding,
    borderWidth: 1,
  },

  badge: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.none,
    borderWidth: 1,
  },
} as const;

// =============================================================================
// 📦 EXPORT
// =============================================================================

const themeTokens = {
  colors,
  theme,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  layout,
  componentStyles,
};

export default themeTokens;

// =============================================================================
// 📋 QUICK REFERENCE
// =============================================================================

/*
COLORES:
- Background: #FAFBF9
- Primary: #5BA4A4
- Secondary: #C4A484
- Blush: #E8B4B8
- Text: #3D3D3D
- Border: #E5E5E5

TIPOGRAFÍA:
- Display: Cormorant Garamond 300
- Script: Dancing Script 400
- Body: Nunito 300

REGLAS:
- Border Radius: 0px (avatares: full)
- Shadows: none
- Max Weight: 400
- Buttons: outline
*/
```

---

*MiLegado Theme Tokens v3.0*
*UNIR 2025*
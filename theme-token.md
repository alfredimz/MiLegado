/**
 * 🎨 Design Tokens — App de Legado Digital
 * 
 * Sistema de diseño completo para React Native
 * Generado para proyecto UNIR 2025
 * 
 * Uso:
 * import { colors, typography, spacing } from '@/constants/theme';
 */

// =============================================================================
// 🎨 COLORES
// =============================================================================

export const colors = {
  // Primary — Cempasúchil (Naranja)
  primary: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316', // ← Principal
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },

  // Secondary — Oro/Ámbar
  secondary: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // ← Principal
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Neutrales
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
    950: '#09090B',
  },

  // Semánticos
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },

  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },

  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },

  // Especiales — Legado
  legado: {
    purple: '#8B5CF6',  // Guardianes
    pink: '#EC4899',    // Emocional
    teal: '#14B8A6',    // Latido/Vida
  },

  // Transparentes
  transparent: {
    black10: 'rgba(0, 0, 0, 0.1)',
    black20: 'rgba(0, 0, 0, 0.2)',
    black50: 'rgba(0, 0, 0, 0.5)',
    white10: 'rgba(255, 255, 255, 0.1)',
    white20: 'rgba(255, 255, 255, 0.2)',
    white50: 'rgba(255, 255, 255, 0.5)',
    primary20: 'rgba(249, 115, 22, 0.2)',
    primary40: 'rgba(249, 115, 22, 0.4)',
  },
};

// =============================================================================
// 🌓 TEMAS
// =============================================================================

export const themes = {
  dark: {
    background: colors.neutral[950],
    backgroundSecondary: colors.neutral[900],
    backgroundTertiary: colors.neutral[800],
    
    surface: colors.neutral[900],
    surfaceHover: colors.neutral[800],
    surfaceActive: colors.neutral[700],
    
    border: colors.neutral[800],
    borderHover: colors.neutral[700],
    borderFocus: colors.primary[500],
    
    text: colors.neutral[0],
    textSecondary: colors.neutral[300],
    textMuted: colors.neutral[500],
    textDisabled: colors.neutral[600],
    
    primary: colors.primary[500],
    primaryHover: colors.primary[400],
    primaryActive: colors.primary[600],
  },

  light: {
    background: colors.neutral[50],
    backgroundSecondary: colors.neutral[0],
    backgroundTertiary: colors.neutral[100],
    
    surface: colors.neutral[0],
    surfaceHover: colors.neutral[50],
    surfaceActive: colors.neutral[100],
    
    border: colors.neutral[200],
    borderHover: colors.neutral[300],
    borderFocus: colors.primary[500],
    
    text: colors.neutral[900],
    textSecondary: colors.neutral[700],
    textMuted: colors.neutral[500],
    textDisabled: colors.neutral[400],
    
    primary: colors.primary[500],
    primaryHover: colors.primary[600],
    primaryActive: colors.primary[700],
  },
};

// =============================================================================
// 📝 TIPOGRAFÍA
// =============================================================================

export const typography = {
  // Font Family
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    extrabold: 'Inter_800ExtraBold',
  },

  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
  },

  // Line Heights
  lineHeight: {
    none: 1,
    tight: 1.1,
    snug: 1.2,
    normal: 1.4,
    relaxed: 1.5,
    loose: 1.6,
  },

  // Estilos predefinidos
  styles: {
    display: {
      fontSize: 48,
      fontFamily: 'Inter_800ExtraBold',
      lineHeight: 1.1,
    },
    h1: {
      fontSize: 32,
      fontFamily: 'Inter_700Bold',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 24,
      fontFamily: 'Inter_600SemiBold',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: 20,
      fontFamily: 'Inter_600SemiBold',
      lineHeight: 1.4,
    },
    bodyLarge: {
      fontSize: 18,
      fontFamily: 'Inter_400Regular',
      lineHeight: 1.6,
    },
    body: {
      fontSize: 16,
      fontFamily: 'Inter_400Regular',
      lineHeight: 1.6,
    },
    bodySmall: {
      fontSize: 14,
      fontFamily: 'Inter_400Regular',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: 12,
      fontFamily: 'Inter_500Medium',
      lineHeight: 1.4,
    },
    button: {
      fontSize: 16,
      fontFamily: 'Inter_600SemiBold',
      lineHeight: 1,
    },
    buttonSmall: {
      fontSize: 14,
      fontFamily: 'Inter_600SemiBold',
      lineHeight: 1,
    },
  },
};

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
  24: 96,
};

// =============================================================================
// 🔲 BORDER RADIUS
// =============================================================================

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// =============================================================================
// 🌫️ SOMBRAS
// =============================================================================

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 8,
  },
  glow: {
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
};

// =============================================================================
// ⏱️ ANIMACIONES
// =============================================================================

export const animations = {
  duration: {
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 500,
  },
  easing: {
    linear: [0, 0, 1, 1],
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
  },
};

// =============================================================================
// 📐 LAYOUT
// =============================================================================

export const layout = {
  // Screen padding
  screenPadding: spacing[4], // 16px
  screenPaddingLarge: spacing[6], // 24px

  // Content max width
  maxWidth: 480,

  // Bottom tab bar
  tabBarHeight: 80,
  tabBarPaddingBottom: 24,

  // Header
  headerHeight: 56,

  // Card
  cardPadding: spacing[4],
  cardBorderRadius: borderRadius.xl,

  // Button
  buttonHeight: {
    sm: 36,
    md: 48,
    lg: 56,
  },

  // Input
  inputHeight: 52,
  inputPadding: spacing[4],

  // Avatar
  avatarSize: {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  },

  // Icon
  iconSize: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },

  // FAB
  fabSize: 56,
};

// =============================================================================
// 🎯 COMPONENTES - ESTILOS BASE
// =============================================================================

export const componentStyles = {
  // Botón Primario
  buttonPrimary: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.lg,
    height: layout.buttonHeight.md,
    paddingHorizontal: spacing[6],
    ...shadows.glow,
  },

  // Botón Secundario
  buttonSecondary: {
    backgroundColor: colors.neutral[800],
    borderRadius: borderRadius.lg,
    height: layout.buttonHeight.md,
    paddingHorizontal: spacing[6],
    borderWidth: 1,
    borderColor: colors.neutral[700],
  },

  // Input
  input: {
    backgroundColor: colors.neutral[800],
    borderRadius: borderRadius.lg,
    height: layout.inputHeight,
    paddingHorizontal: spacing[4],
    borderWidth: 1,
    borderColor: colors.neutral[700],
    ...typography.styles.body,
    color: colors.neutral[100],
  },

  // Card
  card: {
    backgroundColor: colors.neutral[800],
    borderRadius: layout.cardBorderRadius,
    padding: layout.cardPadding,
    borderWidth: 1,
    borderColor: colors.neutral[700],
  },

  // Badge
  badge: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.full,
    ...typography.styles.caption,
  },
};

// =============================================================================
// 📱 EXPORT DEFAULT - TEMA COMPLETO
// =============================================================================

const theme = {
  colors,
  themes,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  layout,
  componentStyles,
};

export default theme;

// =============================================================================
// 📋 REFERENCIA RÁPIDA PARA FIGMA
// =============================================================================

/*
COLORES PRINCIPALES (Hex):
- Primary 500: #F97316 (Naranja Cempasúchil)
- Secondary 500: #F59E0B (Oro/Ámbar)
- Success: #22C55E
- Error: #EF4444
- Warning: #F59E0B

FONDOS DARK MODE:
- Background: #09090B
- Surface: #18181B
- Card: #27272A
- Border: #3F3F46

TIPOGRAFÍA:
- Font: Inter
- Display: 48px / 800
- H1: 32px / 700
- H2: 24px / 600
- Body: 16px / 400 (default)
- Body Large: 18px / 400 (seniors)
- Caption: 12px / 500

ESPACIADO (Base 4px):
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

BORDER RADIUS:
- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- 2xl: 24px
- full: 9999px

COMPONENTES:
- Button height: 48px
- Input height: 52px
- Card padding: 16px
- Screen padding: 16px
- Tab bar height: 80px
*/
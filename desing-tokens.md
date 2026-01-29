/**
 * 🎨 Design Tokens — App de Legado Digital
 * 
 * Sistema de diseño para React Native + Expo
 * Inspirado en el Día de Muertos mexicano
 * 
 * @version 1.0.0
 * @author UNIR 2025
 */

// =============================================================================
// 🎨 COLORES
// =============================================================================

export const colors = {
  // Primary — Naranja Cempasúchil
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

  // Secondary — Ámbar Dorado
  secondary: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#EAB308', // ← Principal
    600: '#CA8A04',
    700: '#A16207',
    800: '#854D0E',
    900: '#713F12',
  },

  // Success — Verde Vida
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E', // ← Principal
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  // Error — Rojo Suave
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444', // ← Principal
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Warning — Amarillo
  warning: {
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

  // Info — Azul
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // ← Principal
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // Accent — Morado Místico
  accent: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6', // ← Principal
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },

  // Neutral — Zinc
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
    850: '#1F1F23',
    900: '#18181B',
    925: '#141414',
    950: '#0A0A0A',
  },

  // Transparent
  transparent: 'transparent',
  
  // Semantic shortcuts
  white: '#FFFFFF',
  black: '#000000',
} as const;

// =============================================================================
// 🌓 TEMAS
// =============================================================================

export const darkTheme = {
  name: 'dark',
  
  // Backgrounds
  background: colors.neutral[950],
  backgroundSecondary: colors.neutral[925],
  backgroundTertiary: colors.neutral[900],
  
  // Surfaces
  surface: colors.neutral[900],
  surfaceHover: colors.neutral[850],
  surfaceActive: colors.neutral[800],
  surfaceElevated: colors.neutral[850],
  
  // Borders
  border: colors.neutral[800],
  borderHover: colors.neutral[700],
  borderFocus: colors.primary[500],
  
  // Text
  textPrimary: colors.neutral[0],
  textSecondary: colors.neutral[300],
  textTertiary: colors.neutral[400],
  textMuted: colors.neutral[500],
  textDisabled: colors.neutral[600],
  textInverse: colors.neutral[950],
  
  // Interactive
  primary: colors.primary[500],
  primaryHover: colors.primary[400],
  primaryActive: colors.primary[600],
  
  // Status
  success: colors.success[500],
  error: colors.error[500],
  warning: colors.warning[500],
  info: colors.info[500],
} as const;

export const lightTheme = {
  name: 'light',
  
  // Backgrounds
  background: colors.secondary[50], // Warm cream
  backgroundSecondary: colors.neutral[0],
  backgroundTertiary: colors.neutral[100],
  
  // Surfaces
  surface: colors.neutral[0],
  surfaceHover: colors.neutral[50],
  surfaceActive: colors.neutral[100],
  surfaceElevated: colors.neutral[0],
  
  // Borders
  border: colors.neutral[200],
  borderHover: colors.neutral[300],
  borderFocus: colors.primary[500],
  
  // Text
  textPrimary: colors.neutral[900],
  textSecondary: colors.neutral[700],
  textTertiary: colors.neutral[600],
  textMuted: colors.neutral[500],
  textDisabled: colors.neutral[400],
  textInverse: colors.neutral[0],
  
  // Interactive
  primary: colors.primary[600],
  primaryHover: colors.primary[700],
  primaryActive: colors.primary[800],
  
  // Status
  success: colors.success[600],
  error: colors.error[600],
  warning: colors.warning[600],
  info: colors.info[600],
} as const;

export type Theme = typeof darkTheme;

// =============================================================================
// 📝 TIPOGRAFÍA
// =============================================================================

export const typography = {
  // Font families (requiere @expo-google-fonts/inter)
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    extrabold: 'Inter_800ExtraBold',
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,    // Para seniors
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
  },

  // Line heights (multiplier)
  lineHeight: {
    none: 1,
    tight: 1.1,
    snug: 1.2,
    normal: 1.4,
    relaxed: 1.5,
    loose: 1.6,
  },

  // Preset styles
  presets: {
    display: {
      fontSize: 40,
      fontFamily: 'Inter_800ExtraBold',
      lineHeight: 44,
    },
    h1: {
      fontSize: 32,
      fontFamily: 'Inter_700Bold',
      lineHeight: 38,
    },
    h2: {
      fontSize: 24,
      fontFamily: 'Inter_600SemiBold',
      lineHeight: 31,
    },
    h3: {
      fontSize: 20,
      fontFamily: 'Inter_600SemiBold',
      lineHeight: 28,
    },
    bodyLarge: {
      fontSize: 18,
      fontFamily: 'Inter_400Regular',
      lineHeight: 29,
    },
    body: {
      fontSize: 16,
      fontFamily: 'Inter_400Regular',
      lineHeight: 26,
    },
    bodySmall: {
      fontSize: 14,
      fontFamily: 'Inter_400Regular',
      lineHeight: 21,
    },
    caption: {
      fontSize: 12,
      fontFamily: 'Inter_500Medium',
      lineHeight: 17,
    },
    button: {
      fontSize: 16,
      fontFamily: 'Inter_600SemiBold',
      lineHeight: 16,
    },
    buttonSmall: {
      fontSize: 14,
      fontFamily: 'Inter_600SemiBold',
      lineHeight: 14,
    },
  },
} as const;

// =============================================================================
// 📏 ESPACIADO
// =============================================================================

export const spacing = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
} as const;

// =============================================================================
// 🔲 BORDER RADIUS
// =============================================================================

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// =============================================================================
// 🌫️ SOMBRAS
// =============================================================================

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
  },
  // Glow para botones primarios
  glow: {
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

// =============================================================================
// ⏱️ ANIMACIONES
// =============================================================================

export const animation = {
  // Duraciones
  duration: {
    instant: 0,
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 500,
  },
  
  // Easings (para Reanimated)
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    // Custom spring config para Reanimated
    spring: {
      damping: 15,
      stiffness: 150,
    },
  },
} as const;

// =============================================================================
// 📐 LAYOUT
// =============================================================================

export const layout = {
  // Screen
  screenPaddingHorizontal: spacing[4], // 16
  screenPaddingVertical: spacing[6], // 24
  
  // Content
  maxContentWidth: 480,
  
  // Header
  headerHeight: 56,
  
  // Tab Bar
  tabBarHeight: 80,
  tabBarPaddingBottom: 24, // Safe area
  
  // Cards
  cardPadding: spacing[4], // 16
  cardBorderRadius: borderRadius.xl, // 16
  
  // Buttons
  buttonHeight: {
    sm: 40,
    md: 48,
    lg: 56, // Accesibilidad
  },
  
  // Inputs
  inputHeight: 52,
  
  // Touch targets (A11y)
  minTouchTarget: 48,
  
  // Avatars
  avatarSize: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    '2xl': 80,
  },
  
  // Icons
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  },
  
  // FAB
  fabSize: 56,
  fabOffset: spacing[4],
} as const;

// =============================================================================
// 🎯 COMPONENTES - ESTILOS BASE
// =============================================================================

export const components = {
  // Botón Primario
  buttonPrimary: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.lg,
    height: layout.buttonHeight.md,
    paddingHorizontal: spacing[6],
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
    backgroundColor: colors.neutral[900],
    borderRadius: borderRadius.lg,
    height: layout.inputHeight,
    paddingHorizontal: spacing[4],
    borderWidth: 1,
    borderColor: colors.neutral[700],
  },
  
  // Card
  card: {
    backgroundColor: colors.neutral[900],
    borderRadius: layout.cardBorderRadius,
    padding: layout.cardPadding,
    borderWidth: 1,
    borderColor: colors.neutral[800],
  },
  
  // Badge
  badge: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2.5],
    borderRadius: borderRadius.full,
  },
} as const;

// =============================================================================
// 🔣 ICONOGRAFÍA
// =============================================================================

export const iconography = {
  // Librería: lucide-react-native
  library: 'lucide-react-native',
  
  // Stroke width default
  strokeWidth: 2,
  
  // Mapeo de iconos de la app
  icons: {
    // Navigation
    home: 'Home',
    legacy: 'FileText',
    guardians: 'Users',
    profile: 'User',
    settings: 'Settings',
    
    // Actions
    add: 'Plus',
    edit: 'Pencil',
    delete: 'Trash2',
    save: 'Save',
    share: 'Share',
    upload: 'Upload',
    download: 'Download',
    
    // Media
    camera: 'Camera',
    video: 'Video',
    mic: 'Mic',
    image: 'Image',
    play: 'Play',
    pause: 'Pause',
    stop: 'Square',
    
    // Status
    heartPulse: 'HeartPulse',
    heart: 'Heart',
    check: 'Check',
    checkCircle: 'CheckCircle',
    alertCircle: 'AlertCircle',
    info: 'Info',
    
    // Security
    lock: 'Lock',
    unlock: 'Unlock',
    shield: 'Shield',
    key: 'Key',
    
    // UI
    arrowLeft: 'ArrowLeft',
    arrowRight: 'ArrowRight',
    chevronDown: 'ChevronDown',
    chevronUp: 'ChevronUp',
    x: 'X',
    menu: 'Menu',
    search: 'Search',
    bell: 'Bell',
    
    // Device
    battery: 'Battery',
    batteryLow: 'BatteryLow',
    batteryCharging: 'BatteryCharging',
  },
} as const;

// =============================================================================
// 📱 EXPORT DEFAULT
// =============================================================================

const designTokens = {
  colors,
  darkTheme,
  lightTheme,
  typography,
  spacing,
  borderRadius,
  shadows,
  animation,
  layout,
  components,
  iconography,
};

export default designTokens;

// =============================================================================
// 🎨 HELPERS
// =============================================================================

/**
 * Obtiene el tema basado en el modo
 */
export const getTheme = (mode: 'dark' | 'light'): Theme => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

/**
 * Crea un estilo de texto con los presets
 */
export const createTextStyle = (
  preset: keyof typeof typography.presets,
  color?: string
) => ({
  ...typography.presets[preset],
  color: color || darkTheme.textPrimary,
});

/**
 * Crea sombra con opacidad personalizada
 */
export const createShadow = (
  level: keyof typeof shadows,
  color?: string
) => ({
  ...shadows[level],
  shadowColor: color || '#000',
});
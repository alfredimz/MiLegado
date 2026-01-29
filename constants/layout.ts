import { Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Layout = {
  // Dimensiones de pantalla
  window: {
    width,
    height,
  },

  // Detectar si es pantalla pequeña
  isSmallDevice: width < 375,

  // Padding seguro
  padding: {
    horizontal: 16,
    vertical: 16,
    screen: 20,
  },

  // Altura de componentes
  headerHeight: Platform.OS === 'ios' ? 88 : 56,
  tabBarHeight: Platform.OS === 'ios' ? 83 : 56,
  statusBarHeight: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,

  // Tamaños de botones (mínimo 48px para accesibilidad)
  buttonHeight: {
    sm: 40,
    md: 48,
    lg: 56,
  },

  // Tamaños de iconos
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
  },

  // Tamaños de avatar
  avatarSize: {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  },

  // Tamaños de tarjetas
  cardWidth: {
    full: width - 40,
    half: (width - 48) / 2,
    third: (width - 56) / 3,
  },

  // Breakpoints
  breakpoints: {
    xs: 0,
    sm: 375,
    md: 414,
    lg: 768,
    xl: 1024,
  },
};

export default Layout;

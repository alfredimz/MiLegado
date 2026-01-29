// Re-exportar todos los tipos
export * from './user';
export * from './carta';
export * from './guardian';

// Tipos de navegación
export type RootStackParamList = {
  '(auth)': undefined;
  '(tabs)': undefined;
  crear: undefined;
};

export type AuthStackParamList = {
  splash: undefined;
  onboarding: undefined;
  login: undefined;
  register: undefined;
};

export type TabsParamList = {
  index: undefined;
  cartas: undefined;
  guardianes: undefined;
  perfil: undefined;
};

export type CartasStackParamList = {
  index: undefined;
  '[id]': { id: string };
};

export type GuardianesStackParamList = {
  index: undefined;
  '[id]': { id: string };
};

export type CrearStackParamList = {
  index: undefined;
  texto: undefined;
  media: { tipo: 'foto' | 'video' | 'audio' };
  preview: undefined;
};

// Tipos de estado de la app
export interface AppState {
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
}

// Tipos de AsyncStorage keys
export const STORAGE_KEYS = {
  USER_SESSION: '@milegado/user_session',
  ONBOARDING_COMPLETE: '@milegado/onboarding_complete',
  DRAFT_CARTA: '@milegado/draft_carta',
  LAST_SYNC: '@milegado/last_sync',
  APP_SETTINGS: '@milegado/app_settings',
  THEME_MODE: '@milegado/theme_mode',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// Tipos comunes
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

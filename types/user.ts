// Tipos relacionados con el usuario

export interface UserSettings {
  latidoInterval: 30 | 60 | 90; // días entre verificaciones de "latido"
  notificationsEnabled: boolean;
  theme: 'dark' | 'light' | 'system';
  language: 'es-MX';
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  plan: 'free' | 'premium';
  createdAt: Date;
  lastActive: Date;
  settings: UserSettings;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  dateOfBirth?: Date;
  location?: string;
}

// Para Firestore (serializado)
export interface UserDocument {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  plan: 'free' | 'premium';
  createdAt: string; // ISO date string
  lastActive: string; // ISO date string
  settings: UserSettings;
}

// Datos para crear usuario
export interface CreateUserData {
  email: string;
  displayName: string;
  photoURL?: string;
}

// Datos para actualizar usuario
export interface UpdateUserData {
  displayName?: string;
  photoURL?: string;
  settings?: Partial<UserSettings>;
}

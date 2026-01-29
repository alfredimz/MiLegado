// Configuración de Firebase para MiLegado (Mobile Only)
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, initializeAuth } from 'firebase/auth';
//@ts-expect-error - getReactNativePersistence exists in react-native bundle
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de Firebase
// IMPORTANTE: Reemplazar estos valores con los de tu proyecto Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'TU_API_KEY',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'tu-proyecto.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'tu-proyecto',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'tu-proyecto.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abc123',
};

// Inicializar Firebase (singleton)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  // Persistencia con AsyncStorage para React Native
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApp();
  auth = getAuth(app);
}

db = getFirestore(app);
storage = getStorage(app);

// Colecciones de Firestore
export const COLLECTIONS = {
  USERS: 'users',
  CARTAS: 'cartas',
  GUARDIANES: 'guardianes',
} as const;

// Rutas de Storage
export const STORAGE_PATHS = {
  USER_AVATARS: (userId: string) => `users/${userId}/avatar`,
  CARTA_MEDIA: (userId: string, cartaId: string) => `users/${userId}/cartas/${cartaId}`,
} as const;

export { app, auth, db, storage };
export default app;

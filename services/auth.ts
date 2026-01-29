// Servicios de autenticación con Firebase Auth
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
  UserCredential,
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserDocument, getUserDocument } from './firestore';
import type { User, CreateUserData } from '../types';

// Registrar nuevo usuario
export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  try {
    // Crear usuario en Firebase Auth
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Actualizar perfil con nombre
    await updateProfile(userCredential.user, { displayName });

    // Crear documento de usuario en Firestore
    const userData: CreateUserData = {
      email,
      displayName,
    };
    const user = await createUserDocument(userCredential.user.uid, userData);

    return user;
  } catch (error: any) {
    throw handleAuthError(error);
  }
}

// Iniciar sesión
export async function signIn(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Obtener datos del usuario de Firestore
    const user = await getUserDocument(userCredential.user.uid);

    if (!user) {
      throw new Error('No se encontró el perfil del usuario');
    }

    return user;
  } catch (error: any) {
    throw handleAuthError(error);
  }
}

// Cerrar sesión
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw handleAuthError(error);
  }
}

// Restablecer contraseña
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw handleAuthError(error);
  }
}

// Obtener usuario actual
export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

// Suscribirse a cambios de autenticación
export function subscribeToAuthChanges(
  callback: (user: FirebaseUser | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

// Manejar errores de autenticación (traducidos al español)
function handleAuthError(error: any): Error {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'Este correo electrónico ya está registrado',
    'auth/invalid-email': 'El correo electrónico no es válido',
    'auth/operation-not-allowed': 'Operación no permitida',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/user-not-found': 'No existe una cuenta con este correo electrónico',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/invalid-credential': 'Credenciales inválidas',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
  };

  const message = errorMessages[error.code] || error.message || 'Error de autenticación';
  return new Error(message);
}

export default {
  signUp,
  signIn,
  signOut,
  resetPassword,
  getCurrentUser,
  subscribeToAuthChanges,
};

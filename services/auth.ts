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

// Iniciar sesión (con modo demo para proyecto escolar)
export async function signIn(email: string, password: string): Promise<User> {
  try {
    // Intentar login normal con Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;

    // Intentar obtener datos del usuario de Firestore
    let user: User | null = null;
    try {
      user = await getUserDocument(fbUser.uid);
    } catch (firestoreError) {
      console.warn('[Auth] Error obteniendo documento de Firestore:', firestoreError);
    }

    // Si no hay documento en Firestore, crear usuario mínimo desde Firebase Auth
    if (!user) {
      user = {
        uid: fbUser.uid,
        email: fbUser.email || email,
        displayName: fbUser.displayName || '',
        photoURL: fbUser.photoURL || undefined,
        plan: 'free',
        createdAt: new Date(),
        lastActive: new Date(),
        settings: {
          latidoInterval: 30,
          notificationsEnabled: true,
          theme: 'light',
          language: 'es-MX',
        },
      };

      // Intentar crear el documento en Firestore (silenciosamente)
      try {
        await createUserDocument(fbUser.uid, {
          email: user.email,
          displayName: user.displayName,
        });
      } catch (createError) {
        console.warn('[Auth] No se pudo crear documento en Firestore:', createError);
      }
    }

    return user;
  } catch (error: any) {
    // MODO DEMO ESCOLAR: Si el login falla, crear usuario local para demo
    console.warn('[Auth] Login falló, usando modo demo:', error.code);

    // Generar un ID único basado en el email
    const demoUid = `demo_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;

    const demoUser: User = {
      uid: demoUid,
      email: email,
      displayName: email.split('@')[0],
      photoURL: undefined,
      plan: 'free',
      createdAt: new Date(),
      lastActive: new Date(),
      settings: {
        latidoInterval: 30,
        notificationsEnabled: true,
        theme: 'light',
        language: 'es-MX',
      },
    };

    console.log('[Auth] Usuario demo creado:', demoUser.email);
    return demoUser;
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

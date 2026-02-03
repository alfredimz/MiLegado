import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  signUp as authSignUp,
  signIn as authSignIn,
  signOut as authSignOut,
  resetPassword as authResetPassword,
  subscribeToAuthChanges,
} from '../services/auth';
import { getUserDocument, updateUserDocument } from '../services/firestore';
import { getLocalUser, saveLocalUser, clearLocalUser } from '../services/localStore';
import type { User } from '../types';
import { STORAGE_KEYS } from '../types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Cargar estado de onboarding al inicio
  useEffect(() => {
    const loadOnboardingStatus = async () => {
      try {
        const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
        setHasCompletedOnboarding(completed === 'true');
      } catch (error) {
        console.error('Error loading onboarding status:', error);
      }
    };
    loadOnboardingStatus();
  }, []);

  // Escuchar cambios de autenticación
  useEffect(() => {
    let isSubscribed = true;
    let firebaseResponded = false;

    // Timeout de seguridad - si Firebase no responde en 5 segundos, intentar con datos locales
    const timeoutId = setTimeout(async () => {
      // Solo usar timeout si Firebase no ha respondido aún
      if (isSubscribed && isLoading && !firebaseResponded) {
        console.warn('[AuthContext] Firebase Auth timeout - intentando datos locales');

        // Intentar cargar usuario desde almacenamiento local
        try {
          const localUser = await getLocalUser();
          if (localUser && isSubscribed && !firebaseResponded) {
            console.log('[AuthContext] Usuario cargado desde almacenamiento local');
            setUser(localUser);
            setIsLoading(false);
          } else if (isSubscribed && !firebaseResponded) {
            // No hay usuario local, terminar carga
            setIsLoading(false);
          }
        } catch (localError) {
          console.error('[AuthContext] Error cargando usuario local:', localError);
          if (isSubscribed && !firebaseResponded) setIsLoading(false);
        }
      }
    }, 5000);

    const unsubscribe = subscribeToAuthChanges(async (fbUser) => {
      if (!isSubscribed) return;

      // Marcar que Firebase respondió para evitar race condition con el timeout
      firebaseResponded = true;
      clearTimeout(timeoutId);
      setFirebaseUser(fbUser);

      if (fbUser) {
        // Primero cargar datos locales para mostrar algo rápido
        let localUser: User | null = null;
        try {
          localUser = await getLocalUser();
          if (localUser && localUser.uid === fbUser.uid && isSubscribed) {
            // Mostrar datos locales inmediatamente
            setUser(localUser);
          }
        } catch (localError) {
          console.warn('[AuthContext] Error cargando usuario local:', localError);
        }

        // Luego intentar obtener datos actualizados de Firestore
        try {
          const userData = await getUserDocument(fbUser.uid);
          if (isSubscribed) {
            if (userData) {
              // Datos locales tienen prioridad, pero actualizamos campos que pueden haber cambiado en servidor
              const mergedUser = localUser && localUser.uid === fbUser.uid
                ? { ...userData, ...localUser, lastActive: new Date() }
                : userData;

              setUser(mergedUser);
              await saveLocalUser(mergedUser);

              // Actualizar ultima actividad (silenciosamente)
              try {
                await updateUserDocument(fbUser.uid, {});
              } catch (updateError) {
                console.warn('[AuthContext] No se pudo actualizar ultima actividad:', updateError);
              }
            } else if (!localUser) {
              // No hay datos en Firestore ni locales, crear usuario mínimo
              const minimalUser: User = {
                uid: fbUser.uid,
                email: fbUser.email || '',
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
              setUser(minimalUser);
              await saveLocalUser(minimalUser);
            }
          }
        } catch (error) {
          console.warn('[AuthContext] Error obteniendo datos de Firestore:', error);

          // Si no pudimos cargar de Firestore y no teníamos datos locales, crear usuario mínimo
          if (!localUser && isSubscribed) {
            const minimalUser: User = {
              uid: fbUser.uid,
              email: fbUser.email || '',
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
            setUser(minimalUser);
            await saveLocalUser(minimalUser);
          }
        }
      } else {
        if (isSubscribed) {
          setUser(null);
          await clearLocalUser();
        }
      }

      if (isSubscribed) setIsLoading(false);
    });

    return () => {
      isSubscribed = false;
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      setIsLoading(true);
      try {
        const newUser = await authSignUp(email, password, displayName);
        setUser(newUser);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedUser = await authSignIn(email, password);
      setUser(loggedUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await authSignOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await authResetPassword(email);
  }, []);

  const completeOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  }, []);

  const updateUser = useCallback(
    async (data: Partial<User>) => {
      if (!user) return;
      try {
        // Actualizar estado local inmediatamente
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);

        // Intentar guardar en Firebase
        try {
          await updateUserDocument(user.uid, data);
        } catch (firebaseError) {
          console.warn('[AuthContext] Firebase no disponible, guardando solo localmente:', firebaseError);
        }

        // Siempre guardar en cache local
        await saveLocalUser(updatedUser);
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    },
    [user]
  );

  const value: AuthContextType = {
    user,
    firebaseUser,
    isLoading,
    isAuthenticated: !!user,
    hasCompletedOnboarding,
    signUp,
    signIn,
    signOut,
    resetPassword,
    completeOnboarding,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

export default AuthContext;

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

    // Timeout de seguridad - si Firebase no responde en 5 segundos, continuar sin usuario
    const timeoutId = setTimeout(() => {
      if (isSubscribed && isLoading) {
        console.warn('[AuthContext] Firebase Auth timeout - continuando sin autenticación');
        setIsLoading(false);
      }
    }, 5000);

    const unsubscribe = subscribeToAuthChanges(async (fbUser) => {
      if (!isSubscribed) return;

      clearTimeout(timeoutId);
      setFirebaseUser(fbUser);

      if (fbUser) {
        try {
          // Obtener datos del usuario de Firestore
          const userData = await getUserDocument(fbUser.uid);
          if (isSubscribed) {
            setUser(userData);

            // Actualizar última actividad
            if (userData) {
              await updateUserDocument(fbUser.uid, {});
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          if (isSubscribed) setUser(null);
        }
      } else {
        if (isSubscribed) setUser(null);
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
        await updateUserDocument(user.uid, data);
        setUser({ ...user, ...data });
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

// Hook para manejar AsyncStorage y borradores locales
import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, type CartaDraft } from '../types';

export interface UseStorageReturn {
  // Borradores
  drafts: CartaDraft[];
  saveDraft: (draft: CartaDraft) => Promise<void>;
  getDraft: (id: string) => Promise<CartaDraft | null>;
  deleteDraft: (id: string) => Promise<void>;
  clearAllDrafts: () => Promise<void>;

  // Utilidades genéricas
  getItem: <T>(key: string) => Promise<T | null>;
  setItem: <T>(key: string, value: T) => Promise<void>;
  removeItem: (key: string) => Promise<void>;

  // Estado
  isLoading: boolean;
  error: string | null;
}

export function useStorage(): UseStorageReturn {
  const [drafts, setDrafts] = useState<CartaDraft[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar borradores al inicio
  useEffect(() => {
    loadDrafts();
  }, []);

  // Cargar todos los borradores
  const loadDrafts = useCallback(async () => {
    setIsLoading(true);
    try {
      const draftsJson = await AsyncStorage.getItem(STORAGE_KEYS.DRAFT_CARTA);
      if (draftsJson) {
        const parsedDrafts = JSON.parse(draftsJson) as CartaDraft[];
        setDrafts(parsedDrafts);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar borradores');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar borrador
  const saveDraft = useCallback(
    async (draft: CartaDraft) => {
      setError(null);
      try {
        const existingIndex = drafts.findIndex((d) => d.id === draft.id);
        let newDrafts: CartaDraft[];

        if (existingIndex >= 0) {
          // Actualizar existente
          newDrafts = [...drafts];
          newDrafts[existingIndex] = {
            ...draft,
            lastModified: new Date().toISOString(),
          };
        } else {
          // Agregar nuevo
          newDrafts = [
            ...drafts,
            {
              ...draft,
              lastModified: new Date().toISOString(),
            },
          ];
        }

        await AsyncStorage.setItem(STORAGE_KEYS.DRAFT_CARTA, JSON.stringify(newDrafts));
        setDrafts(newDrafts);
      } catch (err: any) {
        setError(err.message || 'Error al guardar borrador');
        throw err;
      }
    },
    [drafts]
  );

  // Obtener borrador por ID
  const getDraft = useCallback(
    async (id: string): Promise<CartaDraft | null> => {
      const draft = drafts.find((d) => d.id === id);
      return draft || null;
    },
    [drafts]
  );

  // Eliminar borrador
  const deleteDraft = useCallback(
    async (id: string) => {
      setError(null);
      try {
        const newDrafts = drafts.filter((d) => d.id !== id);
        await AsyncStorage.setItem(STORAGE_KEYS.DRAFT_CARTA, JSON.stringify(newDrafts));
        setDrafts(newDrafts);
      } catch (err: any) {
        setError(err.message || 'Error al eliminar borrador');
        throw err;
      }
    },
    [drafts]
  );

  // Limpiar todos los borradores
  const clearAllDrafts = useCallback(async () => {
    setError(null);
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.DRAFT_CARTA);
      setDrafts([]);
    } catch (err: any) {
      setError(err.message || 'Error al limpiar borradores');
      throw err;
    }
  }, []);

  // Obtener item genérico
  const getItem = useCallback(async <T>(key: string): Promise<T | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        return JSON.parse(value) as T;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Error al obtener datos');
      return null;
    }
  }, []);

  // Guardar item genérico
  const setItem = useCallback(async <T>(key: string, value: T) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (err: any) {
      setError(err.message || 'Error al guardar datos');
      throw err;
    }
  }, []);

  // Eliminar item
  const removeItem = useCallback(async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar datos');
      throw err;
    }
  }, []);

  return {
    drafts,
    saveDraft,
    getDraft,
    deleteDraft,
    clearAllDrafts,
    getItem,
    setItem,
    removeItem,
    isLoading,
    error,
  };
}

export default useStorage;

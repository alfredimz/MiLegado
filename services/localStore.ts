// Servicio de almacenamiento local para fallback cuando Firebase no responde
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Guardian, Carta, User } from '../types';

const KEYS = {
  GUARDIANES: '@milegado_guardianes',
  CARTAS: '@milegado_cartas',
  USER: '@milegado_user',
  PENDING_SYNC: '@milegado_pending_sync',
};

// ============ GUARDIANES LOCAL ============

export async function getLocalGuardianes(userId: string): Promise<Guardian[]> {
  try {
    const data = await AsyncStorage.getItem(`${KEYS.GUARDIANES}_${userId}`);
    if (data) {
      const guardianes = JSON.parse(data) as Guardian[];
      // Convertir strings de fecha a objetos Date
      return guardianes.map(g => ({
        ...g,
        createdAt: new Date(g.createdAt),
        updatedAt: new Date(g.updatedAt),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting local guardianes:', error);
    return [];
  }
}

export async function saveLocalGuardian(userId: string, guardian: Guardian): Promise<void> {
  try {
    const guardianes = await getLocalGuardianes(userId);
    const existingIndex = guardianes.findIndex(g => g.id === guardian.id);

    if (existingIndex >= 0) {
      guardianes[existingIndex] = guardian;
    } else {
      guardianes.push(guardian);
    }

    await AsyncStorage.setItem(
      `${KEYS.GUARDIANES}_${userId}`,
      JSON.stringify(guardianes)
    );
  } catch (error) {
    console.error('Error saving local guardian:', error);
    throw error;
  }
}

export async function deleteLocalGuardian(userId: string, guardianId: string): Promise<void> {
  try {
    const guardianes = await getLocalGuardianes(userId);
    const filtered = guardianes.filter(g => g.id !== guardianId);
    await AsyncStorage.setItem(
      `${KEYS.GUARDIANES}_${userId}`,
      JSON.stringify(filtered)
    );
  } catch (error) {
    console.error('Error deleting local guardian:', error);
    throw error;
  }
}

export async function setLocalGuardianes(userId: string, guardianes: Guardian[]): Promise<void> {
  try {
    await AsyncStorage.setItem(
      `${KEYS.GUARDIANES}_${userId}`,
      JSON.stringify(guardianes)
    );
  } catch (error) {
    console.error('Error setting local guardianes:', error);
    throw error;
  }
}

// ============ CARTAS LOCAL ============

export async function getLocalCartas(userId: string): Promise<Carta[]> {
  try {
    const data = await AsyncStorage.getItem(`${KEYS.CARTAS}_${userId}`);
    if (data) {
      const cartas = JSON.parse(data) as Carta[];
      // Convertir strings de fecha a objetos Date
      return cartas.map(c => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
        scheduledDate: c.scheduledDate ? new Date(c.scheduledDate) : undefined,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting local cartas:', error);
    return [];
  }
}

export async function saveLocalCarta(userId: string, carta: Carta): Promise<void> {
  try {
    const cartas = await getLocalCartas(userId);
    const existingIndex = cartas.findIndex(c => c.id === carta.id);

    if (existingIndex >= 0) {
      cartas[existingIndex] = carta;
    } else {
      cartas.push(carta);
    }

    await AsyncStorage.setItem(
      `${KEYS.CARTAS}_${userId}`,
      JSON.stringify(cartas)
    );
  } catch (error) {
    console.error('Error saving local carta:', error);
    throw error;
  }
}

export async function deleteLocalCarta(userId: string, cartaId: string): Promise<void> {
  try {
    const cartas = await getLocalCartas(userId);
    const filtered = cartas.filter(c => c.id !== cartaId);
    await AsyncStorage.setItem(
      `${KEYS.CARTAS}_${userId}`,
      JSON.stringify(filtered)
    );
  } catch (error) {
    console.error('Error deleting local carta:', error);
    throw error;
  }
}

export async function setLocalCartas(userId: string, cartas: Carta[]): Promise<void> {
  try {
    await AsyncStorage.setItem(
      `${KEYS.CARTAS}_${userId}`,
      JSON.stringify(cartas)
    );
  } catch (error) {
    console.error('Error setting local cartas:', error);
    throw error;
  }
}

// ============ USER LOCAL ============

export async function getLocalUser(): Promise<User | null> {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER);
    if (data) {
      const user = JSON.parse(data) as User;
      return {
        ...user,
        createdAt: new Date(user.createdAt),
        lastActive: new Date(user.lastActive),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting local user:', error);
    return null;
  }
}

export async function saveLocalUser(user: User): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving local user:', error);
    throw error;
  }
}

export async function clearLocalUser(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.USER);
  } catch (error) {
    console.error('Error clearing local user:', error);
  }
}

// ============ PENDING SYNC ============

interface PendingAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  collection: 'guardianes' | 'cartas';
  data: any;
  timestamp: string;
}

export async function addPendingSync(action: Omit<PendingAction, 'id' | 'timestamp'>): Promise<void> {
  try {
    const pending = await getPendingSyncs();
    const newAction: PendingAction = {
      ...action,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    pending.push(newAction);
    await AsyncStorage.setItem(KEYS.PENDING_SYNC, JSON.stringify(pending));
  } catch (error) {
    console.error('Error adding pending sync:', error);
  }
}

export async function getPendingSyncs(): Promise<PendingAction[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.PENDING_SYNC);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting pending syncs:', error);
    return [];
  }
}

export async function clearPendingSyncs(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.PENDING_SYNC);
  } catch (error) {
    console.error('Error clearing pending syncs:', error);
  }
}

export async function removePendingSync(actionId: string): Promise<void> {
  try {
    const pending = await getPendingSyncs();
    const filtered = pending.filter(p => p.id !== actionId);
    await AsyncStorage.setItem(KEYS.PENDING_SYNC, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing pending sync:', error);
  }
}

// ============ UTILITIES ============

export async function clearAllLocalData(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const milegadoKeys = keys.filter(key => key.startsWith('@milegado_'));
    await AsyncStorage.multiRemove(milegadoKeys);
  } catch (error) {
    console.error('Error clearing all local data:', error);
  }
}

// Generar ID local temporal
export function generateLocalId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default {
  // Guardianes
  getLocalGuardianes,
  saveLocalGuardian,
  deleteLocalGuardian,
  setLocalGuardianes,
  // Cartas
  getLocalCartas,
  saveLocalCarta,
  deleteLocalCarta,
  setLocalCartas,
  // User
  getLocalUser,
  saveLocalUser,
  clearLocalUser,
  // Sync
  addPendingSync,
  getPendingSyncs,
  clearPendingSyncs,
  removePendingSync,
  // Utils
  clearAllLocalData,
  generateLocalId,
};

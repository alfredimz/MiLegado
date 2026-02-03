// Servicio de sincronización para procesar acciones pendientes cuando Firebase esté disponible
import {
  getPendingSyncs,
  removePendingSync,
  saveIdMapping,
  getLocalGuardianes,
  saveLocalGuardian,
  getLocalCartas,
  saveLocalCarta,
} from './localStore';
import {
  createGuardian,
  updateGuardian,
  deleteGuardian,
  createCarta,
  updateCarta,
  deleteCarta,
} from './firestore';
import type { Guardian, Carta, CreateGuardianData, CreateCartaData } from '../types';

interface SyncResult {
  success: boolean;
  syncedCount: number;
  failedCount: number;
  errors: string[];
}

// Procesar todas las acciones pendientes de sincronización
export async function processPendingSyncs(userId: string): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    syncedCount: 0,
    failedCount: 0,
    errors: [],
  };

  try {
    const pendingActions = await getPendingSyncs();

    if (pendingActions.length === 0) {
      return result;
    }

    console.log(`[SyncService] Procesando ${pendingActions.length} acciones pendientes`);

    for (const action of pendingActions) {
      try {
        if (action.collection === 'guardianes') {
          await processGuardianAction(userId, action);
        } else if (action.collection === 'cartas') {
          await processCartaAction(userId, action);
        }

        // Eliminar acción procesada exitosamente
        await removePendingSync(action.id);
        result.syncedCount++;
        console.log(`[SyncService] Acción sincronizada: ${action.type} ${action.collection}`);
      } catch (error: any) {
        console.warn(`[SyncService] Error procesando acción ${action.id}:`, error);
        result.failedCount++;
        result.errors.push(error.message || 'Error desconocido');
        // No removemos la acción para reintentar después
      }
    }

    result.success = result.failedCount === 0;
  } catch (error: any) {
    console.error('[SyncService] Error general:', error);
    result.success = false;
    result.errors.push(error.message || 'Error general de sincronización');
  }

  return result;
}

async function processGuardianAction(userId: string, action: any): Promise<void> {
  const { type, data } = action;
  const localId = data.localId;

  switch (type) {
    case 'create': {
      const guardianData: CreateGuardianData = {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        relacion: data.relacion,
        photoURL: data.photoURL,
        notas: data.notas,
      };

      const newGuardian = await createGuardian(userId, guardianData);

      // Guardar mapeo de ID local a Firebase
      if (localId) {
        await saveIdMapping(localId, newGuardian.id);

        // Actualizar el guardián local con el nuevo ID de Firebase
        const localGuardianes = await getLocalGuardianes(userId);
        const updatedGuardianes = localGuardianes.map(g => {
          if (g.id === localId) {
            return { ...g, id: newGuardian.id };
          }
          return g;
        });

        // Actualizar cartas que referencian el ID local
        await updateCartasWithNewGuardianId(userId, localId, newGuardian.id);
      }
      break;
    }
    case 'update': {
      if (data.id && !data.id.startsWith('local_')) {
        await updateGuardian(data.id, data);
      }
      break;
    }
    case 'delete': {
      if (data.id && !data.id.startsWith('local_')) {
        await deleteGuardian(data.id);
      }
      break;
    }
  }
}

async function processCartaAction(userId: string, action: any): Promise<void> {
  const { type, data } = action;
  const localId = data.localId;

  switch (type) {
    case 'create': {
      const cartaData: CreateCartaData = {
        titulo: data.titulo,
        tipo: data.tipo,
        contenido: data.contenido,
        guardianes: data.guardianes,
        estado: data.estado,
        tags: data.tags,
      };

      const newCarta = await createCarta(userId, cartaData);

      if (localId) {
        await saveIdMapping(localId, newCarta.id);
      }
      break;
    }
    case 'update': {
      if (data.id && !data.id.startsWith('local_')) {
        await updateCarta(data.id, data);
      }
      break;
    }
    case 'delete': {
      if (data.id && !data.id.startsWith('local_')) {
        await deleteCarta(data.id);
      }
      break;
    }
  }
}

// Actualizar cartas que referencian un ID de guardián local con el nuevo ID de Firebase
async function updateCartasWithNewGuardianId(
  userId: string,
  oldId: string,
  newId: string
): Promise<void> {
  try {
    const cartas = await getLocalCartas(userId);
    let updated = false;

    for (const carta of cartas) {
      if (carta.guardianes.includes(oldId)) {
        carta.guardianes = carta.guardianes.map(gId => gId === oldId ? newId : gId);
        await saveLocalCarta(userId, carta);
        updated = true;
      }
    }

    if (updated) {
      console.log(`[SyncService] Actualizadas referencias de guardián ${oldId} -> ${newId}`);
    }
  } catch (error) {
    console.warn('[SyncService] Error actualizando referencias de guardián:', error);
  }
}

// Combinar datos locales con remotos, dando prioridad a los locales
export function mergeWithLocalPriority<T extends { id: string; updatedAt: Date }>(
  localData: T[],
  remoteData: T[]
): T[] {
  const merged = new Map<string, T>();

  // Primero agregar todos los remotos
  for (const item of remoteData) {
    merged.set(item.id, item);
  }

  // Luego agregar/sobrescribir con locales (prioridad local)
  for (const item of localData) {
    // Los items locales siempre tienen prioridad
    merged.set(item.id, item);
  }

  // Convertir a array y ordenar por updatedAt descendente
  return Array.from(merged.values()).sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );
}

// Verificar si hay acciones pendientes
export async function hasPendingSyncs(): Promise<boolean> {
  const pending = await getPendingSyncs();
  return pending.length > 0;
}

export default {
  processPendingSyncs,
  mergeWithLocalPriority,
  hasPendingSyncs,
};

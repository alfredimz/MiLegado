// Servicios de Firestore para MiLegado
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db, COLLECTIONS } from './firebase';
import type {
  User,
  UserDocument,
  CreateUserData,
  UpdateUserData,
  Carta,
  CartaDocument,
  CreateCartaData,
  UpdateCartaData,
  Guardian,
  GuardianDocument,
  CreateGuardianData,
  UpdateGuardianData,
  CartaFilters,
} from '../types';

// ============ USUARIOS ============

// Crear documento de usuario
export async function createUserDocument(
  uid: string,
  data: CreateUserData
): Promise<User> {
  const now = new Date().toISOString();
  const userDoc: UserDocument = {
    uid,
    email: data.email,
    displayName: data.displayName || '',
    photoURL: data.photoURL || null,
    plan: 'free',
    createdAt: now,
    lastActive: now,
    settings: {
      latidoInterval: 30,
      notificationsEnabled: true,
      theme: 'dark',
      language: 'es-MX',
    },
  };

  await setDoc(doc(db, COLLECTIONS.USERS, uid), userDoc);

  return documentToUser(userDoc);
}

// Obtener usuario por ID
export async function getUserDocument(uid: string): Promise<User | null> {
  const docRef = doc(db, COLLECTIONS.USERS, uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return documentToUser(docSnap.data() as UserDocument);
}

// Actualizar usuario
export async function updateUserDocument(
  uid: string,
  data: UpdateUserData
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.USERS, uid);
  await updateDoc(docRef, {
    ...data,
    lastActive: new Date().toISOString(),
  });
}

// Convertir documento a User
function documentToUser(doc: UserDocument): User {
  return {
    ...doc,
    createdAt: new Date(doc.createdAt),
    lastActive: new Date(doc.lastActive),
  };
}

// ============ CARTAS ============

// Crear carta
export async function createCarta(
  userId: string,
  data: CreateCartaData
): Promise<Carta> {
  const now = new Date().toISOString();
  const cartaDoc: Omit<CartaDocument, 'id'> = {
    userId,
    titulo: data.titulo,
    tipo: data.tipo,
    contenido: data.contenido,
    guardianes: data.guardianes || [],
    estado: 'borrador',
    createdAt: now,
    updatedAt: now,
    tags: data.tags || [],
  };

  const docRef = await addDoc(collection(db, COLLECTIONS.CARTAS), cartaDoc);

  return {
    id: docRef.id,
    userId,
    titulo: data.titulo,
    tipo: data.tipo,
    contenido: data.contenido,
    guardianes: data.guardianes || [],
    estado: 'borrador',
    createdAt: new Date(now),
    updatedAt: new Date(now),
    tags: data.tags || [],
  };
}

// Obtener carta por ID
export async function getCarta(cartaId: string): Promise<Carta | null> {
  const docRef = doc(db, COLLECTIONS.CARTAS, cartaId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return documentToCarta(docSnap.id, docSnap.data() as CartaDocument);
}

// Obtener cartas de un usuario
export async function getUserCartas(
  userId: string,
  filters?: CartaFilters
): Promise<Carta[]> {
  const constraints: QueryConstraint[] = [
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc'),
  ];

  if (filters?.tipo) {
    constraints.push(where('tipo', '==', filters.tipo));
  }

  if (filters?.estado) {
    constraints.push(where('estado', '==', filters.estado));
  }

  const q = query(collection(db, COLLECTIONS.CARTAS), ...constraints);
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) =>
    documentToCarta(doc.id, doc.data() as CartaDocument)
  );
}

// Actualizar carta
export async function updateCarta(
  cartaId: string,
  data: UpdateCartaData
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.CARTAS, cartaId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// Eliminar carta
export async function deleteCarta(cartaId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.CARTAS, cartaId);
  await deleteDoc(docRef);
}

// Convertir documento a Carta
function documentToCarta(id: string, doc: CartaDocument): Carta {
  return {
    ...doc,
    id,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
    scheduledDate: doc.scheduledDate ? new Date(doc.scheduledDate) : undefined,
  };
}

// ============ GUARDIANES ============

// Crear guardián
export async function createGuardian(
  userId: string,
  data: CreateGuardianData
): Promise<Guardian> {
  const now = new Date().toISOString();
  const guardianDoc: Omit<GuardianDocument, 'id'> = {
    userId,
    nombre: data.nombre,
    email: data.email || null,
    telefono: data.telefono || null,
    relacion: data.relacion,
    photoURL: data.photoURL || null,
    notas: data.notas || null,
    createdAt: now,
    updatedAt: now,
    isVerified: false,
  };

  const docRef = await addDoc(collection(db, COLLECTIONS.GUARDIANES), guardianDoc);

  return {
    ...guardianDoc,
    id: docRef.id,
    createdAt: new Date(now),
    updatedAt: new Date(now),
  };
}

// Obtener guardián por ID
export async function getGuardian(guardianId: string): Promise<Guardian | null> {
  const docRef = doc(db, COLLECTIONS.GUARDIANES, guardianId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return documentToGuardian(docSnap.id, docSnap.data() as GuardianDocument);
}

// Obtener guardianes de un usuario
export async function getUserGuardianes(userId: string): Promise<Guardian[]> {
  const q = query(
    collection(db, COLLECTIONS.GUARDIANES),
    where('userId', '==', userId),
    orderBy('nombre', 'asc')
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) =>
    documentToGuardian(doc.id, doc.data() as GuardianDocument)
  );
}

// Actualizar guardián
export async function updateGuardian(
  guardianId: string,
  data: UpdateGuardianData
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.GUARDIANES, guardianId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// Eliminar guardián
export async function deleteGuardian(guardianId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.GUARDIANES, guardianId);
  await deleteDoc(docRef);
}

// Convertir documento a Guardian
function documentToGuardian(id: string, doc: GuardianDocument): Guardian {
  return {
    ...doc,
    id,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
  };
}

export default {
  // Usuarios
  createUserDocument,
  getUserDocument,
  updateUserDocument,
  // Cartas
  createCarta,
  getCarta,
  getUserCartas,
  updateCarta,
  deleteCarta,
  // Guardianes
  createGuardian,
  getGuardian,
  getUserGuardianes,
  updateGuardian,
  deleteGuardian,
};

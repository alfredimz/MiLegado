// Tipos relacionados con los guardianes

export type RelacionGuardian =
  | 'esposo/a'
  | 'hijo/a'
  | 'padre/madre'
  | 'hermano/a'
  | 'abuelo/a'
  | 'nieto/a'
  | 'tío/a'
  | 'sobrino/a'
  | 'primo/a'
  | 'amigo/a'
  | 'otro';

export interface Guardian {
  id: string;
  userId: string; // Dueño de este guardián
  nombre: string;
  email: string;
  telefono?: string;
  relacion: RelacionGuardian;
  photoURL?: string;
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean; // Si el guardián ha verificado su email
}

// Para Firestore (serializado)
export interface GuardianDocument {
  id: string;
  userId: string;
  nombre: string;
  email: string;
  telefono?: string;
  relacion: RelacionGuardian;
  photoURL?: string;
  notas?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isVerified: boolean;
}

// Datos para crear guardián
export interface CreateGuardianData {
  nombre: string;
  email: string;
  telefono?: string;
  relacion: RelacionGuardian;
  photoURL?: string;
  notas?: string;
}

// Datos para actualizar guardián
export interface UpdateGuardianData {
  nombre?: string;
  email?: string;
  telefono?: string;
  relacion?: RelacionGuardian;
  photoURL?: string;
  notas?: string;
}

// Guardian con información de cartas asignadas
export interface GuardianWithCartas extends Guardian {
  cartasAsignadas: number;
  cartaIds: string[];
}

// Opciones de relación para select/picker
export const RELACION_OPTIONS: { value: RelacionGuardian; label: string }[] = [
  { value: 'esposo/a', label: 'Esposo/a' },
  { value: 'hijo/a', label: 'Hijo/a' },
  { value: 'padre/madre', label: 'Padre/Madre' },
  { value: 'hermano/a', label: 'Hermano/a' },
  { value: 'abuelo/a', label: 'Abuelo/a' },
  { value: 'nieto/a', label: 'Nieto/a' },
  { value: 'tío/a', label: 'Tío/a' },
  { value: 'sobrino/a', label: 'Sobrino/a' },
  { value: 'primo/a', label: 'Primo/a' },
  { value: 'amigo/a', label: 'Amigo/a' },
  { value: 'otro', label: 'Otro' },
];

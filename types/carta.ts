// Tipos relacionados con las cartas (legados)

export type TipoCarta = 'texto' | 'audio' | 'video' | 'mixta';
export type EstadoCarta = 'borrador' | 'activa' | 'entregada';

export interface ContenidoCarta {
  texto?: string;
  audioUrl?: string;
  videoUrl?: string;
  imageUrls?: string[];
  thumbnailUrl?: string;
}

export interface Carta {
  id: string;
  userId: string;
  titulo: string;
  tipo: TipoCarta;
  contenido: ContenidoCarta;
  guardianes: string[]; // IDs de guardianes asignados
  estado: EstadoCarta;
  createdAt: Date;
  updatedAt: Date;
  scheduledDate?: Date; // Fecha programada de entrega (opcional)
  tags?: string[];
}

// Para Firestore (serializado)
export interface CartaDocument {
  id: string;
  userId: string;
  titulo: string;
  tipo: TipoCarta;
  contenido: ContenidoCarta;
  guardianes: string[];
  estado: EstadoCarta;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  scheduledDate?: string;
  tags?: string[];
}

// Datos para crear carta
export interface CreateCartaData {
  titulo: string;
  tipo: TipoCarta;
  contenido: ContenidoCarta;
  guardianes?: string[];
  tags?: string[];
}

// Datos para actualizar carta
export interface UpdateCartaData {
  titulo?: string;
  contenido?: Partial<ContenidoCarta>;
  guardianes?: string[];
  estado?: EstadoCarta;
  tags?: string[];
}

// Borrador local (AsyncStorage)
export interface CartaDraft {
  id: string; // ID temporal local
  titulo: string;
  tipo: TipoCarta;
  contenido: ContenidoCarta;
  guardianes: string[];
  lastModified: string; // ISO date string
}

// Filtros para listar cartas
export interface CartaFilters {
  tipo?: TipoCarta;
  estado?: EstadoCarta;
  guardianId?: string;
  searchQuery?: string;
}

// Estadísticas de cartas
export interface CartaStats {
  total: number;
  borradores: number;
  activas: number;
  entregadas: number;
  porTipo: Record<TipoCarta, number>;
}

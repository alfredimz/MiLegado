# Módulo: Cartas (Mi Legado)

## Resumen

Módulo principal para gestionar las cartas de legado. Permite ver, crear, editar y eliminar cartas con contenido de texto, audio, video o mixto.

---

## Pantallas

| Pantalla | Ruta | Descripción |
|----------|------|-------------|
| Lista de Cartas | `(tabs)/cartas/index` | Grid/lista de todas las cartas del usuario |
| Detalle Carta | `(tabs)/cartas/[id]` | Vista completa de una carta específica |

---

## Estructura de Archivos

```
app/(tabs)/cartas/
├── _layout.tsx    # Stack Navigator
├── index.tsx      # Lista de cartas
└── [id].tsx       # Detalle de carta
```

---

## Pantalla: Lista de Cartas

### Descripción
Muestra todas las cartas del usuario en formato grid o lista, con opciones de filtrado y búsqueda.

### UI

```
┌─────────────────────────────────┐
│  Mi Legado              🔍 ⋮   │
├─────────────────────────────────┤
│                                 │
│  [Todas] [Texto] [Video] [Audio]│
│                                 │
│  ┌─────────┐  ┌─────────┐      │
│  │ 📝      │  │ 🎬      │      │
│  │         │  │         │      │
│  │ Para mi │  │ Video   │      │
│  │ hijo    │  │ cumple  │      │
│  │         │  │ 15 años │      │
│  │ Activa  │  │ Borrador│      │
│  └─────────┘  └─────────┘      │
│                                 │
│  ┌─────────┐  ┌─────────┐      │
│  │ 🎤      │  │ 📝      │      │
│  │         │  │         │      │
│  │ Mensaje │  │ Carta   │      │
│  │ de voz  │  │ mamá    │      │
│  │         │  │         │      │
│  │ Activa  │  │ Activa  │      │
│  └─────────┘  └─────────┘      │
│                                 │
│                          [+]   │
└─────────────────────────────────┘
```

### Estados

| Estado | UI |
|--------|-----|
| `loading` | Skeleton cards |
| `empty` | EmptyState con CTA "Crear primera carta" |
| `error` | Error banner con retry |
| `success` | Grid de cartas |

### Empty State

```
┌─────────────────────────────────┐
│                                 │
│         [Ilustración]           │
│                                 │
│    Aquí vivirán tus recuerdos   │
│                                 │
│   Empieza con una foto, una     │
│      carta, o un video.         │
│                                 │
│    [ Crear mi primera carta ]   │
│                                 │
└─────────────────────────────────┘
```

### Filtros

| Filtro | Query |
|--------|-------|
| Todas | Sin filtro |
| Texto | `tipo == 'texto'` |
| Video | `tipo == 'video'` |
| Audio | `tipo == 'audio'` |

### Acciones
- **Tap carta:** Navega a `cartas/[id]`
- **FAB (+):** Navega a `crear/`
- **Búsqueda:** Filtra por título
- **Menú (⋮):** Opciones de ordenamiento

---

## Pantalla: Detalle Carta

### Descripción
Vista completa de una carta con su contenido, guardián asignado y opciones de edición.

### UI - Carta de Texto

```
┌─────────────────────────────────┐
│  ←  Para mi hijo        ✏️ ⋮   │
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │   Querido hijo,           │  │
│  │                           │  │
│  │   Escribo estas palabras  │  │
│  │   para que sepas cuánto   │  │
│  │   te amo y lo orgulloso   │  │
│  │   que estoy de ti...      │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  👤 Guardián: María López       │
│     (Esposa)                    │
│                                 │
│  📅 Creada: 15 ene 2025         │
│  🔄 Modificada: 20 ene 2025     │
│                                 │
│  Estado: ● Activa               │
│                                 │
└─────────────────────────────────┘
```

### UI - Carta de Video

```
┌─────────────────────────────────┐
│  ←  Video cumple 15      ✏️ ⋮  │
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │       [Video Player]      │  │
│  │                           │  │
│  │          ▶️               │  │
│  │                           │  │
│  │     advancement bar        │  │
│  │    00:00 / 02:35          │  │
│  └───────────────────────────┘  │
│                                 │
│  Mensaje adicional (opcional):  │
│  "Este video es para tu         │
│   quinceañera..."               │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  👤 Guardián: Sin asignar       │
│     [ Asignar guardián ]        │
│                                 │
└─────────────────────────────────┘
```

### Acciones
- **← (Back):** Volver a lista
- **✏️ (Edit):** Navega a modo edición
- **⋮ (Menu):** Eliminar, Compartir, Duplicar
- **Tap Guardián:** Navega a detalle guardián

### Menú de Opciones

| Opción | Acción |
|--------|--------|
| Editar | Navega a edición |
| Duplicar | Crea copia como borrador |
| Eliminar | Modal de confirmación |

### Modal Eliminar

```
┌─────────────────────────────────┐
│                                 │
│         ⚠️                      │
│                                 │
│   ¿Eliminar esta carta?         │
│                                 │
│   Esta acción no se puede       │
│   deshacer.                     │
│                                 │
│   [ Cancelar ] [ Eliminar ]     │
│                                 │
└─────────────────────────────────┘
```

---

## Tipos

### Carta

```typescript
interface Carta {
  id: string;
  userId: string;
  titulo: string;
  tipo: 'texto' | 'audio' | 'video' | 'mixta';
  contenido: CartaContenido;
  guardianId?: string;
  estado: 'borrador' | 'activa' | 'entregada';
  tags?: string[];
  fechaEntrega?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface CartaContenido {
  texto?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  thumbnailUrl?: string;
  duracion?: number; // segundos para audio/video
}
```

### Estados de Carta

| Estado | Descripción | Badge Color |
|--------|-------------|-------------|
| `borrador` | No publicada, editable | `neutral.500` |
| `activa` | Lista para entrega | `success.500` |
| `entregada` | Ya fue entregada al guardián | `primary.500` |

---

## Servicios

### firestore.ts - Cartas

```typescript
// Obtener cartas del usuario
export const getCartas = async (userId: string): Promise<Carta[]> => {
  const q = query(
    collection(db, 'cartas'),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Obtener carta por ID
export const getCarta = async (cartaId: string): Promise<Carta | null> => {
  const docRef = doc(db, 'cartas', cartaId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// Crear carta
export const createCarta = async (carta: Omit<Carta, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'cartas'), {
    ...carta,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

// Actualizar carta
export const updateCarta = async (cartaId: string, data: Partial<Carta>): Promise<void> => {
  const docRef = doc(db, 'cartas', cartaId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// Eliminar carta
export const deleteCarta = async (cartaId: string): Promise<void> => {
  await deleteDoc(doc(db, 'cartas', cartaId));
};
```

---

## Componentes

### CartaCard

```typescript
interface CartaCardProps {
  carta: Carta;
  onPress: () => void;
}
```

**Visualización:**
- Thumbnail o icono según tipo
- Título truncado (max 2 líneas)
- Badge de estado
- Indicador de guardián asignado

### VideoPlayer

```typescript
interface VideoPlayerProps {
  uri: string;
  poster?: string;
  autoPlay?: boolean;
  onEnd?: () => void;
}
```

---

## Flujo de Datos

```
[Lista Cartas]
     │
     │ useEffect(() => getCartas(userId))
     ▼
[Firestore Query]
     │
     │ snapshot.docs.map(...)
     ▼
[State: cartas[]]
     │
     │ cartas.map(carta => <CartaCard />)
     ▼
[Render Grid]
```

---

## Firestore Rules

```javascript
match /cartas/{cartaId} {
  // Solo el dueño puede leer/escribir
  allow read, write: if request.auth != null
    && request.auth.uid == resource.data.userId;

  // Crear solo si el userId coincide
  allow create: if request.auth != null
    && request.auth.uid == request.resource.data.userId;
}
```

---

## Testing Checklist

- [ ] Cargar lista de cartas
- [ ] Mostrar empty state cuando no hay cartas
- [ ] Filtrar por tipo
- [ ] Navegar a detalle de carta
- [ ] Reproducir video en detalle
- [ ] Reproducir audio en detalle
- [ ] Eliminar carta con confirmación
- [ ] Mostrar badge de estado correcto
- [ ] Mostrar guardián asignado

---

*Cartas Module Spec v1.0 - MiLegado*

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
Muestra todas las cartas del usuario en formato grid, con opciones de filtrado.

### UI

```
┌─────────────────────────────────────┐
│  📚  Mi Legado                   ⚙️ │  Header 56px, border-bottom 1px #E5E5E5
├─────────────────────────────────────┤  Título: Cormorant 20px #3D3D3D
│                                     │  BG: #FAFBF9
│  ━━━━━━━━  ━━━━━━  ━━━━━━  ━━━━━━  │  Tabs: border-bottom 2px
│   Todas    Texto   Video   Audio   │  Activo: #5BA4A4
│                                     │  Inactivo: #9A9A9A
│  ┌───────────────┐ ┌───────────────┐│
│  │ 📝            │ │ 🎬            ││  Cards: border 1px #E5E5E5
│  │               │ │               ││  Hover: border #5BA4A4
│  │ Para mi hijo  │ │ Video         ││  Padding: 16px
│  │               │ │ cumple 15     ││  Radius: 0px
│  │ ┌───────────┐ │ │               ││
│  │ │ ✨ Activa │ │ │ ┌───────────┐││  Badge: border 1px
│  │ └───────────┘ │ │ │  Borrador │││  Activa: #5BA4A4
│  └───────────────┘ └─└───────────┘┘│  Borrador: #9A9A9A
│                                     │
│  ┌───────────────┐ ┌───────────────┐│
│  │ 🎤            │ │ 📝            ││
│  │               │ │               ││
│  │ Mensaje       │ │ Carta para    ││
│  │ de voz        │ │ mamá          ││
│  │               │ │               ││
│  │ ┌───────────┐ │ │ ┌───────────┐││
│  │ │ ✨ Activa │ │ │ │ ✨ Activa │││
│  │ └───────────┘ │ │ └───────────┘││
│  └───────────────┘ └───────────────┘│
│                                     │
│                              ┌────┐ │
│                              │ ➕ │ │  FAB: border 1px #5BA4A4
│                              └────┘ │  44×44px
├─────────────────────────────────────┤
│  🏠      📚      👥      👤        │  Tab Bar 64px + safe
│ Inicio  Legado  Guard.  Perfil     │  Active: #5BA4A4
└─────────────────────────────────────┘
```

### Estados

| Estado | UI |
|--------|-----|
| `loading` | 💓 pulse centrado |
| `empty` | Empty state con emoji |
| `error` | Toast ⚠️ con retry |
| `success` | Grid de cartas |

### Empty State

```
┌─────────────────────────────────────┐
│                                     │
│              📚                     │  Emoji 4rem
│                                     │
│     Aquí vivirán tus recuerdos      │  Cormorant 24px #3D3D3D
│                                     │
│     Empieza con una foto, una       │  Nunito 16px #6A6A6A
│     carta, o un video.              │
│                                     │
│  ┌───────────────────────────────┐  │
│  │   Crear mi primera carta      │  │  Primary button outline
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
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
- **FAB (➕):** Navega a `crear/`
- **Tab activo:** Filtra por tipo

---

## Pantalla: Detalle Carta

### Descripción
Vista completa de una carta con su contenido, guardián asignado y opciones de edición.

### UI - Carta de Texto

```
┌─────────────────────────────────────┐
│  ←    Para mi hijo           ⚙️    │  Header, Cormorant 20px
├─────────────────────────────────────┤
│                                     │  BG: #FAFBF9
│  ┌───────────────────────────────┐  │
│  │                               │  │  Card: border 1px #E5E5E5
│  │   Querido hijo,               │  │  Padding: 20px
│  │                               │  │  Nunito 16px #3D3D3D
│  │   Escribo estas palabras      │  │
│  │   para que sepas cuánto       │  │
│  │   te amo y lo orgulloso       │  │
│  │   que estoy de ti...          │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│  ─────────────────────────────────  │  Separator 1px #E5E5E5
│                                     │
│  👥 Guardián                        │  Section title Nunito 14px #6A6A6A
│  ┌───────────────────────────────┐  │
│  │  (○)  María López             │  │  Avatar circle, Nunito 16px
│  │       Esposa                  │  │  Nunito 14px #6A6A6A
│  └───────────────────────────────┘  │
│                                     │
│  📅 Creada: 15 ene 2025             │  Nunito 14px #9A9A9A
│  🔄 Modificada: 20 ene 2025         │
│                                     │
│  ┌───────────┐                      │
│  │ ✨ Activa │                      │  Badge: border 1px #5BA4A4
│  └───────────┘                      │
│                                     │
└─────────────────────────────────────┘
```

### UI - Carta de Video

```
┌─────────────────────────────────────┐
│  ←    Video cumple 15        ⚙️    │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │  Video container
│  │                               │  │  Border: 1px #E5E5E5
│  │           ▶️                  │  │  Play button centered
│  │                               │  │
│  │   ━━━━━━━━━━━━━━━━━━━━━━━━   │  │  Progress: 2px #5BA4A4
│  │   00:00 / 02:35               │  │  Nunito 12px #9A9A9A
│  └───────────────────────────────┘  │
│                                     │
│  Mensaje:                           │  Label Nunito 14px #6A6A6A
│  "Este video es para tu             │  Nunito 16px #3D3D3D
│   quinceañera..."                   │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  👥 Guardián                        │
│  ┌───────────────────────────────┐  │
│  │  Sin asignar                  │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │    Asignar guardián     │  │  │  Ghost button
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### Acciones
- **← (Back):** Volver a lista
- **⚙️ (Menu):** Editar, Duplicar, Eliminar
- **Tap Guardián:** Navega a detalle guardián

### Menú de Opciones (Bottom Sheet)

```
┌─────────────────────────────────────┐
│                                     │
│  ┌───────────────────────────────┐  │
│  │  ✏️  Editar                   │  │  Nunito 16px #3D3D3D
│  └───────────────────────────────┘  │  Border-bottom: 1px #E5E5E5
│  ┌───────────────────────────────┐  │
│  │  📋  Duplicar                 │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  🗑️  Eliminar                 │  │  Color: #C47070
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### Modal Eliminar

```
┌─────────────────────────────────────┐
│                                     │
│              ⚠️                     │  Emoji 3rem
│                                     │
│      ¿Eliminar esta carta?          │  Cormorant 24px #3D3D3D
│                                     │
│      Esta acción no se puede        │  Nunito 16px #6A6A6A
│      deshacer.                      │
│                                     │
│  ┌─────────────┐ ┌─────────────┐   │
│  │  Cancelar   │ │  Eliminar   │   │  Ghost / Danger buttons
│  └─────────────┘ └─────────────┘   │  Danger: border #C47070
│                                     │
└─────────────────────────────────────┘
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
  duracion?: number;
}
```

### Estados de Carta

| Estado | Descripción | Badge |
|--------|-------------|-------|
| `borrador` | No publicada | Border #9A9A9A |
| `activa` | Lista para entrega | Border #5BA4A4, emoji ✨ |
| `entregada` | Ya fue entregada | Border #7BAA9E |

---

## Servicios

### firestore.ts - Cartas

```typescript
export const getCartas = async (userId: string): Promise<Carta[]> => {
  const q = query(
    collection(db, 'cartas'),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getCarta = async (cartaId: string): Promise<Carta | null> => {
  const docRef = doc(db, 'cartas', cartaId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const createCarta = async (carta: Omit<Carta, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'cartas'), {
    ...carta,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateCarta = async (cartaId: string, data: Partial<Carta>): Promise<void> => {
  const docRef = doc(db, 'cartas', cartaId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteCarta = async (cartaId: string): Promise<void> => {
  await deleteDoc(doc(db, 'cartas', cartaId));
};
```

---

## Componentes UI (Paradise Garden v3.0)

### CartaCard

```typescript
interface CartaCardProps {
  carta: Carta;
  onPress: () => void;
}
```

**Visualización:**
- Border: 1px #E5E5E5, hover #5BA4A4
- Radius: 0px
- Emoji según tipo (📝, 🎬, 🎤)
- Badge de estado con border 1px

### VideoPlayer

```typescript
interface VideoPlayerProps {
  uri: string;
  poster?: string;
}
```

**Controles:**
- Play/Pause: ▶️ / ⏸️
- Progress bar: 2px height, #5BA4A4
- Timestamp: Nunito 12px #9A9A9A

---

## Testing Checklist

- [ ] Cargar lista de cartas
- [ ] Mostrar empty state con emoji 📚
- [ ] Filtrar por tipo
- [ ] Navegar a detalle de carta
- [ ] Reproducir video con controles emoji
- [ ] Reproducir audio con waveform
- [ ] Eliminar carta con modal de confirmación
- [ ] Mostrar badge de estado correcto
- [ ] Mostrar guardián asignado

---

*Cartas Module Spec v3.0 - MiLegado Paradise Garden*
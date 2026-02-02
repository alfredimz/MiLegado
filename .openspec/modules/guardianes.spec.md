# Módulo: Guardianes

## Resumen

Módulo para gestionar los guardianes de confianza. Los guardianes son las personas designadas para recibir las cartas de legado cuando se active el protocolo de entrega.

---

## Pantallas

| Pantalla | Ruta | Descripción |
|----------|------|-------------|
| Lista Guardianes | `(tabs)/guardianes/index` | Lista de todos los guardianes |
| Detalle Guardián | `(tabs)/guardianes/[id]` | Información completa del guardián |

---

## Estructura de Archivos

```
app/(tabs)/guardianes/
├── _layout.tsx    # Stack Navigator
├── index.tsx      # Lista de guardianes
└── [id].tsx       # Detalle de guardián
```

---

## Pantalla: Lista Guardianes

### Descripción
Lista de todos los guardianes del usuario con su estado de verificación y cartas asignadas.

### UI

```
┌─────────────────────────────────────┐
│  👥  Guardianes                  ➕ │  Header 56px
├─────────────────────────────────────┤  Cormorant 20px #3D3D3D
│                                     │  BG: #FAFBF9
│  ┌───────────────────────────────┐  │
│  │  (○)  María López             │  │  Avatar circle 44px
│  │       Esposa                  │  │  Nunito 16px #3D3D3D
│  │       ✓ Verificada            │  │  Check #7BAA9E
│  │       3 cartas asignadas      │  │  Nunito 14px #9A9A9A
│  │                            >  │  │  Border: 1px #E5E5E5
│  └───────────────────────────────┘  │  Hover: border #5BA4A4
│                                     │
│  ┌───────────────────────────────┐  │
│  │  (○)  Carlos Rodríguez        │  │
│  │       Hijo                    │  │
│  │       ○ Pendiente             │  │  Pendiente: #C4A484
│  │       1 carta asignada        │  │
│  │                            >  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  (○)  Ana García              │  │
│  │       Amiga                   │  │
│  │       ✓ Verificada            │  │
│  │       0 cartas asignadas      │  │
│  │                            >  │  │
│  └───────────────────────────────┘  │
│                                     │
├─────────────────────────────────────┤
│  🏠      📚      👥      👤        │  Tab Bar
│ Inicio  Legado  Guard.  Perfil     │  Active: #5BA4A4
└─────────────────────────────────────┘
```

### Estados

| Estado | UI |
|--------|-----|
| `loading` | 💓 pulse centrado |
| `empty` | Empty state con emoji |
| `error` | Toast ⚠️ |
| `success` | Lista de guardianes |

### Empty State

```
┌─────────────────────────────────────┐
│                                     │
│              👥                     │  Emoji 4rem
│                                     │
│    ¿Quién recibirá tu legado?       │  Cormorant 24px #3D3D3D
│                                     │
│    Agrega personas de confianza     │  Nunito 16px #6A6A6A
│    que recibirán tus cartas.        │
│                                     │
│  ┌───────────────────────────────┐  │
│  │      Agregar guardián         │  │  Primary button outline
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### Acciones
- **Tap guardián:** Navega a `guardianes/[id]`
- **➕ (Header):** Modal para agregar guardián
- **Swipe left:** Revelar opción eliminar

---

## Pantalla: Detalle Guardián

### Descripción
Información completa del guardián con las cartas que tiene asignadas.

### UI

```
┌─────────────────────────────────────┐
│  ←    María López            ⚙️    │  Header Cormorant 20px
├─────────────────────────────────────┤
│                                     │  BG: #FAFBF9
│            (○)                      │  Avatar circle 80px
│                                     │  Border: 1px #E5E5E5
│                                     │
│         María López                 │  Cormorant 24px #3D3D3D
│      maria@email.com                │  Nunito 14px #6A6A6A
│      +52 55 1234 5678               │
│                                     │
│  ─────────────────────────────────  │  Separator 1px #E5E5E5
│                                     │
│  Relación                           │  Label Nunito 14px #6A6A6A
│  ┌───────────────────────────────┐  │
│  │  💍  Esposa                   │  │  Card border 1px #E5E5E5
│  └───────────────────────────────┘  │
│                                     │
│  Estado                             │
│  ┌───────────────────────────────┐  │
│  │  ✓  Verificada                │  │  Check: #7BAA9E
│  └───────────────────────────────┘  │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  📚 Cartas asignadas (3)            │  Nunito 16px #3D3D3D
│                                     │
│  ┌───────────────────────────────┐  │
│  │  📝  Para mi amor             │  │  Card list
│  └───────────────────────────────┘  │  Border: 1px #E5E5E5
│  ┌───────────────────────────────┐  │
│  │  🎬  Nuestro aniversario      │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  📝  Carta de despedida       │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  ➕  Asignar carta            │  │  Ghost button
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### Acciones
- **← (Back):** Volver a lista
- **⚙️ (Menu):** Editar, Reenviar invitación, Eliminar
- **Tap carta:** Navega a detalle de carta
- **"➕ Asignar carta":** Modal selector de cartas

### Modal Asignar Carta

```
┌─────────────────────────────────────┐
│  Asignar carta a María          ✕  │  Cormorant 20px
├─────────────────────────────────────┤
│                                     │
│  Selecciona las cartas:             │  Nunito 14px #6A6A6A
│                                     │
│  ┌─┐  Para mi amor                  │  Checkbox square
│  └─┘                                │  Selected: fill #5BA4A4
│  ┌─┐  Nuestro aniversario           │
│  └─┘                                │
│  ┌ ┐  Video para los niños          │  Unselected: border #E5E5E5
│  └ ┘                                │
│  ┌ ┐  Instrucciones bancarias       │
│  └ ┘                                │
│                                     │
│  ┌───────────────────────────────┐  │
│  │          Guardar              │  │  Primary button
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

## Modal: Agregar Guardián

### UI

```
┌─────────────────────────────────────┐
│  Agregar Guardián               ✕  │  Cormorant 20px
├─────────────────────────────────────┤
│                                     │  BG: #FFFFFF
│  Nombre completo                    │  Label Nunito 14px #6A6A6A
│  ┌───────────────────────────────┐  │
│  │                               │  │  Input 44px
│  └───────────────────────────────┘  │  Border: 1px #E5E5E5
│                                     │
│  Email                              │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│  Teléfono (opcional)                │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│  Relación                           │
│  ┌───────────────────────────────┐  │
│  │  Seleccionar...            ▼  │  │  Dropdown
│  └───────────────────────────────┘  │
│                                     │
│  Opciones:                          │
│  • 💍 Esposo/a                      │
│  • 👶 Hijo/a                        │
│  • 👨‍👩‍👧 Padre/Madre                   │
│  • 👫 Hermano/a                     │
│  • 🤝 Amigo/a                       │
│  • 👤 Otro                          │
│                                     │
│  ┌───────────────────────────────┐  │
│  │      Enviar invitación        │  │  Primary button
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### Campos

| Campo | Tipo | Validación |
|-------|------|------------|
| Nombre | `text` | Required, min 2 chars |
| Email | `email` | Required, email format |
| Teléfono | `tel` | Optional |
| Relación | `select` | Required |

### Flujo de Invitación

1. Usuario completa formulario
2. Se crea documento en Firestore
3. Se envía email de invitación (Cloud Function)
4. Guardián recibe link para verificar
5. Estado cambia a "Verificado" cuando confirma

---

## Tipos

### Guardian

```typescript
interface Guardian {
  id: string;
  userId: string;
  nombre: string;
  email: string;
  telefono?: string;
  relacion: GuardianRelacion;
  verificado: boolean;
  fechaVerificacion?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

type GuardianRelacion =
  | 'esposo'
  | 'esposa'
  | 'hijo'
  | 'hija'
  | 'padre'
  | 'madre'
  | 'hermano'
  | 'hermana'
  | 'amigo'
  | 'amiga'
  | 'otro';

interface GuardianWithCartas extends Guardian {
  cartas: Carta[];
  cartasCount: number;
}
```

### Estados de Verificación

| Estado | Emoji | Color |
|--------|-------|-------|
| `pendiente` | ○ | #C4A484 |
| `verificado` | ✓ | #7BAA9E |
| `rechazado` | ✕ | #C47070 |

---

## Emojis de Relación

| Relación | Emoji |
|----------|-------|
| esposo/esposa | 💍 |
| hijo/hija | 👶 |
| padre/madre | 👨‍👩‍👧 |
| hermano/hermana | 👫 |
| amigo/amiga | 🤝 |
| otro | 👤 |

---

## Servicios

### firestore.ts - Guardianes

```typescript
export const getGuardianes = async (userId: string): Promise<Guardian[]> => {
  const q = query(
    collection(db, 'guardianes'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getGuardianWithCartas = async (guardianId: string): Promise<GuardianWithCartas | null> => {
  const guardian = await getGuardian(guardianId);
  if (!guardian) return null;

  const cartasQuery = query(
    collection(db, 'cartas'),
    where('guardianId', '==', guardianId)
  );
  const cartasSnapshot = await getDocs(cartasQuery);
  const cartas = cartasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return {
    ...guardian,
    cartas,
    cartasCount: cartas.length,
  };
};

export const createGuardian = async (guardian: Omit<Guardian, 'id' | 'createdAt' | 'updatedAt' | 'verificado'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'guardianes'), {
    ...guardian,
    verificado: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const assignCartaToGuardian = async (cartaId: string, guardianId: string): Promise<void> => {
  await updateDoc(doc(db, 'cartas', cartaId), {
    guardianId,
    updatedAt: serverTimestamp(),
  });
};

export const deleteGuardian = async (guardianId: string): Promise<void> => {
  const cartasQuery = query(
    collection(db, 'cartas'),
    where('guardianId', '==', guardianId)
  );
  const cartasSnapshot = await getDocs(cartasQuery);

  const batch = writeBatch(db);
  cartasSnapshot.docs.forEach(doc => {
    batch.update(doc.ref, { guardianId: null });
  });
  batch.delete(doc(db, 'guardianes', guardianId));

  await batch.commit();
};
```

---

## Componentes UI (Paradise Garden v3.0)

### GuardianCard

- Border: 1px #E5E5E5
- Hover: border #5BA4A4
- Radius: 0px
- Avatar: circle 44px, única excepción radius
- Check/Pendiente con emoji

---

## Testing Checklist

- [ ] Cargar lista de guardianes
- [ ] Mostrar empty state con emoji 👥
- [ ] Agregar nuevo guardián
- [ ] Validación de campos requeridos
- [ ] Ver detalle de guardián
- [ ] Ver cartas asignadas a guardián
- [ ] Asignar nueva carta con checkbox
- [ ] Quitar carta de guardián
- [ ] Eliminar guardián (y desasignar cartas)
- [ ] Mostrar estado verificación con emoji

---

*Guardianes Module Spec v3.0 - MiLegado Paradise Garden*
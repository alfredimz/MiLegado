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
┌─────────────────────────────────┐
│  Guardianes                  +  │
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │ 👩 María López            │  │
│  │    Esposa                 │  │
│  │    ✓ Verificada           │  │
│  │    3 cartas asignadas     │  │
│  │                       >   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 👨 Carlos Rodríguez       │  │
│  │    Hijo                   │  │
│  │    ○ Pendiente            │  │
│  │    1 carta asignada       │  │
│  │                       >   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 👩 Ana García             │  │
│  │    Amiga                  │  │
│  │    ✓ Verificada           │  │
│  │    0 cartas asignadas     │  │
│  │                       >   │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Estados

| Estado | UI |
|--------|-----|
| `loading` | Skeleton cards |
| `empty` | EmptyState con CTA |
| `error` | Error banner |
| `success` | Lista de guardianes |

### Empty State

```
┌─────────────────────────────────┐
│                                 │
│         [Ilustración]           │
│                                 │
│   ¿Quién recibirá tu legado?    │
│                                 │
│   Agrega personas de confianza  │
│   que recibirán tus cartas.     │
│                                 │
│    [ Agregar guardián ]         │
│                                 │
└─────────────────────────────────┘
```

### Acciones
- **Tap guardián:** Navega a `guardianes/[id]`
- **+ (Header):** Modal para agregar guardián
- **Swipe left:** Revelar opción eliminar

---

## Pantalla: Detalle Guardián

### Descripción
Información completa del guardián con las cartas que tiene asignadas.

### UI

```
┌─────────────────────────────────┐
│  ←  María López          ✏️ ⋮  │
├─────────────────────────────────┤
│                                 │
│         ┌───────┐               │
│         │  👩   │               │
│         │       │               │
│         └───────┘               │
│                                 │
│      María López                │
│      maria@email.com            │
│      +52 55 1234 5678           │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Relación                       │
│  💍 Esposa                      │
│                                 │
│  Estado                         │
│  ✓ Verificada                   │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Cartas asignadas (3)           │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 📝 Para mi amor         │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ 🎬 Nuestro aniversario  │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ 📝 Carta de despedida   │    │
│  └─────────────────────────┘    │
│                                 │
│  [ + Asignar carta ]            │
│                                 │
└─────────────────────────────────┘
```

### Acciones
- **← (Back):** Volver a lista
- **✏️ (Edit):** Editar datos del guardián
- **⋮ (Menu):** Eliminar, Reenviar invitación
- **Tap carta:** Navega a detalle de carta
- **"+ Asignar carta":** Modal selector de cartas

### Modal Asignar Carta

```
┌─────────────────────────────────┐
│  Asignar carta a María      ✕  │
├─────────────────────────────────┤
│                                 │
│  Selecciona las cartas:         │
│                                 │
│  ☑ Para mi amor                 │
│  ☑ Nuestro aniversario          │
│  ☐ Video para los niños         │
│  ☐ Instrucciones bancarias      │
│                                 │
│         [ Guardar ]             │
│                                 │
└─────────────────────────────────┘
```

---

## Modal: Agregar Guardián

### UI

```
┌─────────────────────────────────┐
│  Agregar Guardián           ✕  │
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │ 👤 Nombre completo        │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 📧 Email                  │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 📱 Teléfono (opcional)    │  │
│  └───────────────────────────┘  │
│                                 │
│  Relación                       │
│  ┌─────────────────────────┐    │
│  │ Seleccionar...       ▼  │    │
│  └─────────────────────────┘    │
│                                 │
│  • Esposo/a                     │
│  • Hijo/a                       │
│  • Padre/Madre                  │
│  • Hermano/a                    │
│  • Amigo/a                      │
│  • Otro                         │
│                                 │
│      [ Enviar invitación ]      │
│                                 │
└─────────────────────────────────┘
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
  userId: string;            // Dueño del legado
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

// Guardian con cartas asignadas
interface GuardianWithCartas extends Guardian {
  cartas: Carta[];
  cartasCount: number;
}
```

### Estados de Verificación

| Estado | Descripción | Badge |
|--------|-------------|-------|
| `pendiente` | Invitación enviada, esperando confirmación | Amarillo |
| `verificado` | Guardián confirmó su identidad | Verde |
| `rechazado` | Guardián rechazó la invitación | Rojo |

---

## Servicios

### firestore.ts - Guardianes

```typescript
// Obtener guardianes del usuario
export const getGuardianes = async (userId: string): Promise<Guardian[]> => {
  const q = query(
    collection(db, 'guardianes'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Obtener guardián con sus cartas
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

// Crear guardián
export const createGuardian = async (guardian: Omit<Guardian, 'id' | 'createdAt' | 'updatedAt' | 'verificado'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'guardianes'), {
    ...guardian,
    verificado: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

// Asignar carta a guardián
export const assignCartaToGuardian = async (cartaId: string, guardianId: string): Promise<void> => {
  await updateDoc(doc(db, 'cartas', cartaId), {
    guardianId,
    updatedAt: serverTimestamp(),
  });
};

// Eliminar guardián
export const deleteGuardian = async (guardianId: string): Promise<void> => {
  // Primero quitar guardianId de las cartas asignadas
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

## Componentes

### GuardianCard

```typescript
interface GuardianCardProps {
  guardian: GuardianWithCartas;
  onPress: () => void;
}
```

**Visualización:**
- Avatar con inicial o foto
- Nombre y relación
- Badge de verificación
- Contador de cartas asignadas
- Chevron derecho

---

## Iconos de Relación

| Relación | Icono |
|----------|-------|
| esposo/esposa | 💍 |
| hijo/hija | 👶 |
| padre/madre | 👨‍👩‍👧 |
| hermano/hermana | 👫 |
| amigo/amiga | 🤝 |
| otro | 👤 |

---

## Firestore Rules

```javascript
match /guardianes/{guardianId} {
  // Solo el dueño puede leer/escribir
  allow read, write: if request.auth != null
    && request.auth.uid == resource.data.userId;

  allow create: if request.auth != null
    && request.auth.uid == request.resource.data.userId;
}
```

---

## Testing Checklist

- [ ] Cargar lista de guardianes
- [ ] Mostrar empty state sin guardianes
- [ ] Agregar nuevo guardián
- [ ] Validación de campos requeridos
- [ ] Ver detalle de guardián
- [ ] Ver cartas asignadas a guardián
- [ ] Asignar nueva carta a guardián
- [ ] Quitar carta de guardián
- [ ] Eliminar guardián (y desasignar cartas)
- [ ] Mostrar badge de verificación correcto

---

*Guardianes Module Spec v1.0 - MiLegado*

# Módulo: Perfil

## Resumen

Módulo de perfil de usuario que incluye configuración de cuenta, ajustes de "El Latido" (prueba de vida), preferencias de la app y opciones de seguridad.

---

## Pantallas

| Pantalla | Ruta | Descripción |
|----------|------|-------------|
| Perfil Principal | `(tabs)/perfil/index` | Vista principal con información y opciones |

---

## Estructura de Archivos

```
app/(tabs)/perfil/
├── _layout.tsx    # Stack Navigator
└── index.tsx      # Pantalla principal de perfil
```

---

## Pantalla: Perfil Principal

### Descripción
Vista unificada con información del usuario, estadísticas del legado, configuración del Latido y ajustes de la app.

### UI

```
┌─────────────────────────────────┐
│  Perfil                      ⚙️ │
├─────────────────────────────────┤
│                                 │
│         ┌───────┐               │
│         │  👤   │  ← Tap para   │
│         │ foto  │    cambiar    │
│         └───────┘               │
│      Juan Pérez                 │
│      juan@email.com             │
│      [ Editar perfil ]          │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  📊 Mi Legado en Números        │
│  ┌─────────┬─────────┬───────┐  │
│  │    5    │    3    │   2   │  │
│  │ Cartas  │Guardians│ Videos│  │
│  └─────────┴─────────┴───────┘  │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  💓 El Latido                   │
│  ┌───────────────────────────┐  │
│  │ Próximo check: 28 días    │  │
│  │ Intervalo: cada 30 días   │  │
│  │                    ⚙️     │  │
│  └───────────────────────────┘  │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  ⚙️ Configuración               │
│                                 │
│  🔔 Notificaciones          >   │
│  🌙 Tema                    >   │
│  🔒 Seguridad               >   │
│  ❓ Ayuda                   >   │
│  📄 Términos y privacidad   >   │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  [ Cerrar sesión ]              │
│                                 │
│  v1.0.0                         │
│                                 │
└─────────────────────────────────┘
```

### Secciones

#### 1. Header de Usuario
- Foto de perfil (tap para cambiar)
- Nombre y email
- Botón "Editar perfil"

#### 2. Estadísticas
- Total de cartas creadas
- Total de guardianes
- Total de videos/audios

#### 3. El Latido
- Estado actual del latido
- Días hasta próximo check
- Configuración de intervalo

#### 4. Configuración
- Lista de opciones con navegación

---

## Modal: Editar Perfil

### UI

```
┌─────────────────────────────────┐
│  Editar Perfil              ✕  │
├─────────────────────────────────┤
│                                 │
│         ┌───────┐               │
│         │  👤   │               │
│         │ foto  │               │
│         └───────┘               │
│      [ Cambiar foto ]           │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 👤 Nombre                 │  │
│  │    Juan Pérez             │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 📧 Email                  │  │
│  │    juan@email.com     🔒  │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 📱 Teléfono               │  │
│  │    +52 55 1234 5678       │  │
│  └───────────────────────────┘  │
│                                 │
│         [ Guardar ]             │
│                                 │
└─────────────────────────────────┘
```

---

## Modal: Configurar El Latido

### UI

```
┌─────────────────────────────────┐
│  Tu Señal de Vida           ✕  │
├─────────────────────────────────┤
│                                 │
│  💓                             │
│                                 │
│  Cada cierto tiempo te          │
│  enviaremos un saludo para      │
│  confirmar que sigues aquí.     │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Frecuencia del latido          │
│                                 │
│  ○ Cada 15 días                 │
│  ● Cada 30 días (recomendado)   │
│  ○ Cada 60 días                 │
│  ○ Cada 90 días                 │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Periodo de gracia: 7 días      │
│                                 │
│  Si no respondes en este        │
│  tiempo, enviaremos             │
│  recordatorios adicionales.     │
│                                 │
│         [ Guardar ]             │
│                                 │
└─────────────────────────────────┘
```

### Opciones de Intervalo

| Intervalo | Descripción |
|-----------|-------------|
| 15 días | Para usuarios muy activos |
| 30 días | **Recomendado** |
| 60 días | Para usuarios ocasionales |
| 90 días | Mínima frecuencia |

---

## Modal: Configurar Notificaciones

### UI

```
┌─────────────────────────────────┐
│  Notificaciones             ✕  │
├─────────────────────────────────┤
│                                 │
│  El Latido                      │
│  Recibir recordatorios    [ON]  │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Actividad                      │
│  Nuevos guardianes        [ON]  │
│  Cartas entregadas        [ON]  │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Marketing                      │
│  Tips y novedades        [OFF]  │
│                                 │
│         [ Guardar ]             │
│                                 │
└─────────────────────────────────┘
```

---

## Modal: Tema

### UI

```
┌─────────────────────────────────┐
│  Tema                       ✕  │
├─────────────────────────────────┤
│                                 │
│  ┌─────────┐  ┌─────────┐      │
│  │ ■■■■■■■ │  │ □□□□□□□ │      │
│  │ ■■■■■■■ │  │ □□□□□□□ │      │
│  │ ■■■■■■■ │  │ □□□□□□□ │      │
│  └─────────┘  └─────────┘      │
│    Oscuro       Claro          │
│      ●            ○            │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  ○ Seguir sistema               │
│                                 │
└─────────────────────────────────┘
```

---

## Tipos

### UserSettings

```typescript
interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  language: 'es' | 'en';
  notifications: NotificationSettings;
  latidoInterval: 15 | 30 | 60 | 90; // días
  latidoGracePeriod: number;         // días (default 7)
}

interface NotificationSettings {
  latido: boolean;
  newGuardian: boolean;
  cartaDelivered: boolean;
  marketing: boolean;
}
```

### UserStats

```typescript
interface UserStats {
  totalCartas: number;
  totalGuardianes: number;
  totalVideos: number;
  totalAudios: number;
  storageUsed: number; // bytes
}
```

### LatidoStatus

```typescript
interface LatidoStatus {
  lastLatido: Timestamp;
  nextLatido: Timestamp;
  daysUntilNext: number;
  status: 'activo' | 'pendiente' | 'alerta' | 'inactivo';
}
```

---

## El Latido - Lógica

### Estados

| Estado | Condición | Color | Acción |
|--------|-----------|-------|--------|
| `activo` | Confirmado recientemente | Verde | Ninguna |
| `pendiente` | Dentro del periodo normal | Amarillo | Mostrar recordatorio |
| `alerta` | En periodo de gracia | Naranja | Push + email |
| `inactivo` | Gracia expirada | Rojo | Iniciar protocolo |

### Cálculo

```typescript
const getLatidoStatus = (user: User): LatidoStatus => {
  const now = new Date();
  const lastLatido = user.lastLatido.toDate();
  const interval = user.latidoInterval || 30;
  const gracePeriod = user.latidoGracePeriod || 7;

  const nextLatido = addDays(lastLatido, interval);
  const graceEnd = addDays(nextLatido, gracePeriod);
  const daysUntilNext = differenceInDays(nextLatido, now);

  let status: LatidoStatus['status'];
  if (now < nextLatido) {
    status = daysUntilNext > 7 ? 'activo' : 'pendiente';
  } else if (now < graceEnd) {
    status = 'alerta';
  } else {
    status = 'inactivo';
  }

  return { lastLatido, nextLatido, daysUntilNext, status };
};
```

### Confirmar Latido

```typescript
const confirmLatido = async (userId: string): Promise<void> => {
  await updateDoc(doc(db, 'users', userId), {
    lastLatido: serverTimestamp(),
  });
};
```

---

## Servicios

### firestore.ts - User

```typescript
// Obtener perfil de usuario
export const getUserProfile = async (userId: string): Promise<User | null> => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// Actualizar perfil
export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<void> => {
  await updateDoc(doc(db, 'users', userId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// Actualizar settings
export const updateUserSettings = async (userId: string, settings: Partial<UserSettings>): Promise<void> => {
  await updateDoc(doc(db, 'users', userId), {
    settings,
    updatedAt: serverTimestamp(),
  });
};

// Obtener estadísticas
export const getUserStats = async (userId: string): Promise<UserStats> => {
  const [cartasSnap, guardianesSnap] = await Promise.all([
    getDocs(query(collection(db, 'cartas'), where('userId', '==', userId))),
    getDocs(query(collection(db, 'guardianes'), where('userId', '==', userId))),
  ]);

  const cartas = cartasSnap.docs.map(d => d.data());
  return {
    totalCartas: cartas.length,
    totalGuardianes: guardianesSnap.size,
    totalVideos: cartas.filter(c => c.tipo === 'video').length,
    totalAudios: cartas.filter(c => c.tipo === 'audio').length,
    storageUsed: 0, // TODO: Calculate from storage
  };
};
```

---

## Hooks

### useBattery (existente)

```typescript
const { level, isCharging, percentage } = useBattery();
```

Mostrar indicador de batería en el header cuando está bajo (< 20%).

---

## Acciones de Configuración

| Opción | Acción |
|--------|--------|
| Notificaciones | Modal de configuración |
| Tema | Modal de selección |
| Seguridad | Cambiar contraseña, biometría |
| Ayuda | FAQ y contacto |
| Términos | WebView con términos |
| Cerrar sesión | Confirmar y logout |

---

## Modal: Cerrar Sesión

```
┌─────────────────────────────────┐
│                                 │
│   ¿Cerrar sesión?               │
│                                 │
│   Tu legado seguirá protegido.  │
│                                 │
│  [ Cancelar ] [ Cerrar sesión ] │
│                                 │
└─────────────────────────────────┘
```

---

## Testing Checklist

- [ ] Mostrar información del usuario
- [ ] Editar nombre y foto
- [ ] Mostrar estadísticas correctas
- [ ] Mostrar estado del latido
- [ ] Configurar intervalo del latido
- [ ] Confirmar latido manualmente
- [ ] Cambiar tema (dark/light)
- [ ] Configurar notificaciones
- [ ] Cerrar sesión

---

*Perfil Module Spec v1.0 - MiLegado*

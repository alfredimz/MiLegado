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
┌─────────────────────────────────────┐
│  👤  Perfil                      ⚙️ │  Header 56px
├─────────────────────────────────────┤  Cormorant 20px #3D3D3D
│                                     │  BG: #FAFBF9
│            (○)                      │  Avatar circle 80px
│                                     │  Border: 1px #E5E5E5
│         Juan Pérez                  │  Cormorant 24px #3D3D3D
│       juan@email.com                │  Nunito 14px #6A6A6A
│                                     │
│  ┌───────────────────────────────┐  │
│  │        Editar perfil          │  │  Ghost button
│  └───────────────────────────────┘  │  Border: 1px #E5E5E5
│                                     │
│  ─────────────────────────────────  │  Separator 1px #E5E5E5
│                                     │
│  📊 Mi Legado en Números            │  Nunito 16px #3D3D3D
│  ┌─────────┬─────────┬─────────┐   │
│  │    5    │    3    │    2    │   │  Stats card
│  │ Cartas  │ Guard.  │ Videos  │   │  Border: 1px #E5E5E5
│  └─────────┴─────────┴─────────┘   │  Numbers: Cormorant 32px
│                                     │  Labels: Nunito 12px #9A9A9A
│  ─────────────────────────────────  │
│                                     │
│  💓 El Latido                       │  Nunito 16px #3D3D3D
│  ┌───────────────────────────────┐  │
│  │  Próximo check: 28 días       │  │  Card border 1px #E5E5E5
│  │  Intervalo: cada 30 días      │  │  Days: Cormorant 24px #5BA4A4
│  │                            ⚙️ │  │  Config icon
│  └───────────────────────────────┘  │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  ⚙️ Configuración                   │  Section title
│                                     │
│  ┌───────────────────────────────┐  │
│  │  🔔  Notificaciones        >  │  │  List items
│  ├───────────────────────────────┤  │  Border: 1px #E5E5E5
│  │  🔒  Seguridad             >  │  │  Nunito 16px #3D3D3D
│  ├───────────────────────────────┤  │
│  │  ❓  Ayuda                 >  │  │
│  ├───────────────────────────────┤  │
│  │  📄  Términos              >  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │        Cerrar sesión          │  │  Danger outline button
│  └───────────────────────────────┘  │  Border: 1px #C47070
│                                     │
│  v1.0.0                             │  Nunito 12px #9A9A9A center
│                                     │
├─────────────────────────────────────┤
│  🏠      📚      👥      👤        │  Tab Bar
└─────────────────────────────────────┘
```

### Secciones

#### 1. Header de Usuario
- Avatar circle 80px (única excepción border-radius)
- Nombre en Cormorant 24px
- Email en Nunito 14px
- Botón "Editar perfil" ghost

#### 2. Estadísticas
- Card con 3 columnas
- Números grandes en Cormorant
- Labels en Nunito caption

#### 3. El Latido
- Card con días restantes
- Config button ⚙️

#### 4. Configuración
- Lista de opciones con emojis
- Chevron > para navegación

---

## Modal: Editar Perfil

### UI

```
┌─────────────────────────────────────┐
│  Editar Perfil                  ✕  │  Cormorant 20px
├─────────────────────────────────────┤
│                                     │
│            (○)                      │  Avatar 80px
│      [ Cambiar foto ]               │  Text link #5BA4A4
│                                     │
│  Nombre                             │  Label Nunito 14px
│  ┌───────────────────────────────┐  │
│  │  Juan Pérez                   │  │  Input 44px
│  └───────────────────────────────┘  │  Border: 1px #E5E5E5
│                                     │
│  Email                              │
│  ┌───────────────────────────────┐  │
│  │  juan@email.com           🔒  │  │  Disabled, icon lock
│  └───────────────────────────────┘  │  BG: #F5F6F4
│                                     │
│  Teléfono                           │
│  ┌───────────────────────────────┐  │
│  │  +52 55 1234 5678             │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │          Guardar              │  │  Primary button
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

## Modal: Configurar El Latido

### UI

```
┌─────────────────────────────────────┐
│  💓 Tu Señal de Vida            ✕  │  Cormorant 20px
├─────────────────────────────────────┤
│                                     │
│              💓                     │  Emoji 3rem
│                                     │
│     Cada cierto tiempo te           │  Nunito 16px #6A6A6A
│     enviaremos un saludo para       │  center
│     confirmar que sigues aquí.      │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Frecuencia del latido              │  Nunito 14px #6A6A6A
│                                     │
│  ┌───────────────────────────────┐  │
│  │  ○  Cada 15 días              │  │  Radio: circle
│  ├───────────────────────────────┤  │  Border: 1px #E5E5E5
│  │  ●  Cada 30 días (recomendado)│  │  Selected: fill #5BA4A4
│  ├───────────────────────────────┤  │
│  │  ○  Cada 60 días              │  │
│  ├───────────────────────────────┤  │
│  │  ○  Cada 90 días              │  │
│  └───────────────────────────────┘  │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Periodo de gracia: 7 días          │  Nunito 14px #3D3D3D
│                                     │
│  Si no respondes en este tiempo,    │  Nunito 14px #6A6A6A
│  enviaremos recordatorios.          │
│                                     │
│  ┌───────────────────────────────┐  │
│  │          Guardar              │  │  Primary button
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
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
┌─────────────────────────────────────┐
│  🔔 Notificaciones              ✕  │
├─────────────────────────────────────┤
│                                     │
│  El Latido                          │  Section Nunito 14px #6A6A6A
│  ┌───────────────────────────────┐  │
│  │  Recordatorios          [━●] │  │  Toggle: track 48×28px
│  └───────────────────────────────┘  │  Active: #5BA4A4
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Actividad                          │
│  ┌───────────────────────────────┐  │
│  │  Nuevos guardianes      [━●] │  │
│  ├───────────────────────────────┤  │
│  │  Cartas entregadas      [━●] │  │
│  └───────────────────────────────┘  │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Marketing                          │
│  ┌───────────────────────────────┐  │
│  │  Tips y novedades       [●━] │  │  Inactive: #E5E5E5
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │          Guardar              │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

## Tipos

### UserSettings

```typescript
interface UserSettings {
  language: 'es' | 'en';
  notifications: NotificationSettings;
  latidoInterval: 15 | 30 | 60 | 90;
  latidoGracePeriod: number;
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
  storageUsed: number;
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

| Estado | Condición | Color | Emoji |
|--------|-----------|-------|-------|
| `activo` | Confirmado recientemente | #7BAA9E | 💓 |
| `pendiente` | Dentro del periodo normal | #C4A484 | 💓 |
| `alerta` | En periodo de gracia | #C47070 | ⚠️ |
| `inactivo` | Gracia expirada | #C47070 | 🚨 |

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

## Modal: Cerrar Sesión

```
┌─────────────────────────────────────┐
│                                     │
│              🚪                     │  Emoji 3rem
│                                     │
│        ¿Cerrar sesión?              │  Cormorant 24px #3D3D3D
│                                     │
│   Tu legado seguirá protegido.      │  Nunito 16px #6A6A6A
│                                     │
│  ┌─────────────┐ ┌─────────────┐   │
│  │  Cancelar   │ │   Salir     │   │  Ghost / Danger
│  └─────────────┘ └─────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## Acciones de Configuración

| Opción | Emoji | Acción |
|--------|-------|--------|
| Notificaciones | 🔔 | Modal configuración |
| Seguridad | 🔒 | Cambiar contraseña |
| Ayuda | ❓ | FAQ y contacto |
| Términos | 📄 | WebView |

---

## Testing Checklist

- [ ] Mostrar información del usuario
- [ ] Avatar circular (única excepción radius)
- [ ] Editar nombre y foto
- [ ] Mostrar estadísticas en card
- [ ] Mostrar estado del latido con emoji
- [ ] Configurar intervalo del latido
- [ ] Confirmar latido con 💓 pulse
- [ ] Configurar notificaciones con toggles
- [ ] Cerrar sesión con confirmación

---

*Perfil Module Spec v3.0 - MiLegado Paradise Garden*
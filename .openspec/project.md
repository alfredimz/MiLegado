# MiLegado - Especificación del Proyecto

## Resumen Ejecutivo

**MiLegado** es una aplicación móvil de legado digital para el mercado mexicano. Permite a los usuarios crear cartas, videos y mensajes que serán entregados a sus seres queridos ("guardianes") en el momento adecuado.

### Datos Clave

| Aspecto | Valor |
|---------|-------|
| **Nombre** | MiLegado |
| **Plataformas** | iOS, Android, Web |
| **Stack** | React Native + Expo + Firebase |
| **Mercado** | México (95% sin testamento = océano azul) |
| **Diferenciador** | Enfoque cultural mexicano (Día de Muertos) |

---

## Propuesta de Valor

> **"Tu voz. Tus historias. Para siempre."**

La app NO es un testamento digital legal. Es un repositorio emocional que permite:
- Grabar videos/audios de despedida
- Escribir cartas para momentos específicos
- Organizar contraseñas y documentos importantes
- Designar guardianes de confianza

### Posicionamiento Cultural

```
✅ La app ES: Extensión digital de la ofrenda del Día de Muertos
❌ La app NO ES: Preparación burocrática para la muerte
```

---

## Arquitectura Técnica

### Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| **Framework** | React Native | 0.81.5 |
| **Plataforma** | Expo | 54.0.32 |
| **Navegación** | Expo Router | 6.0.22 |
| **Backend** | Firebase | 12.8.0 |
| **Autenticación** | Firebase Auth | - |
| **Base de datos** | Firestore | - |
| **Almacenamiento** | Firebase Storage | - |
| **UI Components** | React Native Paper | 5.14.5 |
| **Iconos** | Lucide React Native | 0.563.0 |
| **Validación** | Zod | 4.3.6 |
| **Animaciones** | Reanimated | 4.1.1 |

### APIs de Plataforma Utilizadas

| API | Librería | Uso |
|-----|----------|-----|
| Cámara | `expo-camera` | Captura foto/video |
| Galería | `expo-image-picker` | Selección de imágenes |
| Audio/Video | `expo-av` | Grabación y reproducción |
| Batería | `expo-battery` | Indicador en dashboard |
| Storage Local | `@react-native-async-storage` | Cache y drafts |

---

## Estructura de Navegación

### Sitemap

```
App MiLegado
│
├── (auth)                    # Stack no autenticado
│   ├── onboarding           # 3 slides introductorios
│   ├── login                # Inicio de sesión
│   └── register             # Registro de cuenta
│
├── (tabs)                    # Tab Navigator principal
│   ├── index                # Dashboard (El Latido)
│   ├── cartas/              # Stack de cartas
│   │   ├── index            # Lista de cartas
│   │   └── [id]             # Detalle carta
│   ├── guardianes/          # Stack de guardianes
│   │   ├── index            # Lista de guardianes
│   │   └── [id]             # Detalle guardián
│   └── perfil/              # Stack de perfil
│       └── index            # Configuración
│
└── crear/                    # Modal Stack
    ├── index                # Selector de tipo
    ├── texto                # Editor de texto
    ├── media                # Captura de media
    └── preview              # Vista previa
```

### Estructura de Archivos

```
app/
├── _layout.tsx              # Root Layout (Auth check)
├── index.tsx                # Redirect logic
├── (auth)/
│   ├── _layout.tsx
│   ├── onboarding.tsx
│   ├── login.tsx
│   └── register.tsx
├── (tabs)/
│   ├── _layout.tsx          # Tab Navigator
│   ├── index.tsx            # Dashboard
│   ├── cartas/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── [id].tsx
│   ├── guardianes/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── [id].tsx
│   └── perfil/
│       ├── _layout.tsx
│       └── index.tsx
└── crear/
    ├── _layout.tsx
    ├── index.tsx
    ├── texto.tsx
    ├── media.tsx
    └── preview.tsx
```

---

## Modelo de Datos

### Colecciones Firestore

```
firestore/
├── users/                   # Usuarios
│   └── {userId}/
│       ├── profile          # Datos del perfil
│       └── settings         # Configuración
├── cartas/                  # Cartas de legado
│   └── {cartaId}/
│       ├── contenido        # Texto, media URLs
│       ├── guardianId       # Guardián asignado
│       └── estado           # borrador | activa | entregada
└── guardianes/              # Guardianes
    └── {guardianId}/
        ├── datos            # Nombre, email, relación
        └── verificado       # Estado de verificación
```

### Tipos Principales

```typescript
// Usuario
interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
  lastLatido: Timestamp;      // Último check-in
  latidoInterval: number;     // Días entre check-ins (default: 30)
}

// Carta
interface Carta {
  id: string;
  userId: string;
  titulo: string;
  tipo: 'texto' | 'audio' | 'video' | 'mixta';
  contenido: {
    texto?: string;
    mediaUrl?: string;
    mediaType?: string;
  };
  guardianId?: string;
  estado: 'borrador' | 'activa' | 'entregada';
  fechaEntrega?: Timestamp;   // Programada o null
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Guardián
interface Guardian {
  id: string;
  userId: string;             // Dueño del legado
  nombre: string;
  email: string;
  telefono?: string;
  relacion: 'esposo' | 'hijo' | 'padre' | 'hermano' | 'amigo' | 'otro';
  verificado: boolean;
  createdAt: Timestamp;
}
```

---

## Funcionalidad "El Latido"

Sistema de verificación de vida del usuario.

### Flujo

1. Cada X días (configurable, default 30), se envía notificación push
2. Usuario debe confirmar que "sigue aquí"
3. Si no confirma en periodo de gracia (7 días):
   - Se envían recordatorios adicionales
   - Si no hay respuesta, se activa proceso de verificación
4. Guardianes pueden iniciar proceso de acceso con:
   - Respuestas a preguntas de seguridad
   - Subir acta de defunción

### Estados del Latido

| Estado | Descripción | Color |
|--------|-------------|-------|
| `activo` | Confirmado recientemente | Verde |
| `pendiente` | Esperando confirmación | Amarillo |
| `alerta` | Sin respuesta, en gracia | Naranja |
| `inactivo` | Proceso de verificación iniciado | Rojo |

---

## Seguridad

### Autenticación
- Firebase Auth con email/password
- Opción de biometría local (expo-local-authentication)

### Datos
- Firestore Security Rules por usuario
- Storage rules para media privada
- Encriptación en tránsito (HTTPS/TLS)

### Privacidad
- Cumplimiento LFPDPPP (México)
- Consentimiento explícito para datos sensibles
- Opción de eliminar cuenta y datos

---

## Modelo de Negocio

### Planes

| Plan | Precio | Límites |
|------|--------|---------|
| **Semilla** (Gratis) | $0 | 1 guardián, 3 cartas, 500MB |
| **Legado** (Mensual) | $59 MXN/mes | Ilimitado |
| **Legado** (Anual) | $590 MXN/año | Ilimitado + 2 meses gratis |
| **Eterno** (Lifetime) | $1,999 MXN | Todo para siempre |

---

## Referencias

- [Design System](.openspec/design-system.md)
- [Voice & Tone](.openspec/voice-tone.md)
- [Personas](.openspec/personas.md)

---

*Proyecto UNIR 2025 - Especificación v1.0*

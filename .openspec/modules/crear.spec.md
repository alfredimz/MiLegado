# Módulo: Crear Carta

## Resumen

Módulo modal para crear nuevas cartas de legado. Flujo paso a paso que permite seleccionar tipo de contenido, capturar/seleccionar media, agregar texto y previsualizar antes de guardar.

---

## Pantallas

| Pantalla | Ruta | Descripción |
|----------|------|-------------|
| Selector de Tipo | `crear/index` | Elegir tipo de carta (texto, video, audio, foto) |
| Editor de Texto | `crear/texto` | Escribir contenido de texto |
| Captura de Media | `crear/media` | Grabar video/audio o seleccionar imagen |
| Preview | `crear/preview` | Vista previa antes de guardar |

---

## Estructura de Archivos

```
app/crear/
├── _layout.tsx    # Stack Navigator (modal)
├── index.tsx      # Selector de tipo
├── texto.tsx      # Editor de texto
├── media.tsx      # Captura de media
└── preview.tsx    # Vista previa
```

---

## Flujo General

```
[FAB + en cualquier pantalla]
         │
         ▼
[Selector de Tipo]
         │
    ┌────┼────┬────┐
    ▼    ▼    ▼    ▼
  Texto Video Audio Foto
    │    │     │    │
    │    └──┬──┘    │
    │       ▼       │
    │   [Media]     │
    │       │       │
    ▼       ▼       ▼
[Texto (opcional para media)]
         │
         ▼
    [Preview]
         │
         ▼
[Guardar o Asignar Guardián]
```

---

## Pantalla: Selector de Tipo

### Descripción
Primera pantalla del flujo. El usuario elige qué tipo de carta quiere crear.

### UI

```
┌─────────────────────────────────┐
│  ✕  Nueva Carta                 │
├─────────────────────────────────┤
│                                 │
│   ¿Qué quieres compartir?       │
│                                 │
│  ┌───────────────────────────┐  │
│  │  📝                       │  │
│  │  Texto                    │  │
│  │  Escribe una carta o      │  │
│  │  mensaje                  │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  🎬                       │  │
│  │  Video                    │  │
│  │  Graba un video mensaje   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  🎤                       │  │
│  │  Audio                    │  │
│  │  Graba un mensaje de voz  │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  📷                       │  │
│  │  Foto                     │  │
│  │  Comparte una imagen      │  │
│  │  especial                 │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Opciones

| Tipo | Icono | Descripción | Siguiente Pantalla |
|------|-------|-------------|-------------------|
| Texto | 📝 | Carta escrita | `crear/texto` |
| Video | 🎬 | Grabar video | `crear/media?tipo=video` |
| Audio | 🎤 | Grabar audio | `crear/media?tipo=audio` |
| Foto | 📷 | Seleccionar foto | `crear/media?tipo=foto` |

### Acciones
- **✕ (Close):** Cierra modal, vuelve a pantalla anterior
- **Tap opción:** Navega a siguiente pantalla con parámetro `tipo`

---

## Pantalla: Editor de Texto

### Descripción
Editor de texto enriquecido para escribir el contenido de la carta.

### UI

```
┌─────────────────────────────────┐
│  ←  Escribe tu carta    Vista   │
├─────────────────────────────────┤
│                                 │
│  Título                         │
│  ┌───────────────────────────┐  │
│  │ Para mi hijo              │  │
│  └───────────────────────────┘  │
│                                 │
│  Tu mensaje                     │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │ Querido hijo,             │  │
│  │                           │  │
│  │ Escribo estas palabras    │  │
│  │ para que sepas cuánto     │  │
│  │ te amo...                 │  │
│  │                           │  │
│  │                           │  │
│  │                           │  │
│  │                           │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  📎 Agregar foto (opcional)     │
│                                 │
├─────────────────────────────────┤
│                                 │
│         [ Continuar ]           │
│                                 │
└─────────────────────────────────┘
```

### Campos

| Campo | Tipo | Validación |
|-------|------|------------|
| Título | `text` | Required, max 100 chars |
| Mensaje | `textarea` | Required, min 10 chars |
| Foto | `image` | Optional |

### Acciones
- **← (Back):** Volver a selector
- **"Vista":** Preview del texto formateado
- **"Agregar foto":** Abrir galería
- **"Continuar":** Navegar a Preview

---

## Pantalla: Captura de Media

### Descripción
Pantalla para capturar video/audio o seleccionar foto de la galería.

### UI - Modo Video

```
┌─────────────────────────────────┐
│  ←  Graba tu mensaje        🔄 │
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │                           │  │
│  │     [Camera Preview]      │  │
│  │                           │  │
│  │                           │  │
│  │                           │  │
│  │                           │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│           00:00                 │
│                                 │
│  ┌─────────────────────────┐    │
│  │         ⏺️              │    │  ← Tap para grabar
│  │                         │    │
│  └─────────────────────────┘    │
│                                 │
│   📁 Elegir de galería          │
│                                 │
└─────────────────────────────────┘
```

### UI - Grabando

```
┌─────────────────────────────────┐
│  ←  Grabando...             🔄 │
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │     [Camera Preview]      │  │
│  │                           │  │
│  │         🔴 REC            │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│          ● 00:45                │
│                                 │
│  ┌─────────────────────────┐    │
│  │         ⏹️              │    │  ← Tap para detener
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

### UI - Modo Audio

```
┌─────────────────────────────────┐
│  ←  Graba tu mensaje            │
├─────────────────────────────────┤
│                                 │
│                                 │
│                                 │
│         🎤                      │
│                                 │
│    ════════════════════         │
│    [Waveform visualization]     │
│    ════════════════════         │
│                                 │
│           00:00                 │
│                                 │
│  ┌─────────────────────────┐    │
│  │         ⏺️              │    │
│  └─────────────────────────┘    │
│                                 │
│                                 │
└─────────────────────────────────┘
```

### UI - Modo Foto

```
┌─────────────────────────────────┐
│  ←  Elige una foto          📷 │
├─────────────────────────────────┤
│                                 │
│  Recientes                      │
│                                 │
│  ┌─────┐ ┌─────┐ ┌─────┐       │
│  │     │ │     │ │     │       │
│  │ 📷  │ │ 📷  │ │ 📷  │       │
│  └─────┘ └─────┘ └─────┘       │
│                                 │
│  ┌─────┐ ┌─────┐ ┌─────┐       │
│  │     │ │     │ │     │       │
│  │ 📷  │ │ 📷  │ │ 📷  │       │
│  └─────┘ └─────┘ └─────┘       │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  📷 Tomar foto                  │
│                                 │
└─────────────────────────────────┘
```

### Permisos Requeridos

| Tipo | Permisos |
|------|----------|
| Video | Cámara + Micrófono |
| Audio | Micrófono |
| Foto | Galería (+ Cámara opcional) |

### Hooks Utilizados

```typescript
// Para video/foto
const { permission, requestPermission, type, toggleCameraType } = useCamera();

// Para audio
const { startRecording, stopRecording, recording, duration } = useAudio();

// Para galería
const { pickImage, takePhoto } = useImagePicker();
```

### Acciones
- **← (Back):** Cancelar, volver a selector
- **🔄 (Flip):** Cambiar cámara frontal/trasera
- **⏺️:** Iniciar grabación
- **⏹️:** Detener grabación
- **📁:** Seleccionar de galería
- **📷:** Tomar foto (en modo foto)

### Post-Captura

```
┌─────────────────────────────────┐
│  ←  Preview                     │
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │    [Media Preview]        │  │
│  │                           │  │
│  │         ▶️                │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  [ Volver a grabar ]            │
│                                 │
│        [ Usar este ]            │
│                                 │
└─────────────────────────────────┘
```

---

## Pantalla: Preview

### Descripción
Vista previa de la carta antes de guardar. Permite agregar título, texto adicional y asignar guardián.

### UI

```
┌─────────────────────────────────┐
│  ←  Vista previa                │
├─────────────────────────────────┤
│                                 │
│  Título                         │
│  ┌───────────────────────────┐  │
│  │ Video para mi hijo        │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │    [Media Preview]        │  │
│  │                           │  │
│  │         ▶️                │  │
│  │         02:35             │  │
│  └───────────────────────────┘  │
│                                 │
│  Mensaje (opcional)             │
│  ┌───────────────────────────┐  │
│  │ Este video es para tu     │  │
│  │ graduación...             │  │
│  └───────────────────────────┘  │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Guardián                       │
│  ┌───────────────────────────┐  │
│  │ 👤 Sin asignar        >   │  │
│  └───────────────────────────┘  │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  [ Guardar borrador ]           │
│                                 │
│       [ Activar carta ]         │
│                                 │
└─────────────────────────────────┘
```

### Campos

| Campo | Tipo | Validación |
|-------|------|------------|
| Título | `text` | Required, max 100 chars |
| Mensaje | `textarea` | Optional |
| Guardián | `select` | Optional |

### Selector de Guardián

```
┌─────────────────────────────────┐
│  Asignar Guardián           ✕  │
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │ ○ Sin asignar             │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ ● María López (Esposa)    │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ ○ Carlos (Hijo)           │  │
│  └───────────────────────────┘  │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  + Agregar nuevo guardián       │
│                                 │
└─────────────────────────────────┘
```

### Acciones
- **← (Back):** Volver a pantalla anterior
- **"Guardar borrador":** Guarda con estado `borrador`
- **"Activar carta":** Guarda con estado `activa`

---

## Flujo de Guardado

```typescript
const saveCarta = async (data: CartaDraft, estado: 'borrador' | 'activa') => {
  // 1. Si hay media, subir a Firebase Storage
  let mediaUrl: string | undefined;
  if (data.mediaUri) {
    mediaUrl = await uploadMedia(data.mediaUri, data.mediaType);
  }

  // 2. Crear documento en Firestore
  const cartaId = await createCarta({
    userId: user.uid,
    titulo: data.titulo,
    tipo: data.tipo,
    contenido: {
      texto: data.texto,
      mediaUrl,
      mediaType: data.mediaType,
    },
    guardianId: data.guardianId,
    estado,
  });

  // 3. Navegar a detalle o lista
  router.replace(`/(tabs)/cartas/${cartaId}`);
};
```

---

## Servicios

### storage.ts

```typescript
// Subir media a Firebase Storage
export const uploadMedia = async (
  uri: string,
  type: 'image' | 'video' | 'audio',
  userId: string
): Promise<string> => {
  const filename = `${userId}/${Date.now()}.${getExtension(type)}`;
  const ref = storageRef(storage, `cartas/${filename}`);

  const response = await fetch(uri);
  const blob = await response.blob();

  await uploadBytes(ref, blob);
  return getDownloadURL(ref);
};

// Generar thumbnail para video
export const generateThumbnail = async (videoUri: string): Promise<string> => {
  // Usar expo-video-thumbnails
  const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
    time: 1000,
  });
  return uri;
};
```

---

## Componentes

### CameraView

```typescript
interface CameraViewProps {
  mode: 'video' | 'photo';
  onCapture: (asset: MediaAsset) => void;
  onCancel: () => void;
}
```

### AudioRecorder

```typescript
interface AudioRecorderProps {
  onRecordingComplete: (recording: AudioRecording) => void;
  maxDuration?: number; // segundos
}
```

### VideoPlayer

```typescript
interface VideoPlayerProps {
  uri: string;
  autoPlay?: boolean;
  showControls?: boolean;
}
```

---

## Tipos

### CartaDraft

```typescript
interface CartaDraft {
  titulo: string;
  tipo: 'texto' | 'audio' | 'video' | 'foto';
  texto?: string;
  mediaUri?: string;
  mediaType?: 'image' | 'video' | 'audio';
  guardianId?: string;
}
```

### MediaAsset

```typescript
interface MediaAsset {
  uri: string;
  type: 'image' | 'video';
  width?: number;
  height?: number;
  duration?: number; // para video, en ms
}
```

### AudioRecording

```typescript
interface AudioRecording {
  uri: string;
  duration: number; // en ms
}
```

---

## Navegación

### Parámetros

```typescript
// De selector a media
router.push({
  pathname: '/crear/media',
  params: { tipo: 'video' }
});

// De media a preview
router.push({
  pathname: '/crear/preview',
  params: {
    titulo: '',
    tipo: 'video',
    mediaUri: asset.uri,
    mediaType: 'video',
  }
});
```

---

## Estados de UI

| Estado | Pantalla | UI |
|--------|----------|-----|
| `idle` | Media | Listo para grabar |
| `recording` | Media | Grabando, mostrar timer |
| `processing` | Media | Procesando video |
| `preview` | Media | Mostrando preview |
| `uploading` | Preview | Subiendo media, progress bar |
| `saving` | Preview | Guardando en Firestore |
| `success` | - | Redirect a detalle |
| `error` | Cualquiera | Toast con mensaje |

---

## Límites

| Recurso | Límite Free | Límite Premium |
|---------|-------------|----------------|
| Video | 2 min | 10 min |
| Audio | 5 min | 30 min |
| Imagen | 10 MB | 25 MB |
| Storage total | 500 MB | Ilimitado |

---

## Testing Checklist

- [ ] Seleccionar cada tipo de carta
- [ ] Escribir carta de texto
- [ ] Grabar video (cámara frontal y trasera)
- [ ] Grabar audio
- [ ] Seleccionar foto de galería
- [ ] Tomar foto con cámara
- [ ] Preview de cada tipo de media
- [ ] Volver a grabar
- [ ] Agregar título y mensaje
- [ ] Asignar guardián
- [ ] Guardar como borrador
- [ ] Activar carta
- [ ] Manejo de permisos denegados
- [ ] Límites de duración/tamaño

---

*Crear Module Spec v1.0 - MiLegado*

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
[FAB ➕ en cualquier pantalla]
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
┌─────────────────────────────────────┐
│  ✕      Nueva Carta                 │  Header 56px
├─────────────────────────────────────┤  Cormorant 20px #3D3D3D
│                                     │  BG: #FAFBF9
│     ¿Qué quieres compartir?         │  Cormorant 24px #3D3D3D
│                                     │
│  ┌───────────────────────────────┐  │
│  │  📝                           │  │  Card 1px #E5E5E5
│  │                               │  │  Hover: border #5BA4A4
│  │  Texto                        │  │  Emoji 2rem
│  │  Escribe una carta o          │  │  Title: Nunito 18px #3D3D3D
│  │  mensaje                      │  │  Desc: Nunito 14px #6A6A6A
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  🎬                           │  │
│  │                               │  │
│  │  Video                        │  │
│  │  Graba un video mensaje       │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  🎤                           │  │
│  │                               │  │
│  │  Audio                        │  │
│  │  Graba un mensaje de voz      │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  📷                           │  │
│  │                               │  │
│  │  Foto                         │  │
│  │  Comparte una imagen          │  │
│  │  especial                     │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### Opciones

| Tipo | Emoji | Descripción | Siguiente |
|------|-------|-------------|-----------|
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
Editor de texto para escribir el contenido de la carta.

### UI

```
┌─────────────────────────────────────┐
│  ←    Escribe tu carta        Vista │  Header
├─────────────────────────────────────┤
│                                     │  BG: #FAFBF9
│  Título                             │  Label Nunito 14px #6A6A6A
│  ┌───────────────────────────────┐  │
│  │  Para mi hijo                 │  │  Input 44px
│  └───────────────────────────────┘  │  Border: 1px #E5E5E5
│                                     │
│  Tu mensaje                         │
│  ┌───────────────────────────────┐  │
│  │                               │  │  Textarea
│  │  Querido hijo,                │  │  Border: 1px #E5E5E5
│  │                               │  │  Min-height: 200px
│  │  Escribo estas palabras       │  │  Nunito 16px #3D3D3D
│  │  para que sepas cuánto        │  │
│  │  te amo...                    │  │
│  │                               │  │
│  │                               │  │
│  │                               │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  📷 Agregar foto (opcional)   │  │  Ghost button
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │          Continuar            │  │  Primary button
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
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
┌─────────────────────────────────────┐
│  ←    Graba tu mensaje          🔄 │  Header
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │  Camera preview
│  │                               │  │  Border: 1px #E5E5E5
│  │                               │  │
│  │                               │  │
│  │                               │  │
│  │                               │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│            00:00                    │  Timer: Cormorant 24px #3D3D3D
│                                     │
│  ┌───────────────────────────────┐  │
│  │            ⏺️                 │  │  Record button
│  └───────────────────────────────┘  │  Border: 1px #E8B4B8
│                                     │  44px height
│  ┌───────────────────────────────┐  │
│  │   📁 Elegir de galería        │  │  Text link #5BA4A4
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### UI - Grabando

```
┌─────────────────────────────────────┐
│  ←    Grabando...               🔄 │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │                               │  │
│  │         ● REC                 │  │  Recording indicator
│  │                               │  │  Dot: #C47070 pulse
│  │                               │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│          ● 00:45                    │  Dot pulse, timer
│                                     │
│  ┌───────────────────────────────┐  │
│  │            ⏹️                 │  │  Stop button
│  └───────────────────────────────┘  │  Border: 1px #C47070
│                                     │
└─────────────────────────────────────┘
```

### UI - Modo Audio

```
┌─────────────────────────────────────┐
│  ←    Graba tu mensaje              │
├─────────────────────────────────────┤
│                                     │
│                                     │
│              🎤                     │  Emoji 4rem
│                                     │
│    ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁                 │  Waveform visualization
│                                     │  Bars: 3px width, #5BA4A4
│            00:00                    │  Timer: Cormorant 24px
│                                     │
│  ┌───────────────────────────────┐  │
│  │            ⏺️                 │  │  Record button
│  └───────────────────────────────┘  │  Border: 1px #E8B4B8
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### UI - Modo Foto

```
┌─────────────────────────────────────┐
│  ←    Elige una foto            📷 │
├─────────────────────────────────────┤
│                                     │
│  Recientes                          │  Label Nunito 14px #6A6A6A
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐          │  Grid 3 columns
│  │     │ │     │ │     │          │  Gap: 2px
│  │     │ │     │ │     │          │  Selection: border 3px #5BA4A4
│  └─────┘ └─────┘ └─────┘          │
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐          │
│  │     │ │     │ │     │          │
│  │     │ │     │ │     │          │
│  └─────┘ └─────┘ └─────┘          │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │   📷 Tomar foto               │  │  Ghost button
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### Permisos Requeridos

| Tipo | Permisos |
|------|----------|
| Video | Cámara + Micrófono |
| Audio | Micrófono |
| Foto | Galería (+ Cámara opcional) |

### Post-Captura

```
┌─────────────────────────────────────┐
│  ←    Preview                       │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │  Media preview
│  │                               │  │  Border: 1px #E5E5E5
│  │           ▶️                  │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │      Volver a grabar          │  │  Ghost button
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │        Usar este              │  │  Primary button
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

## Pantalla: Preview

### Descripción
Vista previa de la carta antes de guardar.

### UI

```
┌─────────────────────────────────────┐
│  ←    Vista previa                  │
├─────────────────────────────────────┤
│                                     │  BG: #FAFBF9
│  Título                             │  Label Nunito 14px #6A6A6A
│  ┌───────────────────────────────┐  │
│  │  Video para mi hijo           │  │  Input 44px
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │  Media preview
│  │           ▶️                  │  │  Border: 1px #E5E5E5
│  │          02:35                │  │  Duration: Nunito 12px
│  └───────────────────────────────┘  │
│                                     │
│  Mensaje (opcional)                 │
│  ┌───────────────────────────────┐  │
│  │  Este video es para tu        │  │  Textarea
│  │  graduación...                │  │
│  └───────────────────────────────┘  │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  👥 Guardián                        │
│  ┌───────────────────────────────┐  │
│  │  Sin asignar               >  │  │  Card touchable
│  └───────────────────────────────┘  │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │      Guardar borrador         │  │  Ghost button
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │       Activar carta           │  │  Blush button
│  └───────────────────────────────┘  │  Border: 1px #E8B4B8
│                                     │
└─────────────────────────────────────┘
```

### Selector de Guardián (Bottom Sheet)

```
┌─────────────────────────────────────┐
│  Asignar Guardián               ✕  │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │  ○  Sin asignar               │  │  Radio circle
│  ├───────────────────────────────┤  │  Border: 1px #E5E5E5
│  │  ●  María López (Esposa)      │  │  Selected: fill #5BA4A4
│  ├───────────────────────────────┤  │
│  │  ○  Carlos (Hijo)             │  │
│  └───────────────────────────────┘  │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  ➕ Agregar nuevo guardián    │  │  Text link #5BA4A4
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### Acciones
- **"Guardar borrador":** Guarda con estado `borrador`
- **"Activar carta":** Guarda con estado `activa`

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
  duration?: number;
}
```

### AudioRecording

```typescript
interface AudioRecording {
  uri: string;
  duration: number;
}
```

---

## Estados de UI

| Estado | Pantalla | UI |
|--------|----------|-----|
| `idle` | Media | Listo para grabar |
| `recording` | Media | ● pulse + timer |
| `processing` | Media | 💓 pulse |
| `preview` | Media | Play button |
| `uploading` | Preview | Progress bar 2px |
| `saving` | Preview | 💓 pulse |
| `success` | - | Redirect + toast ✓ |
| `error` | Any | Toast ⚠️ |

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

- [ ] Seleccionar cada tipo de carta con emoji
- [ ] Escribir carta de texto
- [ ] Grabar video con ● REC indicator
- [ ] Grabar audio con waveform
- [ ] Seleccionar foto de galería (grid 3 cols)
- [ ] Tomar foto con cámara
- [ ] Preview de cada tipo de media
- [ ] Volver a grabar
- [ ] Agregar título y mensaje
- [ ] Asignar guardián con radio buttons
- [ ] Guardar como borrador
- [ ] Activar carta con button blush
- [ ] Loading state con 💓 pulse
- [ ] Toast de éxito con ✓

---

*Crear Module Spec v3.0 - MiLegado Paradise Garden*
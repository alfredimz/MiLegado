# 🎨 Guía de Diseño — Referencia Rápida para Figma

## App de Legado Digital | Sistema de Diseño v1.0

---

## 🎯 Esencia de Marca

| Principio | Descripción | Aplicación |
|-----------|-------------|------------|
| **Calidez** | Colores del cempasúchil | Naranjas y dorados, no azules corporativos |
| **Trascendencia** | Celebramos la vida | Tono esperanzador, no fúnebre |
| **Confianza** | Seguridad visible | Badges de encriptación, confirmaciones claras |
| **Accesibilidad** | Para todas las edades | Texto grande opción, contraste alto |

---

## 🎨 Paleta de Colores

### Colores Principales

```
PRIMARY (Cempasúchil)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
50       100      200      300      400      500★     600      700      800      900
#FFF7ED  #FFEDD5  #FED7AA  #FDBA74  #FB923C  #F97316  #EA580C  #C2410C  #9A3412  #7C2D12

SECONDARY (Oro/Ámbar)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
50       100      200      300      400      500★     600      700      800      900
#FFFBEB  #FEF3C7  #FDE68A  #FCD34D  #FBBF24  #F59E0B  #D97706  #B45309  #92400E  #78350F
```

### Neutrales (Dark Mode)

```
NEUTRAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0        50       100      200      300      400      500      600      700      800      900      950
#FFFFFF  #FAFAFA  #F4F4F5  #E4E4E7  #D4D4D8  #A1A1AA  #71717A  #52525B  #3F3F46  #27272A  #18181B  #09090B
         ▲ Light BG                          ▲ Muted Text              ▲ Card    ▲ Surface ▲ BG Dark
```

### Semánticos

| Color | Hex | Uso |
|-------|-----|-----|
| ✅ Success | `#22C55E` | Confirmaciones, éxito, latido OK |
| ⚠️ Warning | `#F59E0B` | Alertas, latido próximo a vencer |
| ❌ Error | `#EF4444` | Errores, validaciones fallidas |
| ℹ️ Info | `#3B82F6` | Información neutral, tips |

### Especiales — Legado

| Color | Hex | Uso |
|-------|-----|-----|
| 💜 Purple | `#8B5CF6` | Guardianes, conexiones |
| 💗 Pink | `#EC4899` | Emocional, cartas de amor |
| 💚 Teal | `#14B8A6` | Latido, vida, salud |

---

## 📝 Tipografía

### Font Family
**Inter** — Descarga: [Google Fonts](https://fonts.google.com/specimen/Inter)

### Escala Tipográfica

| Nombre | Tamaño | Peso | Line Height | Uso |
|--------|--------|------|-------------|-----|
| Display | 48px | 800 ExtraBold | 1.1 | Splash, onboarding |
| H1 | 32px | 700 Bold | 1.2 | Títulos de pantalla |
| H2 | 24px | 600 SemiBold | 1.3 | Secciones |
| H3 | 20px | 600 SemiBold | 1.4 | Subtítulos |
| Body Large | 18px | 400 Regular | 1.6 | **Seniors (Roberto)** |
| Body | 16px | 400 Regular | 1.6 | Texto default |
| Body Small | 14px | 400 Regular | 1.5 | Texto secundario |
| Caption | 12px | 500 Medium | 1.4 | Labels, metadata |
| Button | 16px | 600 SemiBold | 1.0 | Botones |

### Regla de Accesibilidad
> Para usuarios senior (Persona 2: Roberto), usar **Body Large (18px)** como tamaño base.
> Nunca usar texto menor a 14px en contenido importante.

---

## 📏 Espaciado

### Sistema de 4px

| Token | Valor | Uso común |
|-------|-------|-----------|
| space-1 | 4px | Micro espacios |
| space-2 | 8px | Entre elementos inline |
| space-3 | 12px | Padding interno compacto |
| space-4 | 16px | Padding default, gaps |
| space-5 | 20px | Padding medio |
| space-6 | 24px | Secciones, cards |
| space-8 | 32px | Entre secciones |
| space-10 | 40px | Separación grande |
| space-12 | 48px | Header/footer |
| space-16 | 64px | Márgenes de pantalla |

### Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| sm | 4px | Badges pequeños |
| md | 8px | Inputs, chips |
| lg | 12px | Buttons, small cards |
| xl | 16px | Cards, modals |
| 2xl | 24px | Bottom sheets |
| full | 9999px | Avatares, FAB |

---

## 🧩 Componentes

### Botones

| Variante | Fondo | Borde | Texto |
|----------|-------|-------|-------|
| Primary | `#F97316` gradient | none | white |
| Secondary | `#27272A` | `#3F3F46` | `#F4F4F5` |
| Outline | transparent | `#F97316` | `#FB923C` |
| Ghost | transparent | none | `#D4D4D8` |

**Tamaños:**
- Small: 36px height, 14px text
- Medium: 48px height, 16px text (default)
- Large: 56px height, 18px text

### Inputs

```
┌─────────────────────────────────────┐
│ Label (14px, #D4D4D8)               │
├─────────────────────────────────────┤
│                                     │
│  Placeholder text (#71717A)         │  ← 52px height
│                                     │     16px padding horizontal
├─────────────────────────────────────┤     12px radius
│ Helper text (12px, #71717A)         │     Border: #3F3F46
└─────────────────────────────────────┘     Focus border: #F97316
```

### Cards

```
┌─────────────────────────────────────┐
│  ┌────┐                             │
│  │ 📝 │  Título Card                │  ← 16px padding
│  └────┘  Subtítulo                  │     16px radius
│                                     │     BG: #27272A
│  Contenido de la card...            │     Border: #3F3F46
│                                     │
└─────────────────────────────────────┘
```

### Bottom Navigation

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   🏠        📚         👥         👤               │  ← 80px height
│  Inicio   Mi Legado  Guardianes  Perfil            │     24px padding bottom
│                                                     │     BG: #18181B
│  [active]                                           │     Active: #F97316
└─────────────────────────────────────────────────────┘     Inactive: #71717A
```

### FAB (Floating Action Button)

```
        ┌─────┐
        │  +  │  ← 56px × 56px
        └─────┘     Full radius
                    BG: Gradient primary
                    Shadow: glow effect
```

---

## 🎭 Iconografía

### Librería: Lucide React Native

```bash
npm install lucide-react-native
```

### Iconos Principales

| Concepto | Icono Lucide | Uso |
|----------|--------------|-----|
| Inicio | `Home` | Tab navigation |
| Legado/Cartas | `FileText` | Tab, listas |
| Guardianes | `Users` | Tab, perfiles |
| Perfil | `User` | Tab, settings |
| Crear | `Plus` | FAB, add buttons |
| Video | `Video` | Media type |
| Audio | `Mic` | Media type |
| Foto | `Camera` | Media type |
| Galería | `Image` | Media picker |
| Latido | `Heart` o `HeartPulse` | Dashboard, status |
| Seguridad | `Shield` o `Lock` | Auth, encryption |
| Batería | `Battery` | Status indicator |
| Configuración | `Settings` | Settings screen |
| Notificación | `Bell` | Alerts |

### Tamaños de Iconos

| Tamaño | Valor | Uso |
|--------|-------|-----|
| sm | 16px | Inline con texto |
| md | 20px | Botones, inputs |
| lg | 24px | Navigation, cards (default) |
| xl | 32px | Feature icons |

---

## 📱 Layout de Pantallas

### Estructura Base

```
┌─────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ ← Status Bar (System)
├─────────────────────────────────────┤
│                                     │
│         Header (56px)               │ ← Opcional por pantalla
│                                     │
├─────────────────────────────────────┤
│                                     │
│                                     │
│                                     │
│         Content Area                │ ← Scroll vertical
│         (padding: 16px)             │
│                                     │
│                                     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│       Tab Bar (80px)                │ ← Fixed bottom
│                                     │
└─────────────────────────────────────┘
```

### Dimensiones Clave

| Elemento | Valor |
|----------|-------|
| Screen padding | 16px |
| Header height | 56px |
| Tab bar height | 80px |
| Tab bar padding bottom | 24px (safe area) |
| Card spacing | 16px |
| Section spacing | 32px |
| Max content width | 480px |

---

## 🌓 Temas

### Dark Mode (Default)

| Elemento | Color | Hex |
|----------|-------|-----|
| Background | neutral-950 | `#09090B` |
| Surface | neutral-900 | `#18181B` |
| Card | neutral-800 | `#27272A` |
| Border | neutral-700 | `#3F3F46` |
| Text primary | neutral-0 | `#FFFFFF` |
| Text secondary | neutral-300 | `#D4D4D8` |
| Text muted | neutral-500 | `#71717A` |

### Light Mode (Opcional)

| Elemento | Color | Hex |
|----------|-------|-----|
| Background | neutral-50 | `#FAFAFA` |
| Surface | neutral-0 | `#FFFFFF` |
| Card | neutral-0 | `#FFFFFF` |
| Border | neutral-200 | `#E4E4E7` |
| Text primary | neutral-900 | `#18181B` |
| Text secondary | neutral-700 | `#3F3F46` |
| Text muted | neutral-500 | `#71717A` |

---

## ✅ Checklist de Diseño

### Antes de diseñar cada pantalla:

- [ ] ¿Cuál persona es el usuario principal de esta pantalla?
- [ ] ¿El texto más pequeño es >= 14px?
- [ ] ¿Los botones tienen al menos 48px de altura?
- [ ] ¿El contraste es >= 4.5:1?
- [ ] ¿Los CTAs usan el color primario?
- [ ] ¿La navegación es clara (máx 3 taps al objetivo)?

### Para seniors (Roberto):

- [ ] Texto base 18px (no 16px)
- [ ] Botones extra grandes (56px)
- [ ] Labels explícitos (no solo iconos)
- [ ] Confirmaciones en cada acción
- [ ] Opción de Light Mode

---

## 📁 Estructura en Figma

```
📂 Legado Digital
├── 📄 Cover
├── 📂 🎨 Design System
│   ├── Colors
│   ├── Typography
│   ├── Spacing & Grid
│   ├── Icons
│   └── Components
│       ├── Buttons
│       ├── Inputs
│       ├── Cards
│       ├── Navigation
│       ├── Modals
│       └── Feedback
├── 📂 👥 Research
│   ├── Proto-Personas
│   ├── User Journeys
│   └── Competitive Analysis
├── 📂 📐 Wireframes
│   ├── Auth Flow
│   ├── Main Flow
│   └── Guardian Flow
├── 📂 🎨 Mockups
│   ├── Onboarding
│   ├── Dashboard
│   ├── Cartas
│   ├── Guardianes
│   ├── Perfil
│   └── Modals
└── 📂 🔗 Prototype
    └── Interactive Demo
```

---

*Sistema de Diseño v1.0 — App de Legado Digital*
*UNIR 2025 | Generado para Figma + React Native*
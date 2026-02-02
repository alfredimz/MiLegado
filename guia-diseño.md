# 🎨 Guía de Diseño — Referencia Rápida para Figma

## MiLegado | Paradise Garden v3.0

---

## 🎯 Esencia de Marca

| Principio | Descripción | Aplicación |
|-----------|-------------|------------|
| 🌊 **Sereno** | Formas limpias y rectas | Border radius 0px en todo |
| ✍️ **Ligero** | Tipografía delicada | Solo weights 300-400 |
| 🌸 **Cálido** | Paleta paraíso terrenal | Sage, dorado, blush |
| 〰️ **Delicado** | Líneas finas | 1px borders, sin sombras |

---

## 🎨 Paleta de Colores

### Principales

```
BACKGROUND
#FAFBF9 — Fondo principal

PRIMARY (Sage Green)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Light        DEFAULT★      Dark
#7BBDBD      #5BA4A4       #4A8F8F

SECONDARY (Golden Warm)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Light        DEFAULT★      Dark
#D4B494      #C4A484       #A68B6A

BLUSH (Rosa Cálido)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Light        DEFAULT★      Dark
#F2D0D3      #E8B4B8       #D49EA2
```

### Superficies y Texto

| Nombre | Hex | Uso |
|--------|-----|-----|
| Surface | `#FFFFFF` | Cards, modales |
| Surface Alt | `#F5F6F4` | Hover, alternativo |
| Text | `#3D3D3D` | Texto principal |
| Text Secondary | `#6A6A6A` | Texto secundario |
| Text Muted | `#9A9A9A` | Placeholders |
| Border | `#E5E5E5` | Bordes default |

### Semánticos

| Color | DEFAULT | Light | Uso |
|-------|---------|-------|-----|
| Success | `#7BAA9E` | `#E8F2F0` | Éxito |
| Error | `#C47070` | `#F5EBEB` | Error |
| Warning | `#D4C4A5` | `#F5F2EB` | Alerta |

---

## 📝 Tipografía

### Sistema de 3 Fuentes

| Nivel | Font | Google Fonts |
|-------|------|--------------|
| **Display** | Cormorant Garamond | `wght@300;400` |
| **Script** | Dancing Script | `wght@400` |
| **Body** | Nunito | `wght@300;400` |

### Escala

| Style | Font | Size | Weight | Uso |
|-------|------|------|--------|-----|
| Display | Cormorant | 40px | 300 | Splash |
| H1 | Cormorant | 32px | 300 | Títulos |
| H2 | Cormorant | 24px | 400 | Secciones |
| Script | Dancing | 20px | 400 | Taglines |
| Body Large | Nunito | 18px | 300 | Destacado |
| Body | Nunito | 16px | 300 | Default |
| Body Small | Nunito | 14px | 300 | Secundario |
| Caption | Nunito | 12px | 400 | Labels |
| Button | Nunito | 16px | 400 | Botones |

### ⚠️ Regla Absoluta

> **NUNCA usar bold (600+).** Máximo weight: 400

---

## 📏 Espaciado (Base 4px)

| Token | Valor | Uso |
|-------|-------|-----|
| 4xs | 4px | Micro |
| 3xs | 8px | Inline |
| 2xs | 12px | Compacto |
| xs | 16px | **Default** |
| sm | 24px | Cards |
| md | 32px | Secciones |
| lg | 48px | Grande |
| xl | 64px | Márgenes |

---

## 📐 Border Radius

| Elemento | Valor |
|----------|-------|
| **Todo** | **0px** |
| **Avatares** | 50% (círculo) |

---

## 🚫 Prohibido

```
❌ Sombras (box-shadow: none)
❌ Gradientes (solo colores sólidos)
❌ Bold (max weight 400)
❌ Border radius (excepto avatares)
❌ Iconos SVG (usar emojis)
```

---

## 🧩 Componentes

### Botones

**Outline por defecto → Fill en hover**

| Size | Height | Font |
|------|--------|------|
| Small | 36px | 14px |
| Medium | 44px | 16px |
| Large | 52px | 16px |

| Variante | Border | Text |
|----------|--------|------|
| Primary | `#5BA4A4` | `#5BA4A4` |
| Secondary | `#C4A484` | `#C4A484` |
| Blush | `#E8B4B8` | `#D49EA2` |
| Ghost | `#E5E5E5` | `#6A6A6A` |
| Danger | `#C47070` | `#C47070` |

### Inputs

```
┌─────────────────────────────────────┐
│ Label (14px #6A6A6A)                │
├─────────────────────────────────────┤
│  Placeholder (#9A9A9A)              │  44px height
├─────────────────────────────────────┤  0px radius
│ Helper (12px)                       │  1px border #E5E5E5
└─────────────────────────────────────┘  Focus: #5BA4A4
```

### Cards

```
┌─────────────────────────────────────┐
│                                     │
│  📝  Título (Cormorant)             │  20px padding
│      Subtítulo (Nunito)             │  0px radius
│                                     │  1px #E5E5E5
│  Contenido...                       │  Hover: #5BA4A4
│                                     │
└─────────────────────────────────────┘
```

### Tab Bar

```
┌─────────────────────────────────────────────────────┐
│  🏠        📚         👥         👤                │  64px + safe
│ Inicio   Legado   Guardianes   Perfil              │  1px top border
│                                                     │  Active: #5BA4A4
└─────────────────────────────────────────────────────┘  Inactive: #9A9A9A
```

### Modales

```
┌─────────────────────────────────────┐
│              ✨                     │  24px padding
│                                     │  0px radius
│      Título (Cormorant)             │  1px #E5E5E5
│      Mensaje (Nunito)               │  Overlay: rgba(0,0,0,0.4)
│                                     │
│   [ Cancelar ]    [ Confirmar ]     │
└─────────────────────────────────────┘
```

---

## 😊 Emojis (Iconografía)

| Concepto | Emoji |
|----------|-------|
| Inicio | 🏠 |
| Legado | 📚 |
| Guardianes | 👥 |
| Perfil | 👤 |
| Texto | 📝 |
| Video | 🎬 |
| Audio | 🎤 |
| Foto | 📷 |
| Latido | 💓 |
| Activa | ✨ |
| Check | ✓ |
| Config | ⚙️ |
| Seguridad | 🔒 |
| Agregar | ➕ |
| Atrás | ← |
| Warning | ⚠️ |

---

## 📐 Layout

| Elemento | Valor |
|----------|-------|
| Screen padding | 16px |
| Header height | 56px |
| Tab bar | 64px + safe |
| Touch target | 44×44px |
| Max width | 480px |

---

## ✅ Checklist

- [ ] Border radius 0px?
- [ ] Sin sombras?
- [ ] Sin gradientes?
- [ ] Max weight 400?
- [ ] Botones outline?
- [ ] Emojis no iconos?
- [ ] Touch 44px+?
- [ ] Texto 16px+?
- [ ] Bordes 1px?

---

## 📱 Frames Figma

- iPhone 14 Pro: 393 × 852
- iPhone SE: 375 × 667
- Android: 360 × 800

---

## 🎯 Copiar/Pegar

```
Background:   #FAFBF9
Primary:      #5BA4A4
Secondary:    #C4A484
Blush:        #E8B4B8
Text:         #3D3D3D
Border:       #E5E5E5
Success:      #7BAA9E
Error:        #C47070

Display: Cormorant Garamond 300
Script: Dancing Script 400
Body: Nunito 300

Border Radius: 0px
Shadows: none
```

---

*MiLegado — Paradise Garden v3.0*
*UNIR 2025*
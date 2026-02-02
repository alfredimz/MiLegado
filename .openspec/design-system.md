# Sistema de Diseño - MiLegado v3.0

## Filosofía: Paradise Garden

Un jardín sereno donde los recuerdos florecen eternamente. Diseño flat, delicado y cálido.

---

## Principios de Diseño

| Principio | Aplicación |
|-----------|------------|
| 🌊 **Sereno** | Sin bordes redondeados, formas rectas y limpias |
| ✍️ **Ligero** | Tipografías light (300-400), nunca bold |
| 🌸 **Cálido** | Paleta suave inspirada en paraíso terrenal |
| 〰️ **Delicado** | Líneas 1px, botones outline, sin sombras |

---

## Paleta de Colores

### Colores Principales

| Color | Hex | Uso |
|-------|-----|-----|
| **Background** | `#FAFBF9` | Fondo principal de la app |
| **Primary** | `#5BA4A4` | CTAs, links, acentos, elementos activos |
| **Secondary** | `#C4A484` | Dorado cálido, taglines, detalles |
| **Blush** | `#E8B4B8` | Highlights, latido, emocional |
| **Text** | `#3D3D3D` | Texto principal |

### Colores Secundarios

| Color | Hex | Uso |
|-------|-----|-----|
| **Surface** | `#FFFFFF` | Cards, modales, inputs |
| **Surface Alt** | `#F5F6F4` | Fondos alternativos, hovers |
| **Border** | `#E5E5E5` | Bordes de componentes |
| **Border Light** | `#F0F0F0` | Separadores sutiles |
| **Text Secondary** | `#6A6A6A` | Texto secundario |
| **Text Muted** | `#9A9A9A` | Placeholders, hints |
| **Text Disabled** | `#BEBEBE` | Estados deshabilitados |

### Colores Semánticos

| Color | Hex | Uso |
|-------|-----|-----|
| **Success** | `#7BAA9E` | Confirmaciones, éxito |
| **Success Light** | `#E8F2F0` | Fondo de toast éxito |
| **Error** | `#D4A5A5` | Errores suaves |
| **Error Dark** | `#C47070` | Errores, danger buttons |
| **Error Light** | `#F5EBEB` | Fondo de toast error |
| **Warning** | `#D4C4A5` | Advertencias |
| **Warning Light** | `#F5F2EB` | Fondo de toast warning |

---

## Tipografía

### Sistema de 3 Fuentes

| Nivel | Fuente | Pesos | Uso |
|-------|--------|-------|-----|
| **Display** | Cormorant Garamond | 300, 400 | Logo, H1, H2, títulos emocionales |
| **Script** | Dancing Script | 400 | Taglines, frases emotivas |
| **Body** | Nunito | 300, 400 | UI, botones, párrafos, labels |

### Escala Tipográfica

| Style | Fuente | Tamaño | Peso | Line Height | Uso |
|-------|--------|--------|------|-------------|-----|
| Display | Cormorant | 40px | 300 | 1.1 | Splash, hero |
| H1 | Cormorant | 32px | 300 | 1.2 | Títulos de pantalla |
| H2 | Cormorant | 24px | 400 | 1.3 | Secciones |
| Script | Dancing | 20px | 400 | 1.4 | Taglines emocionales |
| Body Large | Nunito | 18px | 300 | 1.6 | Texto destacado |
| Body | Nunito | 16px | 300 | 1.6 | Texto default |
| Body Small | Nunito | 14px | 300 | 1.5 | Texto secundario |
| Caption | Nunito | 12px | 400 | 1.4 | Labels, metadata |
| Button | Nunito | 16px | 400 | 1.0 | Botones |

### Regla Crítica

> **Nunca usar bold (600+).** Solo pesos 300 (Light) y 400 (Regular).
> Esto mantiene la estética delicada y serena del Paradise Garden.

---

## Espaciado

**Base:** 4px

| Token | Valor | Uso |
|-------|-------|-----|
| 4xs | 4px | Micro espacios |
| 3xs | 8px | Entre elementos inline |
| 2xs | 12px | Padding interno compacto |
| xs | 16px | Padding default, gaps |
| sm | 24px | Secciones, cards |
| md | 32px | Entre secciones |
| lg | 48px | Separación grande |
| xl | 64px | Márgenes de pantalla |
| 2xl | 80px | Espacios hero |

---

## Border Radius

| Elemento | Valor | Nota |
|----------|-------|------|
| **Todo** | 0px | Sin bordes redondeados |
| **Avatares** | 50% (círculo) | Única excepción |

---

## Bordes

| Propiedad | Valor |
|-----------|-------|
| Width | 1px siempre |
| Color default | `#E5E5E5` |
| Color hover | `#5BA4A4` |
| Color focus | `#5BA4A4` |
| Color error | `#C47070` |
| Color success | `#7BAA9E` |

---

## Sombras

**No hay sombras.** Diseño completamente flat.

```css
box-shadow: none;
```

---

## Componentes

### Botones

**Estilo:** Outline por defecto, fill solo en hover/press

| Variante | Border | Color | Hover |
|----------|--------|-------|-------|
| Primary | `#5BA4A4` | `#5BA4A4` | Fill `#5BA4A4`, text white |
| Secondary | `#C4A484` | `#C4A484` | Fill `#C4A484`, text white |
| Blush | `#E8B4B8` | `#D49EA2` | Fill `#E8B4B8`, text white |
| Ghost | `#E5E5E5` | `#6A6A6A` | Border `#6A6A6A` |
| Danger | `#C47070` | `#C47070` | Fill `#C47070`, text white |
| Text | none | `#5BA4A4` | Background `#F5F6F4` |

**Tamaños:**

| Size | Height | Padding | Font |
|------|--------|---------|------|
| Small | 36px | 8px 16px | 14px |
| Medium | 44px | 12px 24px | 16px |
| Large | 52px | 16px 32px | 16px |

### Inputs

| Propiedad | Valor |
|-----------|-------|
| Height | 44px mínimo |
| Padding | 14px 16px |
| Border | 1px solid `#E5E5E5` |
| Border Radius | 0px |
| Background | `#FFFFFF` |
| Focus Border | `#5BA4A4` |
| Error Border | `#C47070` |
| Placeholder | `#9A9A9A` |

### Cards

| Propiedad | Valor |
|-----------|-------|
| Padding | 20px |
| Border | 1px solid `#E5E5E5` |
| Border Radius | 0px |
| Background | `#FFFFFF` |
| Hover Border | `#5BA4A4` |

### Tab Bar

| Propiedad | Valor |
|-----------|-------|
| Height | 64px + safe area |
| Background | `#FFFFFF` |
| Border Top | 1px solid `#E5E5E5` |
| Active Color | `#5BA4A4` |
| Inactive Color | `#9A9A9A` |
| Icon Size | 24px (emoji) |
| Label Size | 11px |

### Modales

| Propiedad | Valor |
|-----------|-------|
| Overlay | rgba(0,0,0,0.4) |
| Background | `#FFFFFF` |
| Border | 1px solid `#E5E5E5` |
| Padding | 24px |
| Max Width | 400px |
| Position | Centrado |

### Toasts

| Propiedad | Valor |
|-----------|-------|
| Position | Top |
| Padding | 16px 24px |
| Border | 1px solid (según tipo) |
| Background | Light del tipo |

---

## Iconografía

**Sistema:** Emojis nativos (no SVG icons)

### Catálogo Principal

| Concepto | Emoji | Uso |
|----------|-------|-----|
| Inicio | 🏠 | Tab navigation |
| Mi Legado | 📚 | Tab, listas |
| Guardianes | 👥 | Tab, perfiles |
| Perfil | 👤 | Tab, settings |
| Carta Texto | 📝 | Tipo de carta |
| Video | 🎬 | Tipo de carta |
| Audio | 🎤 | Tipo de carta |
| Foto | 📷 | Tipo de carta |
| Latido | 💓 | Dashboard, status |
| Activa | ✨ | Estado de carta |
| Check | ✓ | Confirmaciones |
| Config | ⚙️ | Settings |
| Seguridad | 🔒 | Auth, encryption |
| Agregar | ➕ | Botones add |
| Legado | 🌿 | Branding |
| Paz | 🕊️ | Emocional |
| Warning | ⚠️ | Alertas, errores |
| Error | 😕 | Empty states |
| Conexión | 📡 | Offline |
| Atrás | ← | Navegación |
| Dropdown | ▼ | Selects |
| Play | ▶️ | Media |
| Pause | ⏸️ | Media |

---

## Layout

| Elemento | Valor |
|----------|-------|
| Screen Padding H | 16px |
| Screen Padding V | 24px |
| Header Height | 56px |
| Tab Bar Height | 64px + safe area |
| Card Spacing | 16px |
| Section Spacing | 24-32px |
| Min Touch Target | 44×44px |
| Max Content Width | 480px |

---

## Animaciones

| Tipo | Duración | Easing |
|------|----------|--------|
| Fade | 0.2s | ease |
| Slide | 0.3s | ease-out |
| Pulse (loading) | 1.2s | ease-in-out infinite |
| Recording dot | 1s | ease-in-out infinite |

```css
/* Loading */
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.8; }
}

/* Recording */
@keyframes recording-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
```

---

## Estados Especiales

### Empty State
- Emoji grande (4rem)
- Título en Cormorant
- Mensaje en Nunito
- CTA integrado

### Loading
- Emoji 💓 con animación pulse
- Texto "Cargando..." debajo

### Offline
- Banner con emoji 📡
- Solo visible al intentar acción

---

## Checklist de Accesibilidad

- [ ] Texto mínimo 16px
- [ ] Touch targets 44×44px mínimo
- [ ] Contraste 4.5:1 mínimo
- [ ] Labels explícitos con emojis
- [ ] Estados de focus visibles
- [ ] Light mode únicamente

---

## Reglas Absolutas

1. **Border radius: 0px** (excepto avatares)
2. **Border width: 1px** siempre
3. **Font weights: 300-400** únicamente
4. **Sombras: ninguna**
5. **Gradientes: ninguno**
6. **Botones: outline** (fill solo en hover)
7. **Iconos: emojis** nativos
8. **Tema: light mode** únicamente

---

*MiLegado Design System v3.0 — Paradise Garden*
*UNIR 2025*
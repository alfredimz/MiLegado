# Sistema de Diseño - MiLegado

## Esencia de Marca

| Principio | Aplicación |
|-----------|------------|
| **Cálido** | Colores cempasúchil, no corporativos fríos |
| **Empático** | Celebra vida, nunca alarmista |
| **Seguro** | Confianza visible, badges de encriptación |
| **Accesible** | Funciona para usuarios de 31 a 68 años |

---

## Paleta de Colores

### Primary - Naranja Cempasúchil

```
50:  #FFF7ED
100: #FFEDD5
200: #FED7AA
300: #FDBA74
400: #FB923C
500: #F97316  ← Principal
600: #EA580C
700: #C2410C
800: #9A3412
900: #7C2D12
```

### Secondary - Ámbar Dorado

```
50:  #FFFBEB
100: #FEF3C7
200: #FDE68A
300: #FCD34D
400: #FBBF24
500: #EAB308  ← Principal
600: #CA8A04
700: #A16207
800: #854D0E
900: #713F12
```

### Semánticos

| Color | Hex | Uso |
|-------|-----|-----|
| Success | `#22C55E` | Confirmaciones, latido OK |
| Error | `#EF4444` | Errores, validaciones fallidas |
| Warning | `#F59E0B` | Alertas, latido próximo a vencer |
| Info | `#3B82F6` | Información neutral, tips |

### Accent - Especiales

| Color | Hex | Uso |
|-------|-----|-----|
| Purple | `#8B5CF6` | Guardianes, conexiones |
| Pink | `#EC4899` | Emocional, cartas de amor |
| Teal | `#14B8A6` | Latido, vida, salud |

### Neutrales

```
0:   #FFFFFF
50:  #FAFAFA
100: #F4F4F5
200: #E4E4E7
300: #D4D4D8
400: #A1A1AA
500: #71717A  ← Text Muted
600: #52525B
700: #3F3F46  ← Border
800: #27272A  ← Card
900: #18181B  ← Surface
950: #0A0A0A  ← Background
```

---

## Temas

### Dark Mode (Default)

| Elemento | Token | Hex |
|----------|-------|-----|
| Background | `neutral.950` | `#0A0A0A` |
| Surface | `neutral.900` | `#18181B` |
| Card | `neutral.800` | `#27272A` |
| Border | `neutral.700` | `#3F3F46` |
| Text Primary | `neutral.0` | `#FFFFFF` |
| Text Secondary | `neutral.300` | `#D4D4D8` |
| Text Muted | `neutral.500` | `#71717A` |

### Light Mode

| Elemento | Token | Hex |
|----------|-------|-----|
| Background | `secondary.50` | `#FFFBEB` |
| Surface | `neutral.0` | `#FFFFFF` |
| Card | `neutral.0` | `#FFFFFF` |
| Border | `neutral.200` | `#E4E4E7` |
| Text Primary | `neutral.900` | `#18181B` |
| Text Secondary | `neutral.700` | `#3F3F46` |
| Text Muted | `neutral.500` | `#71717A` |

---

## Tipografía

**Font Family:** Inter (Google Fonts)

### Escala

| Style | Size | Weight | Line Height | Uso |
|-------|------|--------|-------------|-----|
| Display | 40px | 800 ExtraBold | 1.1 | Splash, títulos hero |
| H1 | 32px | 700 Bold | 1.2 | Títulos de pantalla |
| H2 | 24px | 600 SemiBold | 1.3 | Secciones |
| H3 | 20px | 600 SemiBold | 1.4 | Subtítulos |
| Body Large | 18px | 400 Regular | 1.6 | **Default para seniors** |
| Body | 16px | 400 Regular | 1.6 | Texto normal |
| Body Small | 14px | 400 Regular | 1.5 | Texto secundario |
| Caption | 12px | 500 Medium | 1.4 | Labels, metadata |
| Button | 16px | 600 SemiBold | 1.0 | Botones |

### Regla de Accesibilidad

> Para usuarios senior (Roberto, 68 años), usar **Body Large (18px)** como base.
> Nunca usar texto menor a 14px en contenido importante.

---

## Espaciado

**Base:** 4px

| Token | Valor | Uso |
|-------|-------|-----|
| 1 | 4px | Micro espacios |
| 2 | 8px | Entre elementos inline |
| 3 | 12px | Padding interno compacto |
| 4 | 16px | **Padding default**, gaps |
| 5 | 20px | Padding medio |
| 6 | 24px | Secciones, cards |
| 8 | 32px | Entre secciones |
| 10 | 40px | Separación grande |
| 12 | 48px | Header/footer |
| 16 | 64px | Márgenes de pantalla |

---

## Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| sm | 4px | Badges pequeños |
| md | 8px | Inputs, chips |
| lg | 12px | **Botones**, cards pequeñas |
| xl | 16px | **Cards**, modales |
| 2xl | 20px | Bottom sheets |
| 3xl | 24px | Modales grandes |
| full | 9999px | Avatares, pills, FAB |

---

## Sombras

```typescript
// Para React Native
shadows: {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 6,
  },
  glow: {
    shadowColor: '#F97316', // primary.500
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
}
```

---

## Componentes

### Botones

**Tamaños:**
| Size | Height | Font |
|------|--------|------|
| Small | 40px | 14px |
| Medium | 48px | 16px |
| Large | 56px | 18px (accesibilidad) |

**Variantes:**

| Variante | Background | Border | Text |
|----------|------------|--------|------|
| Primary | `#F97316` gradient | none | white |
| Secondary | `#27272A` | `#3F3F46` | `#F4F4F5` |
| Outline | transparent | `#F97316` | `#FB923C` |
| Ghost | transparent | none | `#D4D4D8` |
| Danger | `#EF4444` gradient | none | white |

**Border Radius:** 12px (lg)

### Inputs

| Propiedad | Valor |
|-----------|-------|
| Height | 52px |
| Padding H | 16px |
| Border Radius | 12px |
| Background | `#18181B` |
| Border | 1px `#3F3F46` |
| Focus Border | `#F97316` |
| Placeholder | `#71717A` |

### Cards

| Propiedad | Valor |
|-----------|-------|
| Padding | 16px |
| Border Radius | 16px (xl) |
| Background | `#18181B` |
| Border | 1px `#27272A` |

### Bottom Navigation

| Propiedad | Valor |
|-----------|-------|
| Height | 80px |
| Padding Bottom | 24px (safe area) |
| Background | `#18181B` |
| Active Color | `#F97316` |
| Inactive Color | `#71717A` |

### FAB (Floating Action Button)

| Propiedad | Valor |
|-----------|-------|
| Size | 56×56px |
| Border Radius | full |
| Background | Gradient primary |
| Shadow | glow |

---

## Layout

| Elemento | Valor |
|----------|-------|
| Screen padding H | 16px |
| Screen padding V | 24px |
| Header height | 56px |
| Tab bar height | 80px |
| Tab bar padding bottom | 24px |
| Card spacing | 16px |
| Section spacing | 24-32px |
| Min touch target | 48×48px |
| Max content width | 480px |

---

## Iconografía

**Librería:** Lucide React Native

**Tamaños:**
| Token | Size | Uso |
|-------|------|-----|
| sm | 16px | Inline con texto |
| md | 20px | Botones, inputs |
| lg | 24px | Navigation, cards (default) |
| xl | 32px | Feature icons |

**Stroke width:** 2

### Iconos Principales

| Concepto | Icono | Uso |
|----------|-------|-----|
| Inicio | `Home` | Tab navigation |
| Legado | `FileText` | Tab, listas cartas |
| Guardianes | `Users` | Tab, perfiles |
| Perfil | `User` | Tab, settings |
| Crear | `Plus` | FAB, add buttons |
| Video | `Video` | Media type |
| Audio | `Mic` | Media type |
| Foto | `Camera` | Media type |
| Latido | `HeartPulse` | Dashboard, status |
| Seguridad | `Shield` | Auth, encryption |
| Batería | `Battery` | Status indicator |

---

## Accesibilidad

### Checklist

- [ ] Texto mínimo 16px (18px preferido para seniors)
- [ ] Touch targets 48×48px mínimo
- [ ] Contraste 4.5:1 mínimo
- [ ] No solo color para información
- [ ] Botones grandes (56px) para CTAs principales
- [ ] Modo claro disponible
- [ ] Labels explícitos, no solo iconos

---

## Animaciones

```typescript
animation: {
  duration: {
    instant: 0,
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 500,
  },
  spring: {
    damping: 15,
    stiffness: 150,
  },
}
```

---

## Referencia Rápida Figma

```
Colores principales:
- Primary: #F97316
- Secondary: #EAB308
- Background: #0A0A0A
- Surface: #18181B
- Card: #27272A

Tipografía:
- Font: Inter
- Body: 16px / 400
- Body Large: 18px / 400 (seniors)
- H1: 32px / 700

Espaciado:
- Base: 4px
- Default padding: 16px
- Section gap: 24px

Componentes:
- Button height: 48px (md), 56px (lg)
- Input height: 52px
- Card radius: 16px
- Button radius: 12px
```

---

*MiLegado Design System v1.0 - UNIR 2025*

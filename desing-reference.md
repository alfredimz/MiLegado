# 🎨 Design System — Referencia Rápida Figma

## App de Legado Digital | v1.0

---

## 🎯 Esencia de Marca

| Principio | Aplicación |
|-----------|------------|
| **Cálido** | Colores cempasúchil, no corporativos fríos |
| **Empático** | Celebra vida, nunca alarmista |
| **Seguro** | Confianza visible, badges de encriptación |
| **Accesible** | Funciona para 31 y 68 años |

---

## 🎨 Colores Principales

### Primary — Naranja Cempasúchil
```
500 (Principal): #F97316
400: #FB923C
600: #EA580C
```

### Secondary — Ámbar Dorado
```
500 (Principal): #EAB308
400: #FBBF24
600: #CA8A04
```

### Semantic
```
Success: #22C55E
Error: #EF4444
Warning: #F59E0B
Info: #3B82F6
```

### Accent — Morado (Guardianes)
```
500: #8B5CF6
```

### Neutrales (Dark Mode)
```
Background:     #0A0A0A (950)
Surface:        #141414 (925)
Card:           #18181B (900)
Border:         #27272A (800)
Text Primary:   #FFFFFF (0)
Text Secondary: #D4D4D8 (300)
Text Muted:     #71717A (500)
```

### Neutrales (Light Mode)
```
Background:     #FFFBEB (secondary-50)
Surface:        #FFFFFF (0)
Card:           #FFFFFF (0)
Border:         #E4E4E7 (200)
Text Primary:   #18181B (900)
Text Secondary: #3F3F46 (700)
Text Muted:     #71717A (500)
```

---

## 📝 Tipografía

**Font:** Inter (Google Fonts)

| Style | Size | Weight | Line Height |
|-------|------|--------|-------------|
| Display | 40px | 800 ExtraBold | 1.1 |
| H1 | 32px | 700 Bold | 1.2 |
| H2 | 24px | 600 SemiBold | 1.3 |
| H3 | 20px | 600 SemiBold | 1.4 |
| Body Large | 18px | 400 Regular | 1.6 |
| Body | 16px | 400 Regular | 1.6 |
| Body Small | 14px | 400 Regular | 1.5 |
| Caption | 12px | 500 Medium | 1.4 |
| Button | 16px | 600 SemiBold | 1.0 |

**Regla Senior:** Para Roberto (68), usar Body Large (18px) como default.

---

## 📏 Espaciado (Base 4px)

| Token | Valor |
|-------|-------|
| 4xs | 4px |
| 3xs | 8px |
| 2xs | 12px |
| xs | 16px |
| sm | 20px |
| md | 24px |
| lg | 32px |
| xl | 40px |
| 2xl | 48px |
| 3xl | 56px |
| 4xl | 64px |
| 5xl | 80px |

---

## 🔲 Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| sm | 4px | Badges pequeños |
| md | 8px | Inputs, chips |
| lg | 12px | Botones, cards pequeñas |
| xl | 16px | Cards, modales |
| 2xl | 20px | Bottom sheets |
| 3xl | 24px | Modales grandes |
| full | 9999px | Avatares, pills |

---

## 🧩 Componentes

### Botones

**Tamaños:**
- Small: 40px altura
- Medium: 48px altura (default)
- Large: 56px altura (accesibilidad)

**Variantes:**
- Primary: gradient #F97316 → #EA580C
- Secondary: #27272A con border #3F3F46
- Ghost: transparente, texto #F97316
- Danger: gradient #EF4444 → #DC2626

**Border Radius:** 12px (lg)

### Inputs

- Altura: 52px
- Padding: 16px horizontal
- Border Radius: 12px
- Background: #1A1A1A
- Border: 1px #3F3F46
- Focus Border: #F97316

### Cards

- Padding: 16px
- Border Radius: 16px (xl)
- Background: #141414
- Border: 1px #27272A

### Badges

- Padding: 4px 10px
- Border Radius: full
- Font: Caption (12px / 500)

---

## 📐 Layout

| Elemento | Valor |
|----------|-------|
| Screen padding horizontal | 16px |
| Screen padding vertical | 24px |
| Header height | 56px |
| Tab bar height | 80px |
| Tab bar padding bottom | 24px (safe area) |
| Card spacing | 16px |
| Section spacing | 24-32px |
| Min touch target | 48×48px |

---

## ♿ Accesibilidad (Roberto)

- [ ] Texto mínimo 16px (18px preferido)
- [ ] Touch targets 48×48px mínimo
- [ ] Contraste 4.5:1 mínimo
- [ ] No solo color para información
- [ ] Botones grandes (56px) para CTAs
- [ ] Modo claro disponible
- [ ] Labels explícitos, no solo iconos

---

## 🔣 Iconos (Lucide)

### Navigation
- home, file-text, users, user, settings

### Actions
- plus, pencil, trash-2, save, share, upload

### Media
- camera, video, mic, image, play, pause

### Status
- heart-pulse, heart, check, alert-circle

### Security
- lock, shield, key

**Tamaño default:** 24px
**Stroke width:** 2

---

## 📁 Estructura Figma

```
📂 Legado Digital
├── 🎨 Design System
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   ├── Icons
│   └── Components
├── 📐 Wireframes
│   ├── Auth Flow
│   ├── Main Flow
│   └── Guardian Flow
├── 🎨 Mockups (Hi-Fi)
│   ├── Onboarding
│   ├── Dashboard
│   ├── Cartas
│   ├── Guardianes
│   └── Perfil
└── 🔗 Prototype
```

---

## 📱 Frame Sizes

- **iPhone 14 Pro:** 393 × 852
- **iPhone SE:** 375 × 667 (test accesibilidad)
- **Android Medium:** 360 × 800

---

*UNIR 2025 — Enero*
# OpenSpec - MiLegado

Especificaciones estructuradas para el desarrollo de la app MiLegado.

## Uso con Claude Code

Para dar contexto a Claude sobre un módulo específico:
```
lee .openspec/modules/cartas.spec.md y ayúdame a implementar...
```

Para contexto general del proyecto:
```
lee .openspec/project.md
```

---

## Índice de Especificaciones

### Documentos Base

| Archivo | Descripción |
|---------|-------------|
| [project.md](project.md) | Visión general, arquitectura y decisiones técnicas |
| [design-system.md](design-system.md) | Sistema de diseño unificado (colores, tipografía, componentes) |
| [voice-tone.md](voice-tone.md) | Guía de voz, tono y copywriting |
| [personas.md](personas.md) | Proto-personas y perfiles de usuario |

### Especificaciones por Módulo

| Módulo | Archivo | Pantallas |
|--------|---------|-----------|
| Autenticación | [modules/auth.spec.md](modules/auth.spec.md) | Login, Registro, Onboarding, Recuperar contraseña |
| Cartas | [modules/cartas.spec.md](modules/cartas.spec.md) | Lista de cartas, Detalle carta, Editar carta |
| Guardianes | [modules/guardianes.spec.md](modules/guardianes.spec.md) | Lista guardianes, Detalle guardián, Agregar guardián |
| Perfil | [modules/perfil.spec.md](modules/perfil.spec.md) | Perfil usuario, Configuración, El Latido |
| Crear | [modules/crear.spec.md](modules/crear.spec.md) | Selector tipo, Captura media, Editor texto, Preview |

---

## Estructura del Proyecto

```
.openspec/
├── README.md              ← Este archivo
├── project.md             ← Visión general
├── design-system.md       ← Sistema de diseño
├── voice-tone.md          ← Voz y tono
├── personas.md            ← Proto-personas
└── modules/
    ├── auth.spec.md       ← Módulo autenticación
    ├── cartas.spec.md     ← Módulo cartas
    ├── guardianes.spec.md ← Módulo guardianes
    ├── perfil.spec.md     ← Módulo perfil
    └── crear.spec.md      ← Módulo crear carta
```

---

## Convenciones

### Formato de Specs

Cada spec de módulo sigue esta estructura:
1. **Resumen** - Qué hace el módulo
2. **Pantallas** - Lista de pantallas con rutas
3. **Componentes** - Componentes UI utilizados
4. **Tipos** - Interfaces TypeScript relevantes
5. **Servicios** - Llamadas a Firebase/APIs
6. **Estados** - Estados de la UI y manejo de errores
7. **Flujos** - User flows paso a paso

### Nomenclatura

- Rutas: `(tabs)/cartas/[id].tsx`
- Componentes: `PascalCase` (ej: `CartaCard`)
- Hooks: `camelCase` con prefijo `use` (ej: `useCamera`)
- Tipos: `PascalCase` (ej: `CartaDocument`)

---

*Proyecto UNIR 2025 - App de Legado Digital*

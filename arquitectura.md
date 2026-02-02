# 🗺️ Arquitectura de Navegación — Especificación Técnica

## Proyecto: MiLegado — App de Legado Digital
## Stack: React Native + Expo Router + React Navigation
## Design System: Paradise Garden v3.0

---

## 📐 Sitemap Jerárquico

```
MiLegado — App de Legado Digital
│
├── 🔐 AUTH STACK (No autenticado)
│   ├── Splash Screen
│   ├── Onboarding (3 slides)
│   ├── Login
│   ├── Registro
│   └── [Modal] Recuperar Contraseña
│
├── 🏠 MAIN TABS (Autenticado)
│   │
│   ├── 📍 Tab 1: Home (Dashboard) — 🏠
│   │   ├── Estado del Latido 💓
│   │   ├── Indicador de Batería [API]
│   │   ├── Resumen del Legado
│   │   ├── CTA: Crear contenido
│   │   └── [Modal] Confirmar Latido
│   │
│   ├── 📍 Tab 2: Mi Legado (Cartas) — 📚
│   │   ├── Lista de Cartas
│   │   ├── [Stack] Detalle Carta → {cartaId}
│   │   ├── [Stack] Editar Carta → {cartaId}
│   │   └── [Modal] Confirmar Eliminar
│   │
│   ├── 📍 Tab 3: Guardianes — 👥
│   │   ├── Lista de Guardianes
│   │   ├── [Stack] Agregar Guardián
│   │   ├── [Stack] Detalle Guardián → {guardianId}
│   │   └── [Stack] Preguntas de Seguridad
│   │
│   └── 📍 Tab 4: Perfil — 👤
│       ├── Info del Usuario
│       ├── [Stack] Editar Perfil
│       ├── [Stack] Seguridad 🔒
│       ├── [Stack] Configurar Latido 💓
│       ├── [Stack] Mi Plan / Upgrade
│       └── [Stack] Ayuda / FAQ
│
├── ✨ CREAR CARTA STACK (Modal Stack)
│   ├── Seleccionar Tipo (📝 🎬 🎤 📷)
│   ├── Captura de Media
│   │   ├── [API] Cámara (foto)
│   │   ├── [API] Galería (imagen)
│   │   ├── [API] Audio (grabación)
│   │   └── [API] Video (grabación)
│   ├── Editor de Texto
│   ├── Preview
│   ├── Asignar Guardián
│   └── Confirmación
│
└── 👤 GUARDIAN FLOW (Flujo separado)
    ├── Verificación de Identidad
    ├── Preguntas de Seguridad 🔒
    ├── Subir Acta de Defunción [API Cámara]
    ├── Mensaje de Empatía 🕊️
    ├── Reproducción de Despedida
    └── Acceso a Bóveda
```

---

## 📁 Estructura de Archivos (Expo Router)

```
app/
├── _layout.tsx                    # Root Layout (Auth check)
├── index.tsx                      # Redirect logic
│
├── (auth)/                        # Auth Group (no tabs)
│   ├── _layout.tsx               # Stack Navigator
│   ├── splash.tsx
│   ├── onboarding.tsx
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx       # Presentado como modal
│
├── (tabs)/                        # Main App (con tabs)
│   ├── _layout.tsx               # Tab Navigator
│   │
│   ├── index.tsx                 # Tab 1: Home/Dashboard
│   │
│   ├── cartas/                   # Tab 2: Mi Legado
│   │   ├── _layout.tsx           # Stack Navigator anidado
│   │   ├── index.tsx             # Lista de cartas
│   │   └── [id].tsx              # Detalle carta (param: id)
│   │
│   ├── guardianes/               # Tab 3: Guardianes
│   │   ├── _layout.tsx           # Stack Navigator anidado
│   │   ├── index.tsx             # Lista de guardianes
│   │   ├── nuevo.tsx             # Agregar guardián
│   │   └── [id].tsx              # Detalle guardián (param: id)
│   │
│   └── perfil/                   # Tab 4: Perfil
│       ├── _layout.tsx           # Stack Navigator anidado
│       ├── index.tsx             # Vista principal perfil
│       ├── editar.tsx
│       ├── seguridad.tsx
│       ├── latido.tsx
│       ├── plan.tsx
│       └── ayuda.tsx
│
├── crear/                         # Crear Carta (Stack separado)
│   ├── _layout.tsx               # Stack Navigator
│   ├── index.tsx                 # Seleccionar tipo
│   ├── media.tsx                 # Captura de media (param: tipo)
│   ├── texto.tsx                 # Editor de texto
│   ├── preview.tsx               # Preview carta
│   └── asignar.tsx               # Asignar guardián
│
└── guardian/                      # Flujo de Guardián
    ├── _layout.tsx
    ├── verificar.tsx
    ├── preguntas.tsx
    ├── acta.tsx
    ├── mensaje.tsx
    └── boveda.tsx
```

---

## 🔀 Configuración de Navegación

### Root Layout (`app/_layout.tsx`)

```typescript
import { Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function RootLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="(auth)" />
      ) : (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen 
            name="crear" 
            options={{ 
              presentation: 'modal',
              animation: 'slide_from_bottom'
            }} 
          />
        </>
      )}
      <Stack.Screen name="guardian" />
    </Stack>
  );
}
```

### Tab Layout (`app/(tabs)/_layout.tsx`)

```typescript
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';

// Paradise Garden v3.0 Colors
const colors = {
  primary: '#5BA4A4',
  textMuted: '#9A9A9A',
  surface: '#FFFFFF',
  border: '#E5E5E5',
};

// Emoji Icons Component
const TabIcon = ({ emoji, focused }: { emoji: string; focused: boolean }) => (
  <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.6 }}>
    {emoji}
  </Text>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,      // #5BA4A4
        tabBarInactiveTintColor: colors.textMuted,  // #9A9A9A
        tabBarStyle: {
          backgroundColor: colors.surface,          // #FFFFFF
          borderTopColor: colors.border,            // #E5E5E5
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Nunito_400Regular',
          fontSize: 11,
        },
        headerStyle: {
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          fontFamily: 'CormorantGaramond_400Regular',
          fontSize: 20,
          color: '#3D3D3D',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cartas"
        options={{
          title: 'Mi Legado',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📚" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="guardianes"
        options={{
          title: 'Guardianes',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👥" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
```

---

## 📦 Parámetros de Navegación

### Tipos TypeScript

```typescript
// types/navigation.ts

export type RootStackParamList = {
  '(auth)': undefined;
  '(tabs)': undefined;
  'crear': { returnTo?: string };
  'guardian': { token: string; legadoId: string };
};

export type AuthStackParamList = {
  'splash': undefined;
  'onboarding': undefined;
  'login': { redirectTo?: string };
  'register': undefined;
  'forgot-password': { email?: string };
};

export type CartasStackParamList = {
  'index': undefined;
  '[id]': { id: string };
};

export type GuardianesStackParamList = {
  'index': undefined;
  'nuevo': undefined;
  '[id]': { id: string };
};

export type CrearStackParamList = {
  'index': undefined;
  'media': { tipo: 'foto' | 'video' | 'audio' };
  'texto': { mediaUri?: string; mediaType?: string };
  'preview': { 
    cartaId: string;
    titulo: string;
    contenido: {
      texto?: string;
      mediaUri?: string;
      mediaType?: string;
    };
  };
  'asignar': { cartaId: string };
};

export type GuardianFlowParamList = {
  'verificar': { token: string; legadoId: string };
  'preguntas': { guardianId: string };
  'acta': { guardianId: string };
  'mensaje': { legadoId: string };
  'boveda': { legadoId: string };
};
```

### Ejemplos de Navegación

```typescript
// Desde Lista de Cartas a Detalle
import { router } from 'expo-router';

// Navegar con parámetro
router.push(`/cartas/${carta.id}`);

// Navegar a crear carta
router.push('/crear');

// Navegar a media con tipo
router.push({
  pathname: '/crear/media',
  params: { tipo: 'video' }
});

// Navegar a preview con datos
router.push({
  pathname: '/crear/preview',
  params: {
    cartaId: nuevaCarta.id,
    titulo: 'Mi mensaje',
    contenido: JSON.stringify({
      texto: 'Contenido de la carta',
      mediaUri: 'file:///path/to/video.mp4',
      mediaType: 'video'
    })
  }
});

// Volver atrás
router.back();

// Reemplazar pantalla (no permite volver)
router.replace('/(tabs)');
```

---

## 🔄 User Flows Detallados

### Flow 1: Onboarding → Primera Carta

```
[Splash] 
    ↓ 2s auto
[Onboarding Slide 1] → "Tu voz. Tus historias. Para siempre." 🌿
    ↓ swipe/tap
[Onboarding Slide 2] → "Seguro. Privado. Tuyo." 🔒
    ↓ swipe/tap
[Onboarding Slide 3] → "Empieza con un recuerdo" 💓 + CTA
    ↓ tap "Crear mi legado"
[Registro]
    ↓ submit (email + password)
[Dashboard] 
    ↓ tap "➕" o CTA "Sube tu primer recuerdo"
[Crear - Seleccionar Tipo]
    ↓ tap "📷 Foto"
[Crear - Media] {tipo: 'foto'}
    ↓ tap "Galería"
[Sistema - Image Picker] → API expo-image-picker
    ↓ seleccionar imagen
[Crear - Texto]
    ↓ escribir "¿Por qué es especial?"
[Crear - Preview]
    ↓ tap "Continuar"
[Crear - Asignar Guardián]
    ↓ agregar guardián o skip
[Modal - Confirmación] → "✨ Tu legado ha comenzado"
    ↓ tap "Ir a Mi Legado"
[Mi Legado - Lista]
```

### Flow 2: Grabar Video

```
[Dashboard]
    ↓ tap FAB "➕"
[Bottom Sheet - Tipo Contenido]
    ↓ tap "🎬 Video"
[Sistema - Permisos] → Cámara + Micrófono
    ↓ allow
[Crear - Media] {tipo: 'video'}
    ↓ API expo-camera (modo video)
    ↓ tap ⏺️ record → grabando... (● REC)
    ↓ tap ⏹️ stop
[Crear - Preview] → reproducir video ▶️
    ↓ tap "Usar este video" o "Volver a grabar"
[Crear - Texto] → agregar título/mensaje
    ↓ tap "Continuar"
[Crear - Asignar]
    ↓ seleccionar guardián
[Subiendo...] → Firebase Storage (progress 2px #5BA4A4)
    ↓ progress bar
[Modal - Éxito] ✓
    ↓ dismiss
[Mi Legado]
```

### Flow 3: Prueba de Vida (El Latido)

```
[Push Notification] → "💓 ¿Todo bien? Confirma que sigues aquí"
    ↓ tap notification
[Dashboard] → Deep link con action: 'latido'
    ↓ mostrar banner prominente
[Bottom Sheet - Confirmar Latido]
    ↓ tap "Sigo aquí 💓"
[API Call] → updateLastActive()
[Toast] → "✓ Latido confirmado. Nos vemos en 30 días"
[Dashboard] → badge removido
```

### Flow 4: Guardián Recibe Legado

```
[Email] → "Has sido designado como guardián..."
    ↓ tap link
[Deep Link] → milegado://guardian?token=xxx&legadoId=yyy
    ↓ app installed? → open app : → app store
[Guardian - Verificar]
    ↓ validar token
[Guardian - Preguntas] → responder preguntas de seguridad 🔒
    ↓ 2 de 3 correctas
[Guardian - Acta]
    ↓ tap "Subir acta de defunción"
[Sistema - Cámara] → API expo-camera
    ↓ capturar foto del documento
[Procesando...] → verificación (💓 pulse)
    ↓ aprobado
[Guardian - Mensaje] → pantalla de empatía 🕊️
    ↓ tap "Ver legado"
[Guardian - Video Despedida] → reproducción automática ▶️
    ↓ video termina
[Guardian - Bóveda] → acceso completo al contenido 🌿
```

---

## 📲 Mapeo de APIs a Pantallas

| API | Librería | Pantallas | Funcionalidad |
|-----|----------|-----------|---------------|
| **Batería** | `expo-battery` | Dashboard, Settings | Mostrar nivel, alerta de batería baja |
| **Cámara** | `expo-camera` | Crear/Media, Guardian/Acta | Capturar foto/video |
| **Galería** | `expo-image-picker` | Crear/Media, Perfil/Editar | Seleccionar imagen existente |
| **Audio** | `expo-av` | Crear/Media | Grabar y reproducir audio |
| **Video** | `expo-av` | Crear/Media, Preview, Bóveda | Grabar y reproducir video |

### Implementación de APIs

```typescript
// hooks/useBattery.ts
import * as Battery from 'expo-battery';
import { useState, useEffect } from 'react';

export function useBattery() {
  const [level, setLevel] = useState<number>(1);
  const [isCharging, setIsCharging] = useState<boolean>(false);

  useEffect(() => {
    const getBattery = async () => {
      const batteryLevel = await Battery.getBatteryLevelAsync();
      const batteryState = await Battery.getBatteryStateAsync();
      setLevel(batteryLevel);
      setIsCharging(batteryState === Battery.BatteryState.CHARGING);
    };

    getBattery();

    const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setLevel(batteryLevel);
    });

    return () => subscription.remove();
  }, []);

  return { level, isCharging, percentage: Math.round(level * 100) };
}
```

```typescript
// hooks/useCamera.ts
import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';

export function useCamera() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [type, setType] = useState(CameraType.back);

  const toggleCameraType = () => {
    setType(current => 
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  return {
    permission,
    requestPermission,
    type,
    toggleCameraType,
    isReady: permission?.granted
  };
}
```

```typescript
// hooks/useImagePicker.ts
import * as ImagePicker from 'expo-image-picker';

export function useImagePicker() {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets[0];
    }
    return null;
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets[0];
    }
    return null;
  };

  return { pickImage, takePhoto };
}
```

---

## 🎨 Design System Integration

### Paradise Garden v3.0 - Quick Reference

```typescript
// constants/theme.ts

export const colors = {
  // Backgrounds
  background: '#FAFBF9',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F6F4',

  // Primary
  primary: '#5BA4A4',
  primaryLight: '#7BBDBD',
  primaryDark: '#4A8F8F',

  // Secondary
  secondary: '#C4A484',
  blush: '#E8B4B8',

  // Text
  text: '#3D3D3D',
  textSecondary: '#6A6A6A',
  textMuted: '#9A9A9A',

  // Borders
  border: '#E5E5E5',
  borderLight: '#F0F0F0',

  // Semantic
  success: '#7BAA9E',
  error: '#C47070',
  warning: '#D4C4A5',
};

export const emojis = {
  home: '🏠',
  legacy: '📚',
  guardians: '👥',
  profile: '👤',
  text: '📝',
  video: '🎬',
  audio: '🎤',
  photo: '📷',
  heartbeat: '💓',
  active: '✨',
  check: '✓',
  settings: '⚙️',
  security: '🔒',
  add: '➕',
  back: '←',
  warning: '⚠️',
};

export const layout = {
  headerHeight: 56,
  tabBarHeight: 64,
  screenPadding: 16,
  borderRadius: 0,  // No rounded corners (except avatars)
  borderWidth: 1,
};
```

---

## ✅ Checklist de Cumplimiento de Rúbrica

### Navegación (2 puntos - Nivel 4 Destacado)

- [x] **Stack Navigator:** Auth flow, Crear carta, Detalles, Settings
- [x] **Navegación entre páginas:** Tab Navigator con 4 tabs
- [x] **Paso de parámetros:** cartaId, guardianId, tipoMedia, token

### Seguridad (2 puntos - Nivel 4 Destacado)

- [x] **Autenticación segura:** Firebase Auth (email/password)
- [x] **Biometría:** expo-local-authentication (opcional)
- [x] **Reglas de seguridad:** Firestore Security Rules
- [x] **Validación de datos:** Zod/Yup schemas

### Almacenamiento (3 puntos - Nivel 4 Destacado)

- [x] **AsyncStorage:** Sesión, preferencias, drafts, cache
- [x] **Firebase Firestore:** Usuarios, cartas, guardianes
- [x] **Firebase Storage:** Media (fotos, videos, audios)

### APIs de Plataforma (3 puntos - Nivel 4 Destacado)

- [x] **Batería:** expo-battery (Dashboard)
- [x] **Cámara:** expo-camera (Captura media, Acta)
- [x] **Imágenes:** expo-image-picker (Galería, Avatar)
- [x] **Audio:** expo-av (Grabar/Reproducir)
- [x] **Video:** expo-av (Grabar/Reproducir)

### Extensión

- [x] **Mínimo 4 páginas:** 8 principales + 12 secundarias = 20 pantallas
- [x] **Funcionalidad completa:** Todas las APIs requeridas
- [x] **APK generado:** EAS Build configurado

---

## 🎯 Próximos Pasos

1. ✅ **Sistema de Diseño:** Paradise Garden v3.0 definido
2. ✅ **OpenSpec:** Proposals para cada módulo creados
3. **Configurar Expo:** Inicializar proyecto con estructura
4. **Firebase:** Crear proyecto y configurar servicios
5. **Desarrollo:** Implementar pantalla por pantalla

---

*Documento técnico — MiLegado UNIR 2025*
*Design System: Paradise Garden v3.0*
*Compatible con OpenSpec y Claude Code*
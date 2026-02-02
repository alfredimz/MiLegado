# Módulo: Autenticación

## Resumen

Módulo de autenticación que maneja el registro, inicio de sesión y onboarding de usuarios. Utiliza Firebase Auth con email/password.

---

## Pantallas

| Pantalla | Ruta | Descripción |
|----------|------|-------------|
| Onboarding | `(auth)/onboarding` | 3 slides introductorios para nuevos usuarios |
| Login | `(auth)/login` | Inicio de sesión con email/password |
| Register | `(auth)/register` | Registro de nueva cuenta |

---

## Estructura de Archivos

```
app/(auth)/
├── _layout.tsx      # Stack Navigator para auth
├── onboarding.tsx   # Slides de bienvenida
├── login.tsx        # Pantalla de login
└── register.tsx     # Pantalla de registro
```

---

## Pantalla: Onboarding

### Descripción
3 slides horizontales con información introductoria. El usuario puede deslizar o tocar para avanzar.

### UI

```
┌─────────────────────────────────────┐
│                                     │  BG: #FAFBF9
│                                     │
│              🌿                     │  Emoji grande
│                                     │
│     Tu voz. Tus historias.          │  Cormorant 32px #3D3D3D
│         Para siempre.               │
│                                     │
│     Crea cartas, videos y           │  Nunito 16px #6A6A6A
│     mensajes que llegarán           │
│     a tus seres queridos...         │
│                                     │
│          ━━━  ━━  ━━                │  Steps: #5BA4A4 / #E5E5E5
│                                     │
│  ┌───────────────────────────────┐  │
│  │       Crear mi legado         │  │  Primary outline button
│  └───────────────────────────────┘  │  Border: 1px #5BA4A4
│                                     │
│         Tengo cuenta                │  Text link #5BA4A4
│                                     │
└─────────────────────────────────────┘
```

### Slides Content

**Slide 1:**
- Emoji: 🌿
- Título: "Tu voz. Tus historias. Para siempre."
- Subtítulo: "Crea cartas, videos y mensajes que llegarán a tus seres queridos en el momento perfecto."

**Slide 2:**
- Emoji: 🔒
- Título: "Seguro. Privado. Tuyo."
- Subtítulo: "Todo lo que guardes está protegido. Solo tú decides quién lo recibe y cuándo."

**Slide 3:**
- Emoji: 💓
- Título: "Empieza con un recuerdo"
- Subtítulo: "No necesitas hacer todo hoy. Una foto, una carta, a tu ritmo."

### Acciones
- **Swipe/Tap:** Avanza al siguiente slide
- **"Crear mi legado":** Navega a Register
- **"Tengo cuenta":** Navega a Login

### Lógica
- Mostrar solo la primera vez (guardar flag en AsyncStorage)
- Si usuario ya vio onboarding, redirigir a Login

---

## Pantalla: Login

### Descripción
Formulario de inicio de sesión con email y contraseña.

### UI

```
┌─────────────────────────────────────┐
│  ←                                  │  Header 56px, border-bottom 1px #E5E5E5
├─────────────────────────────────────┤
│                                     │  BG: #FAFBF9
│              🌿                     │
│           MiLegado                  │  Cormorant 32px #3D3D3D
│                                     │
│     Bienvenido de vuelta            │  Nunito 18px #6A6A6A
│                                     │
│  Email                              │  Label: Nunito 14px #6A6A6A
│  ┌───────────────────────────────┐  │
│  │ tu@email.com                  │  │  Input 44px, border 1px #E5E5E5
│  └───────────────────────────────┘  │  radius: 0px
│                                     │
│  Contraseña                         │
│  ┌───────────────────────────────┐  │
│  │ ••••••••                   👁  │  │  Focus border: #5BA4A4
│  └───────────────────────────────┘  │
│                                     │
│      ¿Olvidaste tu contraseña?      │  Text link #5BA4A4
│                                     │
│  ┌───────────────────────────────┐  │
│  │           Entrar              │  │  Primary button outline
│  └───────────────────────────────┘  │  Border: 1px #5BA4A4
│                                     │
│       ¿No tienes cuenta?            │  Nunito 14px #6A6A6A
│         Crear cuenta                │  Text link #5BA4A4
│                                     │
└─────────────────────────────────────┘
```

### Campos

| Campo | Tipo | Validación |
|-------|------|------------|
| Email | `email` | Required, email format |
| Password | `password` | Required, min 6 chars |

### Estados

| Estado | UI |
|--------|-----|
| `idle` | Formulario vacío |
| `loading` | Botón con 💓 pulse |
| `error` | Toast top con ⚠️ |
| `success` | Redirect a (tabs) |

### Errores Comunes

| Código Firebase | Mensaje Usuario |
|-----------------|-----------------|
| `auth/user-not-found` | "No encontramos una cuenta con ese email" |
| `auth/wrong-password` | "Contraseña incorrecta" |
| `auth/invalid-email` | "Email no válido" |
| `auth/too-many-requests` | "Demasiados intentos. Intenta más tarde" |

### Acciones
- **"Entrar":** Llama `signInWithEmailAndPassword`
- **"¿Olvidaste tu contraseña?":** Modal de recuperación
- **"Crear cuenta":** Navega a Register

---

## Pantalla: Register

### Descripción
Formulario de registro de nueva cuenta.

### UI

```
┌─────────────────────────────────────┐
│  ←      Crear cuenta                │  Header centrado, Cormorant 20px
├─────────────────────────────────────┤
│                                     │  BG: #FAFBF9
│  Nombre                             │
│  ┌───────────────────────────────┐  │
│  │ Tu nombre                     │  │  Input 44px
│  └───────────────────────────────┘  │  Border: 1px #E5E5E5
│                                     │
│  Email                              │
│  ┌───────────────────────────────┐  │
│  │ tu@email.com                  │  │
│  └───────────────────────────────┘  │
│                                     │
│  Contraseña                         │
│  ┌───────────────────────────────┐  │
│  │ ••••••••                   👁  │  │
│  └───────────────────────────────┘  │
│                                     │
│  Confirmar contraseña               │
│  ┌───────────────────────────────┐  │
│  │ ••••••••                   👁  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌─┐ Acepto términos y              │  Checkbox square
│  └─┘ condiciones                    │  Border: 1px #5BA4A4
│                                     │
│  ┌───────────────────────────────┐  │
│  │       Crear mi legado         │  │  Primary button
│  └───────────────────────────────┘  │
│                                     │
│        ¿Ya tienes cuenta?           │
│          Iniciar sesión             │  Link #5BA4A4
│                                     │
└─────────────────────────────────────┘
```

### Campos

| Campo | Tipo | Validación |
|-------|------|------------|
| Nombre | `text` | Required, min 2 chars |
| Email | `email` | Required, email format |
| Password | `password` | Required, min 6 chars |
| Confirm Password | `password` | Required, must match |
| Terms | `checkbox` | Required |

### Validación Zod

```typescript
const registerSchema = z.object({
  nombre: z.string().min(2, 'Nombre muy corto'),
  email: z.string().email('Email no válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar los términos' })
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});
```

### Flujo de Registro

1. Usuario completa formulario
2. Validación con Zod
3. `createUserWithEmailAndPassword(email, password)`
4. `updateProfile({ displayName: nombre })`
5. Crear documento en Firestore `users/{uid}`
6. Redirect a Dashboard

### Documento Usuario Inicial

```typescript
{
  id: uid,
  email: email,
  displayName: nombre,
  photoURL: null,
  createdAt: serverTimestamp(),
  lastLatido: serverTimestamp(),
  latidoInterval: 30,
  settings: {
    notifications: true,
    language: 'es',
  }
}
```

---

## Servicios

### auth.ts

```typescript
export const login = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const register = async (email: string, password: string, nombre: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: nombre });
  await createUserDocument(userCredential.user.uid, { email, displayName: nombre });
  return userCredential;
};

export const logout = async () => {
  return signOut(auth);
};

export const resetPassword = async (email: string) => {
  return sendPasswordResetEmail(auth, email);
};
```

---

## Context: AuthContext

```typescript
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nombre: string) => Promise<void>;
  logout: () => Promise<void>;
}
```

---

## Componentes UI (Paradise Garden v3.0)

| Componente | Especificación |
|------------|----------------|
| `Input` | Height 44px, border 1px #E5E5E5, radius 0 |
| `Button` | Outline, border 1px #5BA4A4, radius 0 |
| `Checkbox` | Square, border 1px #5BA4A4 |
| `Toast` | Top position, border 1px, emoji + mensaje |

---

## Flujo de Navegación

```
[App Start]
    │
    ▼
[Check Auth State]
    │
    ├── Authenticated ──► (tabs)/index
    │
    └── Not Authenticated
            │
            ▼
    [Check Onboarding Flag]
            │
            ├── First Time ──► (auth)/onboarding
            │
            └── Returning ──► (auth)/login
```

---

## Testing Checklist

- [ ] Login con credenciales válidas
- [ ] Login con email incorrecto
- [ ] Login con password incorrecto
- [ ] Registro exitoso
- [ ] Registro con email ya existente
- [ ] Validación de campos vacíos
- [ ] Validación de formato email
- [ ] Validación de contraseñas que no coinciden
- [ ] Onboarding se muestra solo la primera vez
- [ ] Navegación entre pantallas
- [ ] Toast de error con emoji ⚠️
- [ ] Loading state con 💓 pulse

---

*Auth Module Spec v3.0 - MiLegado Paradise Garden*
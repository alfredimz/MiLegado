// Validadores con Zod para MiLegado
import { z } from 'zod';

// Esquema de usuario
export const userSchema = z.object({
  displayName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(50, 'La contraseña no puede exceder 50 caracteres'),
});

// Esquema de registro
export const registerSchema = userSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Esquema de login
export const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// Esquema de carta
export const cartaSchema = z.object({
  titulo: z
    .string()
    .min(1, 'El título es requerido')
    .max(100, 'El título no puede exceder 100 caracteres'),
  tipo: z.enum(['texto', 'audio', 'video', 'mixta']),
  contenido: z.object({
    texto: z.string().max(5000, 'El texto no puede exceder 5000 caracteres').optional(),
    audioUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
    imageUrls: z.array(z.string().url()).max(5, 'Máximo 5 imágenes').optional(),
  }),
  guardianes: z.array(z.string()).optional(),
});

// Esquema de guardián
export const guardianSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  telefono: z
    .string()
    .regex(/^(\+?52)?[0-9]{10}$/, 'Teléfono inválido')
    .optional()
    .or(z.literal('')),
  relacion: z.enum([
    'esposo/a',
    'hijo/a',
    'padre/madre',
    'hermano/a',
    'abuelo/a',
    'nieto/a',
    'tío/a',
    'sobrino/a',
    'primo/a',
    'amigo/a',
    'otro',
  ]),
  notas: z.string().max(500, 'Las notas no pueden exceder 500 caracteres').optional(),
});

// Tipos derivados de Zod
export type UserInput = z.infer<typeof userSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CartaInput = z.infer<typeof cartaSchema>;
export type GuardianInput = z.infer<typeof guardianSchema>;

// Función helper para validar
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  for (const error of result.error.issues) {
    const path = error.path.join('.');
    errors[path] = error.message;
  }

  return { success: false, errors };
}

export default {
  userSchema,
  registerSchema,
  loginSchema,
  cartaSchema,
  guardianSchema,
  validate,
};

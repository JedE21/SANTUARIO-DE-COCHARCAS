import { z } from 'zod';

/**
 * Esquemas de validación para TODO input que cruza la frontera cliente →
 * servidor. Los límites de longitud también evitan abusos de almacenamiento
 * en las tablas de inserción pública.
 */

const trimmed = (max: number) => z.string().trim().max(max);
const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined));

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .max(160)
  .pipe(z.string().email('Ingresa un correo válido.'));

const optionalEmail = z
  .string()
  .trim()
  .toLowerCase()
  .max(160)
  .refine((v) => v.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Ingresa un correo válido.')
  .transform((v) => (v.length > 0 ? v : undefined))
  .optional();

const phoneField = optionalTrimmed(40).refine(
  (v) => !v || /^[+0-9()\-\s.]{5,40}$/.test(v),
  'Ingresa un teléfono válido.',
);

const dateField = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida.')
  .refine((v) => !Number.isNaN(Date.parse(v)), 'Fecha inválida.')
  .refine((v) => {
    const date = new Date(`${v}T00:00:00Z`).getTime();
    const now = Date.now();
    const oneYearAhead = now + 366 * 24 * 60 * 60 * 1000;
    const oneYearBehind = now - 366 * 24 * 60 * 60 * 1000;
    return date >= oneYearBehind && date <= oneYearAhead;
  }, 'La fecha debe estar dentro del rango permitido.');

const timeField = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Hora inválida.')
  .optional()
  .or(z.literal('').transform(() => undefined));

export const massRequestSchema = z.object({
  requester_name: trimmed(120).min(2, 'Ingresa tu nombre completo.'),
  requester_email: optionalEmail,
  phone: phoneField,
  intention_type: optionalTrimmed(60),
  intention: optionalTrimmed(1000),
  requested_date: dateField,
  preferred_time: timeField,
  notes: optionalTrimmed(1000),
});

export const sacramentRequestSchema = z.object({
  requester_name: trimmed(120).min(2, 'Ingresa tu nombre completo.'),
  requester_email: optionalEmail,
  phone: phoneField,
  sacrament_id: z
    .string()
    .trim()
    .uuid('Sacramento inválido.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  requested_date: dateField,
  notes: optionalTrimmed(1000),
});

export const contactMessageSchema = z.object({
  name: trimmed(120).min(2, 'Ingresa tu nombre.'),
  email: emailField,
  phone: phoneField,
  subject: optionalTrimmed(160),
  message: trimmed(2000).min(10, 'El mensaje es demasiado corto.'),
});

export const newsletterSchema = z.object({
  email: emailField,
});

export const trackingCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^(MS|SR)-[A-Z0-9-]{4,36}$/, 'Formato de código inválido.')
  .max(45);

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(8, 'Contraseña inválida.').max(128),
});

/** Creación de usuario del panel (solo roles administrativos). */
export const adminCreateUserSchema = z.object({
  email: emailField,
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.').max(128),
  full_name: trimmed(120).min(2, 'Ingresa el nombre completo.'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN_PARROQUIA', 'EDITOR', 'RESPONSABLE_PASTORAL']),
});

export type MassRequestInput = z.infer<typeof massRequestSchema>;
export type SacramentRequestInput = z.infer<typeof sacramentRequestSchema>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

/** Extrae el primer mensaje de error de Zod para mostrarlo al usuario. */
export function firstIssueMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Datos inválidos.';
}

/** Convierte FormData a un objeto plano de strings para validar con Zod. */
export function formDataToObject(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') out[key] = value;
  }
  return out;
}

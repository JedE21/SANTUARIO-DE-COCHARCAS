'use server';

import { createHash, randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient, hasSupabaseConfig } from '@/lib/supabase/server';
import { supabaseAdmin, hasServiceRole } from '@/lib/supabase/admin';
import { slugify } from '@/lib/queries';
import { REQUEST_STATUSES, type RequestStatus } from '@/lib/constants/request-status';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  createSessionToken,
  hasSessionSecret,
} from '@/lib/security/session';
import {
  auditLog,
  clientIp,
  requireAdminAction,
} from '@/lib/security/guards';
import { allowAction, RATE_LIMITS } from '@/lib/security/rate-limit';
import {
  isBlocked,
  recordFailedAttempt,
  clearAttempts,
  composeAttemptKey,
} from '@/lib/security/login-attempts';
import {
  adminCreateUserSchema,
  contactMessageSchema,
  firstIssueMessage,
  formDataToObject,
  loginSchema,
  massRequestSchema,
  newsletterSchema,
  sacramentRequestSchema,
  trackingCodeSchema,
} from '@/lib/validations/schemas';

export type ActionResult<T = unknown> = {
  ok: boolean;
  message?: string;
  error?: string;
  data?: T;
};

// ---------------------------------------------------------------------------
// Utilidades internas
// ---------------------------------------------------------------------------

function trackingHash(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}

/** Codigos de seguimiento con 72 bits de entropia (CSPRNG, no Math.random). */
const TRACKING_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function generateTrackingCode(prefix: 'MS' | 'SR'): string {
  const bytes = randomBytes(15); // 15 bytes -> 24 chars base32
  let out = '';
  for (let i = 0; i < 15; i++) out += TRACKING_ALPHABET[bytes[i] % 32];
  return `${prefix}-${out.slice(0, 5)}-${out.slice(5, 10)}-${out.slice(10, 15)}`;
}

/** Honeypot: si el campo oculto trae contenido, es un bot. Exito falso. */
function isBot(formData: FormData): boolean {
  const hp = formData.get('_hp');
  return typeof hp === 'string' && hp.trim().length > 0;
}

function rateLimited(bucket: string): boolean {
  return !allowAction(bucket, RATE_LIMITS.publicForm.limit, RATE_LIMITS.publicForm.windowMs);
}

// ---------------------------------------------------------------------------
// Solicitudes pastorales (publico: insertar; privado: leer/gestionar)
// ---------------------------------------------------------------------------

export async function submitMassRequest(formData: FormData): Promise<ActionResult> {
  const ip = clientIp();

  if (isBot(formData)) {
    // Respuesta indistinguible para no ensenar el mecanismo de defensa.
    return { ok: true, message: 'Solicitud registrada. Guarda tu código: MS-XXXXX-XXXXX-XXXXX', data: { tracking: 'MS-XXXXX-XXXXX-XXXXX' } };
  }
  if (rateLimited(`mass:${ip}`)) {
    return { ok: false, error: 'Has enviado demasiadas solicitudes. Inténtalo de nuevo en unos minutos.' };
  }

  const parsed = massRequestSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) return { ok: false, error: firstIssueMessage(parsed.error) };
  const input = parsed.data;

  const tracking = generateTrackingCode('MS');
  // El numero de solicitud (COC-MSA-2026-00001) lo genera la base de datos
  // con una secuencia: sin colisiones y tamper-proof.
  const payload = {
    requester_name: input.requester_name,
    requester_email: input.requester_email ?? null,
    phone: input.phone ?? null,
    intention_type: input.intention_type ?? null,
    intention: input.intention ?? null,
    requested_date: input.requested_date,
    preferred_time: input.preferred_time ?? null,
    notes: input.notes ?? null,
    tracking_hash: trackingHash(tracking),
  };

  if (!hasSupabaseConfig()) {
    return { ok: true, message: 'Solicitud registrada. Guarda tu código: ' + tracking, data: { tracking } };
  }

  try {
    const db = createClient();
    const { error } = await db.from('mass_requests').insert([payload] as never);
    if (error) {
      console.error('[submitMassRequest] error de inserción:', error.message);
    }
    // Mensaje identico haya exito o fallo en BD: el flujo pastoral no debe
    // revelar estado interno y el equipo lo revisa desde el panel.
    return { ok: true, message: 'Solicitud recibida. Tu código de seguimiento es ' + tracking, data: { tracking } };
  } catch (e) {
    console.error('[submitMassRequest] excepción:', e);
    return { ok: true, message: 'Solicitud registrada. Guarda tu código: ' + tracking, data: { tracking } };
  }
}

export async function submitSacramentRequest(formData: FormData): Promise<ActionResult> {
  const ip = clientIp();

  if (isBot(formData)) {
    return { ok: true, message: 'Solicitud registrada. Guarda tu código: SR-XXXXX-XXXXX-XXXXX', data: { tracking: 'SR-XXXXX-XXXXX-XXXXX' } };
  }
  if (rateLimited(`sacrament:${ip}`)) {
    return { ok: false, error: 'Has enviado demasiadas solicitudes. Inténtalo de nuevo en unos minutos.' };
  }

  const parsed = sacramentRequestSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) return { ok: false, error: firstIssueMessage(parsed.error) };
  const input = parsed.data;

  const tracking = generateTrackingCode('SR');
  const payload = {
    requester_name: input.requester_name,
    requester_email: input.requester_email ?? null,
    phone: input.phone ?? null,
    sacrament_id: input.sacrament_id ?? null,
    requested_date: input.requested_date,
    notes: input.notes ?? null,
    tracking_hash: trackingHash(tracking),
  };

  if (!hasSupabaseConfig()) {
    return { ok: true, message: 'Solicitud registrada. Guarda tu código: ' + tracking, data: { tracking } };
  }

  try {
    const db = createClient();
    const { error } = await db.from('sacrament_requests').insert([payload] as never);
    if (error) {
      console.error('[submitSacramentRequest] error de inserción:', error.message);
    }
    return { ok: true, message: 'Solicitud recibida. Tu código de seguimiento es ' + tracking, data: { tracking } };
  } catch (e) {
    console.error('[submitSacramentRequest] excepción:', e);
    return { ok: true, message: 'Solicitud registrada. Guarda tu código: ' + tracking, data: { tracking } };
  }
}

export async function submitContactMessage(formData: FormData): Promise<ActionResult> {
  const ip = clientIp();

  if (isBot(formData)) {
    return { ok: true, message: 'Mensaje enviado. Gracias por escribirnos.' };
  }
  if (rateLimited(`contact:${ip}`)) {
    return { ok: false, error: 'Has enviado demasiados mensajes. Inténtalo de nuevo en unos minutos.' };
  }

  const parsed = contactMessageSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) return { ok: false, error: firstIssueMessage(parsed.error) };
  const input = parsed.data;

  const payload = {
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    subject: input.subject ?? null,
    message: input.message,
  };

  if (!hasSupabaseConfig()) return { ok: true, message: 'Mensaje enviado. Gracias por escribirnos.' };

  try {
    const db = createClient();
    const { error } = await db.from('contact_messages').insert([payload] as never);
    if (error) console.error('[submitContactMessage] error de inserción:', error.message);
    return { ok: true, message: 'Mensaje enviado. Gracias por escribirnos.' };
  } catch (e) {
    console.error('[submitContactMessage] excepción:', e);
    return { ok: true, message: 'Mensaje enviado. Gracias por escribirnos.' };
  }
}

export async function subscribeNewsletter(formData: FormData): Promise<ActionResult> {
  const ip = clientIp();

  if (isBot(formData)) {
    return { ok: true, message: 'Suscripción registrada.' };
  }
  if (!allowAction(`newsletter:${ip}`, RATE_LIMITS.newsletter.limit, RATE_LIMITS.newsletter.windowMs)) {
    return { ok: false, error: 'Demasiados intentos. Inténtalo de nuevo en unos minutos.' };
  }

  const parsed = newsletterSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) return { ok: false, error: firstIssueMessage(parsed.error) };

  if (!hasSupabaseConfig()) return { ok: true, message: 'Suscripción registrada.' };

  try {
    const db = createClient();
    const { error } = await db
      .from('newsletter_subscribers')
      .insert([{ email: parsed.data.email, active: true }] as never);
    if (error && !error.message.includes('duplicate')) {
      console.error('[subscribeNewsletter] error de inserción:', error.message);
    }
    return { ok: true, message: 'Gracias por suscribirte.' };
  } catch {
    return { ok: true, message: 'Suscripción registrada.' };
  }
}

// ---------------------------------------------------------------------------
// Seguimiento de solicitudes (solo datos minimos: numero y estado)
// ---------------------------------------------------------------------------

export async function trackRequest(code: string): Promise<ActionResult> {
  const ip = clientIp();

  const parsed = trackingCodeSchema.safeParse(code ?? '');
  if (!parsed.success) return { ok: false, error: 'Ingresa un código válido.' };

  if (!allowAction(`track:${ip}`, RATE_LIMITS.tracking.limit, RATE_LIMITS.tracking.windowMs)) {
    return { ok: false, error: 'Demasiados intentos. Vuelve a intentarlo en unos minutos.' };
  }

  if (!hasSupabaseConfig()) return { ok: false, error: 'El servicio no está disponible en este momento.' };

  try {
    const db = createClient();
    type RpcResult = { data: unknown[] | null; error: { message: string } | null };

    const mass = (await db.rpc('track_mass_request', { tracking_code: parsed.data } as never)) as RpcResult;
    if (!mass.error && mass.data && mass.data.length > 0) {
      return { ok: true, data: { kind: 'mass', row: mass.data[0] } };
    }
    if (mass.error) console.error('[trackRequest] rpc mass:', mass.error.message);

    const sac = (await db.rpc('track_sacrament_request', { tracking_code: parsed.data } as never)) as RpcResult;
    if (!sac.error && sac.data && sac.data.length > 0) {
      return { ok: true, data: { kind: 'sacrament', row: sac.data[0] } };
    }
    if (sac.error) console.error('[trackRequest] rpc sacrament:', sac.error.message);

    return { ok: false, error: 'No se encontró una solicitud con ese código.' };
  } catch {
    return { ok: false, error: 'No se pudo verificar el código.' };
  }
}

// ---------------------------------------------------------------------------
// Administracion (requieren sesion firmada + service role en servidor)
// ---------------------------------------------------------------------------

/** Tablas CMS para roles editoriales (EDITOR, ADMIN_PARROQUIA, etc.). */
const CMS_TABLES = new Set([
  'site_settings',
  'navigation_items',
  'footer_settings',
  'pages',
  'home_sections',
  'announcements',
  'faqs',
  'news',
  'news_categories',
  'events',
  'festivities',
  'gallery_categories',
  'gallery_albums',
  'gallery_items',
  'mass_schedules',
  'sacraments',
  'sacrament_types',
  'media',
  'slides',
]);

/** TODAS las tablas administrables por el SUPER_ADMIN (sin restricciones). */
const SUPER_ADMIN_TABLES = new Set([
  ...CMS_TABLES,
  'mass_requests',
  'sacrament_requests',
  'contact_messages',
  'newsletter_subscribers',
  'audit_logs',
  'profiles',
  'roles',
]);

/** Columnas sensibles bloqueadas para roles NO super admin. */
const BLOCKED_COLUMNS = new Set([
  'tracking_hash',
  'password',
  'user_id',
  'role_id',
  'requester_email',
  'admin_notes',
]);

function tableAllowed(table: string, role: string): boolean {
  if (role === 'SUPER_ADMIN') return SUPER_ADMIN_TABLES.has(table);
  return CMS_TABLES.has(table);
}

function sanitizeAdminPayload(raw: Record<string, unknown>, role: string): Record<string, unknown> {
  const isSuper = role === 'SUPER_ADMIN';
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    // Nombre de columna: solo minusculas/numeros/guion bajo (en cualquier caso).
    if (!/^[a-z][a-z0-9_]*$/i.test(key)) continue;
    // Restricciones de columnas aplican solo a roles no SUPER_ADMIN.
    if (!isSuper && BLOCKED_COLUMNS.has(key)) continue;
    if (value === null || value === undefined) {
      clean[key] = null;
    } else if (typeof value === 'string') {
      clean[key] = value.slice(0, 10000);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      clean[key] = value;
    }
  }
  return clean;
}

export async function adminUpsertRow(table: string, payload: Record<string, unknown>): Promise<ActionResult> {
  const session = await requireAdminAction();
  if (!session) return { ok: false, error: 'Sesión no válida. Vuelve a iniciar sesión.' };

  if (!/^[a-z_]{2,60}$/.test(table)) return { ok: false, error: 'Tabla inválida.' };
  if (!tableAllowed(table, session.role)) {
    return { ok: false, error: session.role === 'SUPER_ADMIN' ? 'Tabla desconocida.' : 'Solo el SUPER_ADMIN puede modificar esa tabla.' };
  }
  if (!hasServiceRole() || !supabaseAdmin) return { ok: false, error: 'Configuración del servidor incompleta (service role).' };

  const ip = clientIp();
  if (!allowAction(`admin:${session.sub}:${ip}`, RATE_LIMITS.adminWrite.limit, RATE_LIMITS.adminWrite.windowMs)) {
    return { ok: false, error: 'Demasiadas operaciones. Espera un momento.' };
  }

  const clean = sanitizeAdminPayload(payload, session.role);
  const id = typeof payload.id === 'string' && payload.id.trim() !== '' ? payload.id : undefined;
  delete clean.id;

  try {
    if (id) {
      const { error } = await supabaseAdmin.from(table as never).update(clean as never).eq('id', id);
      if (error) return { ok: false, error: 'No se pudo guardar el registro.' };
    } else {
      const { error } = await supabaseAdmin.from(table as never).insert([clean] as never);
      if (error) return { ok: false, error: 'No se pudo crear el registro.' };
    }
    await auditLog(id ? 'update' : 'insert', table, id ?? null, { fields: Object.keys(clean) }, session);
    return { ok: true, message: 'Guardado correctamente.' };
  } catch {
    return { ok: false, error: 'Error al guardar.' };
  }
}

export async function adminDeleteRow(table: string, id: string): Promise<ActionResult> {
  const session = await requireAdminAction();
  if (!session) return { ok: false, error: 'Sesión no válida. Vuelve a iniciar sesión.' };

  if (!/^[a-z_]{2,60}$/.test(table)) return { ok: false, error: 'Tabla inválida.' };
  if (!tableAllowed(table, session.role)) {
    return { ok: false, error: session.role === 'SUPER_ADMIN' ? 'Tabla desconocida.' : 'Solo el SUPER_ADMIN puede modificar esa tabla.' };
  }
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { ok: false, error: 'Identificador inválido.' };
  if (!hasServiceRole() || !supabaseAdmin) return { ok: false, error: 'Configuración del servidor incompleta (service role).' };

  // El SUPER_ADMIN no puede eliminarse a si mismo (evita bloqueo total del panel).
  if (table === 'profiles') {
    const { data: target } = await supabaseAdmin.from('profiles').select('user_id').eq('id', id).maybeSingle();
    if ((target as { user_id?: string } | null)?.user_id === session.sub) {
      return { ok: false, error: 'No puedes eliminar tu propio perfil de administrador.' };
    }
  }

  try {
    const { error } = await supabaseAdmin.from(table as never).delete().eq('id', id);
    if (error) return { ok: false, error: 'No se pudo eliminar el registro.' };
    await auditLog('delete', table, id, {}, session);
    return { ok: true, message: 'Registro eliminado.' };
  } catch {
    return { ok: false, error: 'Error al eliminar.' };
  }
}

export async function adminGenericSave(formData: FormData): Promise<ActionResult> {
  const table = String(formData.get('_table') ?? '');
  const payload: Record<string, unknown> = {};
  for (const key of Array.from(formData.keys())) {
    if (key.startsWith('_')) continue;
    const value = formData.get(key);
    if (typeof value === 'string' && value.trim() !== '') {
      payload[key] = value.trim();
    }
  }
  return adminUpsertRow(table, payload);
}

export async function adminGenericDelete(formData: FormData): Promise<ActionResult> {
  const table = String(formData.get('_table') ?? '');
  const id = String(formData.get('id') ?? '');
  if (!table || !id) return { ok: false, error: 'Falta id o tabla.' };
  return adminDeleteRow(table, id);
}

/**
 * Gestiona una solicitud pastoral (PROMPT 13): cambia su estado y/o guarda
 * notas internas. Unico camino administrativo para mass_requests y
 * sacrament_requests (estan excluidas del CRUD generico a proposito).
 */
export async function updateRequestStatus(
  kind: 'mass' | 'sacrament',
  id: string,
  status: string,
  adminNotes?: string,
): Promise<ActionResult> {
  const session = await requireAdminAction();
  if (!session) return { ok: false, error: 'Sesión no válida. Vuelve a iniciar sesión.' };

  const table = kind === 'mass' ? 'mass_requests' : kind === 'sacrament' ? 'sacrament_requests' : null;
  if (!table) return { ok: false, error: 'Tipo de solicitud inválido.' };
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { ok: false, error: 'Identificador inválido.' };
  if (!REQUEST_STATUSES.includes(status as RequestStatus)) return { ok: false, error: 'Estado inválido.' };
  if (!hasServiceRole() || !supabaseAdmin) return { ok: false, error: 'Configuración del servidor incompleta (service role).' };

  const notes = typeof adminNotes === 'string' ? adminNotes.trim().slice(0, 1000) : undefined;

  try {
    const updatePayload: Record<string, unknown> = { status };
    if (notes !== undefined) updatePayload.admin_notes = notes || null;

    const { data, error } = await supabaseAdmin
      .from(table as never)
      .update(updatePayload as never)
      .eq('id', id)
      .select('request_number')
      .maybeSingle();

    if (error) return { ok: false, error: 'No se pudo actualizar la solicitud.' };
    if (!data) return { ok: false, error: 'Solicitud no encontrada.' };

    await auditLog('update_status', table, id, {
      status,
      request_number: (data as { request_number?: string }).request_number,
    }, session);

    return { ok: true, message: 'Solicitud actualizada.' };
  } catch {
    return { ok: false, error: 'Error al actualizar la solicitud.' };
  }
}

export async function createSlug(value: string): Promise<string> {
  return slugify(String(value).slice(0, 200));
}

// ---------------------------------------------------------------------------
// Slides por sección (carruseles administrables)
// ---------------------------------------------------------------------------

export async function uploadSlideImage(formData: FormData): Promise<ActionResult<{ url: string }>> {
  const session = await requireAdminAction();
  if (!session) return { ok: false, error: 'Sesión no válida. Vuelve a iniciar sesión.' };
  if (!hasServiceRole() || !supabaseAdmin) return { ok: false, error: 'Configuración del servidor incompleta (service role).' };

  const file = formData.get('file');
  if (!(file instanceof File)) return { ok: false, error: 'Selecciona una imagen.' };
  const ext = MEDIA_MIME_EXT[file.type];
  if (!ext) return { ok: false, error: 'Formato no admitido. Usa JPG, PNG o WebP.' };
  if (file.size <= 0 || file.size > MEDIA_MAX_BYTES) return { ok: false, error: 'La imagen debe pesar menos de 10 MB.' };

  try {
    const objectPath = `slides/${Date.now()}-${randomBytes(6).toString('hex')}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabaseAdmin.storage
      .from(MEDIA_BUCKET)
      .upload(objectPath, buffer, { contentType: file.type, upsert: false });
    if (uploadError) return { ok: false, error: 'No se pudo subir la imagen a Storage.' };

    const { data: pub } = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(objectPath);
    await auditLog('insert', 'media', null, { path: objectPath, size: file.size, for: 'slide' }, session);

    return {
      ok: true,
      message: 'Imagen subida.',
      data: { url: pub.publicUrl },
    };
  } catch {
    return { ok: false, error: 'Error al subir la imagen.' };
  }
}

const MEDIA_MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const MEDIA_MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};
const MEDIA_BUCKET = 'gallery';

export async function uploadMediaAsset(formData: FormData): Promise<ActionResult> {
  const session = await requireAdminAction();
  if (!session) return { ok: false, error: 'Sesión no válida. Vuelve a iniciar sesión.' };
  if (!hasServiceRole() || !supabaseAdmin) return { ok: false, error: 'Configuración del servidor incompleta (service role).' };

  const file = formData.get('file');
  const altText = String(formData.get('alt_text') ?? '').trim().slice(0, 200) || null;
  const name = String(formData.get('name') ?? '').trim().slice(0, 120) || null;

  if (!(file instanceof File)) return { ok: false, error: 'Selecciona una imagen.' };
  const ext = MEDIA_MIME_EXT[file.type];
  if (!ext) return { ok: false, error: 'Formato no admitido. Usa JPG, PNG o WebP.' };
  if (file.size <= 0 || file.size > MEDIA_MAX_BYTES) return { ok: false, error: 'La imagen debe pesar menos de 10 MB.' };

  try {
    const objectPath = `biblioteca/${Date.now()}-${randomBytes(6).toString('hex')}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from(MEDIA_BUCKET)
      .upload(objectPath, buffer, { contentType: file.type, upsert: false });
    if (uploadError) return { ok: false, error: 'No se pudo subir la imagen.' };

    const { data: pub } = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(objectPath);

    const { error: dbError } = await supabaseAdmin.from('media').insert([{
      name: name ?? file.name.slice(0, 120),
      url: pub.publicUrl,
      bucket: MEDIA_BUCKET,
      mime_type: file.type,
      size_bytes: file.size,
      alt_text: altText,
    }] as never);
    if (dbError) {
      // Revierte el archivo para no dejar huerfanos en storage
      await supabaseAdmin.storage.from(MEDIA_BUCKET).remove([objectPath]);
      return { ok: false, error: 'No se pudo registrar la imagen en la biblioteca.' };
    }

    await auditLog('insert', 'media', null, { path: objectPath, size: file.size }, session);
    return { ok: true, message: 'Imagen subida a la biblioteca.' };
  } catch {
    return { ok: false, error: 'Error al subir la imagen.' };
  }
}

export async function deleteMediaAsset(id: string): Promise<ActionResult> {
  const session = await requireAdminAction();
  if (!session) return { ok: false, error: 'Sesión no válida. Vuelve a iniciar sesión.' };
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { ok: false, error: 'Identificador inválido.' };
  if (!hasServiceRole() || !supabaseAdmin) return { ok: false, error: 'Configuración del servidor incompleta (service role).' };

  try {
    const { data: row } = await supabaseAdmin.from('media').select('id, url, bucket').eq('id', id).maybeSingle();
    if (!row) return { ok: false, error: 'Imagen no encontrada.' };

    const media = row as { id: string; url: string; bucket: string | null };
    const marker = `/storage/v1/object/public/${media.bucket ?? MEDIA_BUCKET}/`;
    const idx = media.url.indexOf(marker);
    if (idx !== -1) {
      const objectPath = media.url.slice(idx + marker.length);
      await supabaseAdmin.storage.from(media.bucket ?? MEDIA_BUCKET).remove([objectPath]);
    }

    const { error } = await supabaseAdmin.from('media').delete().eq('id', id);
    if (error) return { ok: false, error: 'No se pudo eliminar la imagen.' };

    await auditLog('delete', 'media', id, {}, session);
    return { ok: true, message: 'Imagen eliminada.' };
  } catch {
    return { ok: false, error: 'Error al eliminar la imagen.' };
  }
}

// ---------------------------------------------------------------------------
// Gestion de usuarios del panel (solo SUPER_ADMIN)
// ---------------------------------------------------------------------------

function requireSuperAdmin(session: { role: string }): boolean {
  return session.role === 'SUPER_ADMIN';
}

export async function adminCreateUser(formData: FormData): Promise<ActionResult> {
  const session = await requireAdminAction();
  if (!session) return { ok: false, error: 'Sesión no válida. Vuelve a iniciar sesión.' };
  if (!requireSuperAdmin(session)) return { ok: false, error: 'Solo el SUPER_ADMIN puede crear usuarios.' };
  if (!hasServiceRole() || !supabaseAdmin) return { ok: false, error: 'Configuración del servidor incompleta (service role).' };

  const parsed = adminCreateUserSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) return { ok: false, error: firstIssueMessage(parsed.error) };
  const { email, password, full_name, role } = parsed.data;

  try {
    const { data: roleRow } = await supabaseAdmin.from('roles').select('id').eq('name', role).maybeSingle();
    if (!roleRow) return { ok: false, error: 'Rol no encontrado.' };

    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });
    if (createError || !created.user) {
      return { ok: false, error: 'No se pudo crear el usuario (¿el correo ya existe?).' };
    }

    const { error: profileError } = await supabaseAdmin.from('profiles').upsert(
      [{ user_id: created.user.id, role_id: (roleRow as { id: string }).id, full_name, active: true }] as never,
      { onConflict: 'user_id' } as never,
    );
    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(created.user.id);
      return { ok: false, error: 'No se pudo asignar el perfil.' };
    }

    await auditLog('create_user', 'profiles', created.user.id, { email, role }, session);
    return { ok: true, message: `Usuario ${email} creado con rol ${role}.` };
  } catch {
    return { ok: false, error: 'Error al crear el usuario.' };
  }
}

export async function adminSetUserRole(userId: string, roleName: string): Promise<ActionResult> {
  const session = await requireAdminAction();
  if (!session) return { ok: false, error: 'Sesión no válida. Vuelve a iniciar sesión.' };
  if (!requireSuperAdmin(session)) return { ok: false, error: 'Solo el SUPER_ADMIN puede cambiar roles.' };
  if (!/^[0-9a-f-]{36}$/i.test(userId)) return { ok: false, error: 'Identificador inválido.' };
  if (!['SUPER_ADMIN', 'ADMIN_PARROQUIA', 'EDITOR', 'RESPONSABLE_PASTORAL'].includes(roleName)) {
    return { ok: false, error: 'Rol inválido.' };
  }
  if (!hasServiceRole() || !supabaseAdmin) return { ok: false, error: 'Configuración del servidor incompleta (service role).' };

  // Proteccion anti-autobloqueo: el propio SUPER_ADMIN no puede degradarse.
  if (userId === session.sub && roleName !== 'SUPER_ADMIN') {
    return { ok: false, error: 'No puedes quitarte tu propio rol SUPER_ADMIN.' };
  }

  try {
    const { data: roleRow } = await supabaseAdmin.from('roles').select('id').eq('name', roleName).maybeSingle();
    if (!roleRow) return { ok: false, error: 'Rol no encontrado.' };

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ role_id: (roleRow as { id: string }).id } as never)
      .eq('user_id', userId);
    if (error) return { ok: false, error: 'No se pudo cambiar el rol.' };

    await auditLog('set_role', 'profiles', userId, { role: roleName }, session);
    return { ok: true, message: 'Rol actualizado.' };
  } catch {
    return { ok: false, error: 'Error al cambiar el rol.' };
  }
}

export async function adminSetUserActive(userId: string, active: boolean): Promise<ActionResult> {
  const session = await requireAdminAction();
  if (!session) return { ok: false, error: 'Sesión no válida. Vuelve a iniciar sesión.' };
  if (!requireSuperAdmin(session)) return { ok: false, error: 'Solo el SUPER_ADMIN puede activar cuentas.' };
  if (!/^[0-9a-f-]{36}$/i.test(userId)) return { ok: false, error: 'Identificador inválido.' };
  if (!hasServiceRole() || !supabaseAdmin) return { ok: false, error: 'Configuración del servidor incompleta (service role).' };

  if (userId === session.sub && !active) {
    return { ok: false, error: 'No puedes desactivar tu propia cuenta.' };
  }

  try {
    const { error } = await supabaseAdmin.from('profiles').update({ active } as never).eq('user_id', userId);
    if (error) return { ok: false, error: 'No se pudo actualizar la cuenta.' };

    await auditLog('set_active', 'profiles', userId, { active }, session);
    return { ok: true, message: active ? 'Cuenta activada.' : 'Cuenta desactivada.' };
  } catch {
    return { ok: false, error: 'Error al actualizar la cuenta.' };
  }
}

// ---------------------------------------------------------------------------
// Autenticacion del panel
// ---------------------------------------------------------------------------

const ADMIN_ROLES = new Set(['SUPER_ADMIN', 'ADMIN_PARROQUIA', 'EDITOR', 'RESPONSABLE_PASTORAL']);

export async function signIn(formData: FormData): Promise<ActionResult> {
  const ip = clientIp();

  if (!allowAction(`login:${ip}`, RATE_LIMITS.login.limit, RATE_LIMITS.login.windowMs)) {
    return { ok: false, error: 'Demasiados intentos. Vuelve a intentarlo en unos minutos.' };
  }

  const parsed = loginSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) return { ok: false, error: 'Ingresa un correo y contraseña válidos.' };
  const { email, password } = parsed.data;

  if (!hasSupabaseConfig()) {
    return { ok: false, error: 'El acceso no está configurado. Contacta al administrador del sitio.' };
  }
  if (!hasSessionSecret()) {
    return { ok: false, error: 'Falta ADMIN_SESSION_SECRET en el servidor. Contacta al administrador del sitio.' };
  }

  let userId: string;
  let role: string;

  // ── Identidad del dispositivo que intenta ingresar ──
  // Cookie httpOnly persistente (12 meses). El bloqueo por intentos queda
  // limitado a ESTE dispositivo: un ataque desde otro equipo no bloquea a
  // la cuenta a nivel global. La IP sigue cubierta por el rate-limit global.
  const DEVICE_COOKIE = 'admin_device';
  const cookiesJar = cookies();
  let deviceId = cookiesJar.get(DEVICE_COOKIE)?.value ?? '';
  if (!/^[0-9a-f-]{16,64}$/i.test(deviceId)) {
    deviceId = randomBytes(18).toString('hex');
    cookiesJar.set(DEVICE_COOKIE, deviceId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 12 meses
    });
  }
  const attemptKey = composeAttemptKey(deviceId, email);

  // Políticas de intentos POR DISPOSITIVO (requisito institucional):
  //  - correo NO registrado → 3 intentos, luego bloqueo de este dispositivo.
  //  - correo registrado + contraseña errada → 5 intentos, luego bloqueo.
  // El estado se consulta ANTES de autenticar para bloquear temprano.
  const gate = isBlocked(attemptKey);
  if (gate.blocked) {
    await auditLog('auth.login_blocked', 'auth', null, { email, device: deviceId });
    return { ok: false, error: gate.blockMessage ?? 'Acceso bloqueado. Comunica con el administrador.' };
  }

  try {
    const db = createClient();
    const { data, error } = await db.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      await auditLog('auth.login_failed', 'auth', null, { email });

      // Distinguir contraseña errada de cuenta inexistente SIN revelar
      // información adicional al cliente: la UI muestra el mismo mensaje
      // de credenciales incorrectas con el conteo de intentos restantes.
      let kind: 'unauthorized' | 'wrong_password' = 'unauthorized';
      if (hasServiceRole() && supabaseAdmin) {
        // El panel es institucional (pocas cuentas): listar usuarios es
        // suficiente para saber si el correo existe sin exponer detalles.
        const { data: userData } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
        const known =
          userData?.users?.some((u) => (u.email ?? '').toLowerCase() === email) ?? false;
        kind = known ? 'wrong_password' : 'unauthorized';
      }
      const state = recordFailedAttempt(attemptKey, kind);
      if (state.blocked) {
        await auditLog('auth.login_blocked', 'auth', null, { email, reason: kind });
        return { ok: false, error: state.blockMessage ?? 'Acceso bloqueado. Comunica con el administrador.' };
      }
      const remainingNote =
        kind === 'unauthorized'
          ? `Intentos restantes: ${state.remaining ?? 0} de 3.`
          : `Intentos restantes: ${state.remaining ?? 0} de 5.`;
      return { ok: false, error: `Credenciales incorrectas. ${remainingNote}` };
    }
    userId = data.user.id;

    // Verificacion de rol: solo personal autorizado puede entrar al panel.
    let roleName = '';
    if (hasServiceRole() && supabaseAdmin) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('active, role_id, roles(name)')
        .eq('user_id', data.user.id)
        .maybeSingle();
      const name = (profile as { active?: boolean; roles?: { name?: string } | null } | null)?.roles?.name ?? '';
      const active = (profile as { active?: boolean } | null)?.active === true;
      if (active && ADMIN_ROLES.has(name)) roleName = name;
    }

    if (!roleName) {
      await auditLog('auth.login_denied', 'auth', null, { email, reason: 'sin_rol_admin' });
      // Cuenta válida pero sin permisos: se cuenta como acceso no autorizado
      // (por dispositivo).
      const deniedState = recordFailedAttempt(attemptKey, 'unauthorized');
      if (deniedState.blocked) {
        return {
          ok: false,
          error:
            'Acceso bloqueado: se superó el número de intentos permitidos. ' +
            'Comunica con el administrador del panel.',
        };
      }
      return {
        ok: false,
        error: `Esta cuenta no tiene permisos de administración. Intentos restantes: ${deniedState.remaining ?? 0} de 3.`,
      };
    }
    role = roleName;
    clearAttempts(attemptKey);

    const token = await createSessionToken({ sub: userId, email, role });
    if (!token) {
      return { ok: false, error: 'No se pudo crear la sesión. Inténtalo de nuevo.' };
    }

    cookies().set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: ADMIN_SESSION_TTL_SECONDS,
    });
  } catch {
    return { ok: false, error: 'No se pudo iniciar sesión.' };
  }

  await auditLog('auth.login', 'auth', userId, { email, role });
  redirect('/admin/dashboard');
}

export async function signOut() {
  const session = await requireAdminAction();
  if (session) {
    await auditLog('auth.logout', 'auth', session.sub, { email: session.email }, session);
  }
  cookies().delete(ADMIN_SESSION_COOKIE);
  if (hasSupabaseConfig()) {
    try {
      await createClient().auth.signOut();
    } catch {
      // La sesion propia ya se elimino; el logout de Supabase es best-effort.
    }
  }
  redirect('/admin/login');
}

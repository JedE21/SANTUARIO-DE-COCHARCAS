import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ADMIN_SESSION_COOKIE,
  verifySessionToken,
  type AdminSessionPayload,
} from '@/lib/security/session';
import { supabaseAdmin, hasServiceRole } from '@/lib/supabase/admin';

/**
 * Lee y verifica la sesión administrativa desde la cookie firmada.
 * Devuelve null si la cookie no existe, está adulterada o expiró.
 */
export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/**
 * Guard para páginas/layouts del panel. Redirige al login si no hay sesión.
 */
export async function requireAdminPage(): Promise<AdminSessionPayload> {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  return session;
}

/**
 * Guard para server actions administrativas. No redirige: devuelve null y el
 * caller debe responder con un error genérico (la UI del panel lo maneja).
 */
export async function requireAdminAction(): Promise<AdminSessionPayload | null> {
  return getAdminSession();
}

/** IP del cliente (mejor esfuerzo detrás de proxy/Vercel/Netlify). */
export function clientIp(): string {
  const header = headers();
  const forwarded = header.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return header.get('x-real-ip')?.trim() || 'unknown';
}

/**
 * Registro de auditoría "best effort": nunca debe romper la acción principal.
 * Solo escribe cuando hay service role disponible (servidor).
 */
export async function auditLog(
  action: string,
  entityType: string,
  entityId?: string | null,
  metadata: Record<string, unknown> = {},
  session?: AdminSessionPayload | null,
): Promise<void> {
  if (!hasServiceRole() || !supabaseAdmin) return;
  try {
    await supabaseAdmin.from('audit_logs').insert([
      {
        user_id: null,
        action,
        entity_type: entityType,
        entity_id: entityId ?? null,
        metadata: {
          ...metadata,
          actor: session?.email ?? 'anonymous',
          role: session?.role ?? null,
        },
      },
    ] as never);
  } catch {
    // Auditoría silenciosa: el fallo del log no debe interrumpir el servicio.
  }
}

/**
 * Consultas del PANEL ADMINISTRATIVO (solo servidor).
 *
 * SEPARADO de queries.ts a proposito: ese modulo tambien lo consumen
 * componentes cliente y no puede tocar next/headers ni la service role key.
 *
 * Reglas:
 *  - Datos privados (solicitudes, conteos) => SOLO con sesion firmada
 *    valida + service role. Sin sesion: no se devuelve nada.
 *  - Listados de contenido CMS => con sesion admin usa service role (incluye
 *    borradores); sin ella, cae al cliente anonimo (RLS limita a publico).
 */
import { createClient, hasSupabaseConfig } from '@/lib/supabase/server';
import { supabaseAdmin, hasServiceRole } from '@/lib/supabase/admin';
import { getAdminSession } from '@/lib/security/guards';
import {
  fallbackAnnouncements,
  fallbackEvents,
  fallbackFaqs,
  fallbackFestivities,
  fallbackGalleryAlbums,
  fallbackGalleryItems,
  fallbackHomeSections,
  fallbackMassSchedules,
  fallbackNavigation,
  fallbackNews,
  fallbackPages,
  fallbackSacraments,
} from '@/lib/seed-data';
import type {
  Announcement,
  EventItem,
  Faq,
  Festivity,
  GalleryAlbum,
  GalleryItem,
  HomeSection,
  MassRequest,
  MassSchedule,
  NavigationItem,
  NewsItem,
  Page,
  Sacrament,
  SacramentRequest,
} from '@/types/database';

type AdminDb = NonNullable<typeof supabaseAdmin>;

async function getAdminDb(): Promise<AdminDb | null> {
  if (!hasServiceRole() || !supabaseAdmin) return null;
  const session = await getAdminSession();
  return session ? supabaseAdmin : null;
}

async function withClientFallback<T>(fallback: T, run: (db: AdminDb) => Promise<T>): Promise<T> {
  if (!hasSupabaseConfig()) return fallback;
  try {
    const db = createClient() as unknown as AdminDb;
    return await run(db);
  } catch {
    return fallback;
  }
}

async function withAdminFirst<T>(fallback: T, run: (db: AdminDb) => Promise<T>): Promise<T> {
  const adminDb = await getAdminDb();
  if (adminDb) {
    try {
      return await run(adminDb);
    } catch {
      return fallback;
    }
  }
  return withClientFallback(fallback, run);
}

// ---------------------------------------------------------------------------
// Contenido CMS (con sesion admin incluye borradores)
// ---------------------------------------------------------------------------

export async function getAllNewsAdmin(): Promise<NewsItem[]> {
  return withAdminFirst(fallbackNews, async (db) => {
    const { data, error } = await db.from('news').select('*').order('created_at', { ascending: false });
    if (error || !data) return fallbackNews;
    return data as unknown as NewsItem[];
  });
}

export async function getAllEventsAdmin(): Promise<EventItem[]> {
  return withAdminFirst(fallbackEvents, async (db) => {
    const { data, error } = await db.from('events').select('*').order('start_date', { ascending: false });
    if (error || !data) return fallbackEvents;
    return data as unknown as EventItem[];
  });
}

export async function getAllFestivitiesAdmin(): Promise<Festivity[]> {
  return withAdminFirst(fallbackFestivities, async (db) => {
    const { data, error } = await db.from('festivities').select('*').order('start_date', { ascending: false });
    if (error || !data) return fallbackFestivities;
    return data as unknown as Festivity[];
  });
}

export async function getAllAnnouncementsAdmin(): Promise<Announcement[]> {
  return withAdminFirst(fallbackAnnouncements, async (db) => {
    const { data, error } = await db.from('announcements').select('*').order('created_at', { ascending: false });
    if (error || !data) return fallbackAnnouncements;
    return data as unknown as Announcement[];
  });
}

export async function getAllFaqsAdmin(): Promise<Faq[]> {
  return withAdminFirst(fallbackFaqs, async (db) => {
    const { data, error } = await db.from('faqs').select('*').order('position', { ascending: true });
    if (error || !data) return fallbackFaqs;
    return data as unknown as Faq[];
  });
}

export async function getAllPagesAdmin(): Promise<Page[]> {
  return withAdminFirst(fallbackPages, async (db) => {
    const { data, error } = await db.from('pages').select('*').order('title');
    if (error || !data) return fallbackPages;
    return data as unknown as Page[];
  });
}

export async function getAllHomeSectionsAdmin(): Promise<HomeSection[]> {
  return withAdminFirst(fallbackHomeSections, async (db) => {
    const { data, error } = await db.from('home_sections').select('*').order('position', { ascending: true });
    if (error || !data) return fallbackHomeSections;
    return data as unknown as HomeSection[];
  });
}

export async function getAllNavigationAdmin(): Promise<NavigationItem[]> {
  return withAdminFirst(fallbackNavigation, async (db) => {
    const { data, error } = await db.from('navigation_items').select('*').order('position', { ascending: true });
    if (error || !data) return fallbackNavigation;
    return data as unknown as NavigationItem[];
  });
}

/** Todos los sacramentos (incluye no disponibles) para configurarlos. */
export async function getAllSacramentsAdmin(): Promise<Sacrament[]> {
  return withAdminFirst(fallbackSacraments, async (db) => {
    const { data, error } = await db.from('sacraments').select('*').order('position', { ascending: true });
    if (error || !data) return fallbackSacraments;
    return data as unknown as Sacrament[];
  });
}

/** Todos los horarios de misa (incluye desactivados) para administrarlos. */
export async function getAllMassSchedulesAdmin(): Promise<MassSchedule[]> {
  return withAdminFirst(fallbackMassSchedules, async (db) => {
    const { data, error } = await db.from('mass_schedules').select('*').order('time', { ascending: true });
    if (error || !data) return fallbackMassSchedules;
    return data as unknown as MassSchedule[];
  });
}

/** Todos los albumes de galeria (incluye inactivos). */
export async function getAllGalleryAlbumsAdmin(): Promise<GalleryAlbum[]> {
  return withAdminFirst(fallbackGalleryAlbums, async (db) => {
    const { data, error } = await db.from('gallery_albums').select('*').order('position', { ascending: true });
    if (error || !data) return fallbackGalleryAlbums;
    return data as unknown as GalleryAlbum[];
  });
}

/** Todas las imagenes de galeria (incluye ocultas). */
export async function getAllGalleryItemsAdmin(): Promise<GalleryItem[]> {
  return withAdminFirst(fallbackGalleryItems, async (db) => {
    const { data, error } = await db.from('gallery_items').select('*').order('position', { ascending: true });
    if (error || !data) return fallbackGalleryItems;
    return data as unknown as GalleryItem[];
  });
}

// ---------------------------------------------------------------------------
// Datos privados (PII): jamas se devuelven sin sesion administrativa valida
// ---------------------------------------------------------------------------

export async function getAllMassRequestsAdmin(): Promise<MassRequest[]> {
  const db = await getAdminDb();
  if (!db) return [];
  try {
    const { data, error } = await db.from('mass_requests').select('*').order('created_at', { ascending: false });
    if (error || !data) return [];
    return data as unknown as MassRequest[];
  } catch {
    return [];
  }
}

export async function getAllSacramentRequestsAdmin(): Promise<SacramentRequest[]> {
  const db = await getAdminDb();
  if (!db) return [];
  try {
    const { data, error } = await db.from('sacrament_requests').select('*').order('created_at', { ascending: false });
    if (error || !data) return [];
    return data as unknown as SacramentRequest[];
  } catch {
    return [];
  }
}

export async function getPendingRequestsCount(): Promise<number> {
  const db = await getAdminDb();
  if (!db) return 0;
  try {
    const [mass, sacrament] = await Promise.all([
      db.from('mass_requests').select('id', { count: 'exact', head: true }).in('status', ['pending', 'reviewing']),
      db.from('sacrament_requests').select('id', { count: 'exact', head: true }).in('status', ['pending', 'reviewing']),
    ]);
    return (mass.count ?? 0) + (sacrament.count ?? 0);
  } catch {
    return 0;
  }
}

/** Ultimas solicitudes pendientes para el dashboard. */
export async function getRecentPendingRequests(limit = 5): Promise<UnifiedPendingRequest[]> {
  const db = await getAdminDb();
  if (!db) return [];
  try {
    const [mass, sac] = await Promise.all([
      db.from('mass_requests').select('id, request_number, requester_name, requested_date, status, created_at').in('status', ['pending', 'reviewing']).order('created_at', { ascending: false }).limit(limit),
      db.from('sacrament_requests').select('id, request_number, requester_name, requested_date, status, created_at').in('status', ['pending', 'reviewing']).order('created_at', { ascending: false }).limit(limit),
    ]);
    const massRows = ((mass.data ?? []) as unknown as Record<string, unknown>[]).map(
      (r) => ({ ...r, kind: 'mass' as const }),
    ) as unknown as UnifiedPendingRequest[];
    const sacRows = ((sac.data ?? []) as unknown as Record<string, unknown>[]).map(
      (r) => ({ ...r, kind: 'sacrament' as const }),
    ) as unknown as UnifiedPendingRequest[];
    return [...massRows, ...sacRows]
      .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
      .slice(0, limit);
  } catch {
    return [];
  }
}

export interface UnifiedPendingRequest {
  id: string;
  kind: 'mass' | 'sacrament';
  request_number: string | null;
  requester_name: string;
  requested_date: string;
  status: string;
  created_at: string | null;
}

// ---------------------------------------------------------------------------
// Auditoria (PROMPT 14)
// ---------------------------------------------------------------------------

export interface AuditLogRow {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
}

export async function getAuditLogsAdmin(limit = 100): Promise<AuditLogRow[]> {
  // Auditoria: datos sensibles del sistema; solo con sesion admin valida.
  const db = await getAdminDb();
  if (!db) return [];
  try {
    const { data, error } = await db.from('audit_logs').select('id, action, entity_type, entity_id, metadata, created_at').order('created_at', { ascending: false }).limit(limit);
    if (error || !data) return [];
    return data as unknown as AuditLogRow[];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Biblioteca multimedia
// ---------------------------------------------------------------------------

export interface MediaRow {
  id: string;
  name: string;
  url: string;
  bucket: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  alt_text: string | null;
  created_at: string | null;
}

export async function getAllMediaAdmin(): Promise<MediaRow[]> {
  const db = await getAdminDb();
  if (!db) return [];
  try {
    const { data, error } = await db.from('media').select('*').order('created_at', { ascending: false });
    if (error || !data) return [];
    return data as unknown as MediaRow[];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Usuarios del panel (solo lectura listada; la gestion esta en actions)
// ---------------------------------------------------------------------------

export interface AdminUserRow {
  user_id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  active: boolean;
  created_at: string | null;
}

export async function getUsersAdmin(): Promise<AdminUserRow[]> {
  // Datos de cuentas: solo con sesion administrativa valida.
  const db = await getAdminDb();
  if (!db || !supabaseAdmin) return [];
  try {
    const [profiles, authUsers] = await Promise.all([
      db.from('profiles').select('user_id, full_name, active, created_at, roles(name)'),
      supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 }),
    ]);
    if (profiles.error || !profiles.data) return [];
    const emailById = new Map<string, string>(
      (authUsers.data?.users ?? []).map((u) => [u.id, u.email ?? '—'] as [string, string]),
    );
    return (profiles.data as unknown as Array<{ user_id: string; full_name: string | null; active: boolean; created_at: string | null; roles: { name: string } | null }>)
      .map((p) => ({
        user_id: p.user_id,
        email: emailById.get(p.user_id) ?? '—',
        full_name: p.full_name,
        role: p.roles?.name ?? null,
        active: p.active,
        created_at: p.created_at,
      }))
      .sort((a, b) => a.email.localeCompare(b.email));
  } catch {
    return [];
  }
}

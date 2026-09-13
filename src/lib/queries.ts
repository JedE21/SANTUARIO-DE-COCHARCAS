import { createClient, hasSupabaseConfig } from '@/lib/supabase/server';
import {
  fallbackAnnouncements,
  fallbackEvents,
  fallbackFaqs,
  fallbackFestivities,
  fallbackFooterSettings,
  fallbackGalleryAlbums,
  fallbackGalleryCategories,
  fallbackGalleryItems,
  fallbackHomeSections,
  fallbackMassSchedules,
  fallbackNavigation,
  fallbackNews,
  fallbackNewsCategories,
  fallbackPages,
  fallbackSacraments,
  fallbackSacramentTypes,
  fallbackSiteSettings,
  fallbackSlides,
} from '@/lib/seed-data';
import type {
  Announcement,
  EventItem,
  Faq,
  Festivity,
  FooterSettings,
  GalleryAlbum,
  GalleryCategory,
  GalleryItem,
  HomeSection,
  MassSchedule,
  NavigationItem,
  NewsCategory,
  NewsItem,
  Page,
  Sacrament,
  SacramentType,
  SiteSettings,
  Slide,
} from '@/types/database';

async function withClientFallback<T>(fallback: T, run: (db: ReturnType<typeof createClient>) => Promise<T>): Promise<T> {
  if (!hasSupabaseConfig()) return fallback;
  try {
    const db = createClient();
    return await run(db);
  } catch {
    return fallback;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return withClientFallback(fallbackSiteSettings, async (db) => {
    const { data, error } = await db.from('site_settings').select('*').limit(1).maybeSingle();
    if (error || !data) return fallbackSiteSettings;
    return { ...fallbackSiteSettings, ...(data as SiteSettings) };
  });
}

export async function getNavigationItems(): Promise<NavigationItem[]> {
  return withClientFallback(fallbackNavigation, async (db) => {
    const { data, error } = await db.from('navigation_items').select('*').eq('visible', true).order('position', { ascending: true });
    if (error || !data || data.length === 0) return fallbackNavigation;
    return data as unknown as NavigationItem[];
  });
}

export async function getFooterSettings(): Promise<FooterSettings> {
  return withClientFallback(fallbackFooterSettings, async (db) => {
    const { data, error } = await db.from('footer_settings').select('*').limit(1).maybeSingle();
    if (error || !data) return fallbackFooterSettings;
    return { ...fallbackFooterSettings, ...(data as FooterSettings) };
  });
}

export async function getPublishedPages(): Promise<Page[]> {
  return withClientFallback(fallbackPages, async (db) => {
    const { data, error } = await db.from('pages').select('*').eq('status', 'published').order('title');
    if (error || !data || data.length === 0) return fallbackPages;
    return data as unknown as Page[];
  });
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  return withClientFallback(fallbackPages.find((p) => p.slug === slug) ?? null, async (db) => {
    const { data, error } = await db.from('pages').select('*').eq('slug', slug).maybeSingle();
    if (error || !data) return fallbackPages.find((p) => p.slug === slug) ?? null;
    return data as unknown as Page;
  });
}

export async function getHomeSections(): Promise<HomeSection[]> {
  return withClientFallback(fallbackHomeSections, async (db) => {
    const { data, error } = await db.from('home_sections').select('*').eq('visible', true).order('position', { ascending: true });
    if (error || !data || data.length === 0) return fallbackHomeSections;
    return data as unknown as HomeSection[];
  });
}

export async function getAnnouncements(): Promise<Announcement[]> {
  return withClientFallback(fallbackAnnouncements, async (db) => {
    const { data, error } = await db.from('announcements').select('*').eq('status', 'published').order('published_at', { ascending: false });
    if (error || !data || data.length === 0) return fallbackAnnouncements;
    return data as unknown as Announcement[];
  });
}

export async function getFaqs(): Promise<Faq[]> {
  return withClientFallback(fallbackFaqs, async (db) => {
    const { data, error } = await db.from('faqs').select('*').eq('active', true).order('position', { ascending: true });
    if (error || !data || data.length === 0) return fallbackFaqs;
    return data as unknown as Faq[];
  });
}

export async function getNewsList(limit = 30): Promise<NewsItem[]> {
  return withClientFallback(fallbackNews, async (db) => {
    const { data, error } = await db.from('news').select('*').eq('status', 'published').order('published_at', { ascending: false }).limit(limit);
    if (error || !data || data.length === 0) return fallbackNews;
    return data as unknown as NewsItem[];
  });
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  return withClientFallback(fallbackNews.find((n) => n.slug === slug) ?? null, async (db) => {
    const { data, error } = await db.from('news').select('*').eq('slug', slug).maybeSingle();
    if (error || !data) return fallbackNews.find((n) => n.slug === slug) ?? null;
    return data as unknown as NewsItem;
  });
}

export async function getNewsCategories(): Promise<NewsCategory[]> {
  return withClientFallback(fallbackNewsCategories, async (db) => {
    const { data, error } = await db.from('news_categories').select('*').eq('active', true).order('position', { ascending: true });
    if (error || !data || data.length === 0) return fallbackNewsCategories;
    return data as unknown as NewsCategory[];
  });
}

export async function getEventsList(): Promise<EventItem[]> {
  return withClientFallback(fallbackEvents, async (db) => {
    const { data, error } = await db.from('events').select('*').eq('status', 'published').order('start_date', { ascending: true });
    if (error || !data || data.length === 0) return fallbackEvents;
    return data as unknown as EventItem[];
  });
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  return withClientFallback(fallbackEvents.find((e) => e.slug === slug) ?? null, async (db) => {
    const { data, error } = await db.from('events').select('*').eq('slug', slug).maybeSingle();
    if (error || !data) return fallbackEvents.find((e) => e.slug === slug) ?? null;
    return data as unknown as EventItem;
  });
}

export async function getFestivitiesList(): Promise<Festivity[]> {
  return withClientFallback(fallbackFestivities, async (db) => {
    const { data, error } = await db.from('festivities').select('*').eq('status', 'published').order('start_date', { ascending: true });
    if (error || !data || data.length === 0) return fallbackFestivities;
    return data as unknown as Festivity[];
  });
}

export async function getFestivityBySlug(slug: string): Promise<Festivity | null> {
  return withClientFallback(fallbackFestivities.find((f) => f.slug === slug) ?? null, async (db) => {
    const { data, error } = await db.from('festivities').select('*').eq('slug', slug).maybeSingle();
    if (error || !data) return fallbackFestivities.find((f) => f.slug === slug) ?? null;
    return data as unknown as Festivity;
  });
}

export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  return withClientFallback(fallbackGalleryCategories, async (db) => {
    const { data, error } = await db.from('gallery_categories').select('*').eq('active', true).order('position', { ascending: true });
    if (error || !data || data.length === 0) return fallbackGalleryCategories;
    return data as unknown as GalleryCategory[];
  });
}

export async function getGalleryAlbums(categorySlug?: string): Promise<GalleryAlbum[]> {
  return withClientFallback(fallbackGalleryAlbums, async (db) => {
    const { data, error } = await db.from('gallery_albums').select('*').eq('active', true).order('position', { ascending: true });
    if (error || !data || data.length === 0) return categorySlug ? fallbackGalleryAlbums : fallbackGalleryAlbums;
    return data as unknown as GalleryAlbum[];
  });
}

export async function getGalleryAlbumBySlug(slug: string): Promise<GalleryAlbum | null> {
  return withClientFallback(fallbackGalleryAlbums.find((a) => a.slug === slug) ?? null, async (db) => {
    const { data, error } = await db.from('gallery_albums').select('*').eq('slug', slug).maybeSingle();
    if (error || !data) return fallbackGalleryAlbums.find((a) => a.slug === slug) ?? null;
    return data as unknown as GalleryAlbum;
  });
}

export async function getGalleryItems(albumId?: string): Promise<GalleryItem[]> {
  return withClientFallback(fallbackGalleryItems, async (db) => {
    let query = db.from('gallery_items').select('*').eq('visible', true);
    if (albumId) query = query.eq('album_id', albumId);
    const { data, error } = await query.order('position', { ascending: true });
    if (error || !data || data.length === 0) return fallbackGalleryItems.filter((i) => !albumId || i.album_id === albumId);
    return data as unknown as GalleryItem[];
  });
}

export async function getMassSchedules(): Promise<MassSchedule[]> {
  return withClientFallback(fallbackMassSchedules, async (db) => {
    const { data, error } = await db.from('mass_schedules').select('*').eq('active', true).order('time', { ascending: true });
    if (error || !data || data.length === 0) return fallbackMassSchedules;
    return data as unknown as MassSchedule[];
  });
}

export async function getSacraments(): Promise<Sacrament[]> {
  return withClientFallback(fallbackSacraments, async (db) => {
    const { data, error } = await db.from('sacraments').select('*').eq('active', true).order('position', { ascending: true });
    if (error || !data || data.length === 0) return fallbackSacraments;
    return data as unknown as Sacrament[];
  });
}

export async function getSacramentBySlug(slug: string): Promise<Sacrament | null> {
  return withClientFallback(fallbackSacraments.find((s) => s.slug === slug) ?? null, async (db) => {
    const { data, error } = await db.from('sacraments').select('*').eq('slug', slug).maybeSingle();
    if (error || !data) return fallbackSacraments.find((s) => s.slug === slug) ?? null;
    return data as unknown as Sacrament;
  });
}

export async function getSacramentTypes(): Promise<SacramentType[]> {
  return withClientFallback(fallbackSacramentTypes, async (db) => {
    const { data, error } = await db.from('sacrament_types').select('*').eq('active', true).order('position', { ascending: true });
    if (error || !data || data.length === 0) return fallbackSacramentTypes;
    return data as unknown as SacramentType[];
  });
}

// ---------------------------------------------------------------------------
// Slides por sección (home, santuario, fe-peregrinacion, festividades,
// historia, galeria). Si la tabla aún no existe, devuelve los slides de
// demostración para que el sitio nunca quede sin carrusel.
// ---------------------------------------------------------------------------

export async function getSlidesBySection(section: string, limit = 12): Promise<Slide[]> {
  const fallback = fallbackSlides.filter((s) => s.section === section).slice(0, limit);
  if (!hasSupabaseConfig()) return fallback;
  try {
    const db = createClient();
    const { data, error } = await db
      .from('slides')
      .select('*')
      .eq('section', section)
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .limit(limit);
    if (error || !data || data.length === 0) return fallback;
    return data as unknown as Slide[];
  } catch {
    return fallback;
  }
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}


// NOTA (PROMPT 12): las consultas administrativas viven en queries-admin.ts
// (modulo solo-servidor con verificacion de sesion y service role). Este
// modulo permanece seguro para ser importado desde componentes cliente.

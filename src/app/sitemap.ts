import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';
import {
  getEventsList,
  getFestivitiesList,
  getGalleryAlbums,
  getNewsList,
  getSacraments,
} from '@/lib/queries';

export const revalidate = 3600;

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

function entry(
  path: string,
  options: { lastModified?: string | Date | null; changeFrequency?: ChangeFrequency; priority?: number } = {},
): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteUrl}${path}`,
    lastModified: options.lastModified ? new Date(options.lastModified) : new Date(),
    changeFrequency: options.changeFrequency ?? 'monthly',
    priority: options.priority ?? 0.7,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    entry('/', { changeFrequency: 'weekly', priority: 1 }),
    entry('/santuario', { priority: 0.9 }),
    entry('/santuario/historia', { priority: 0.8 }),
    entry('/santuario/nuestra-senora', { priority: 0.9 }),
    entry('/santuario/patrimonio', { priority: 0.8 }),
    entry('/santuario/arquitectura', { priority: 0.7 }),
    entry('/santuario/archivo-historico', { priority: 0.6 }),
    entry('/fe', { priority: 0.8 }),
    entry('/fe/misas', { priority: 0.8 }),
    entry('/fe/sacramentos', { priority: 0.8 }),
    entry('/festividades', { changeFrequency: 'weekly', priority: 0.8 }),
    entry('/noticias', { changeFrequency: 'weekly', priority: 0.7 }),
    entry('/eventos', { changeFrequency: 'weekly', priority: 0.7 }),
    entry('/galeria', { changeFrequency: 'weekly', priority: 0.6 }),
    entry('/visita', { priority: 0.8 }),
    entry('/solicitudes', { priority: 0.5 }),
    entry('/solicitudes/misa', { priority: 0.5 }),
    entry('/solicitudes/sacramentos', { priority: 0.5 }),
    entry('/contacto', { priority: 0.6 }),
  ];

  const [news, events, festivities, albums, sacraments] = await Promise.all([
    getNewsList(200),
    getEventsList(),
    getFestivitiesList(),
    getGalleryAlbums(),
    getSacraments(),
  ]);

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...news.map((item) =>
      entry(`/noticias/${item.slug}`, {
        lastModified: item.updated_at || item.published_at,
        changeFrequency: 'weekly',
        priority: 0.7,
      }),
    ),
    ...events.map((item) =>
      entry(`/eventos/${item.slug}`, {
        lastModified: item.updated_at,
        changeFrequency: 'weekly',
        priority: 0.7,
      }),
    ),
    ...festivities.map((item) =>
      entry(`/festividades/${item.slug}`, {
        lastModified: item.updated_at,
        changeFrequency: 'weekly',
        priority: 0.7,
      }),
    ),
    ...albums.map((item) =>
      entry(`/galeria/${item.slug}`, {
        lastModified: item.updated_at,
        changeFrequency: 'monthly',
        priority: 0.5,
      }),
    ),
    ...sacraments.map((item) =>
      entry(`/fe/sacramentos/${item.slug}`, {
        lastModified: item.updated_at,
        changeFrequency: 'monthly',
        priority: 0.6,
      }),
    ),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}

import type { Metadata } from 'next';

/** URL canónica del sitio (sin barra final). */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://santuariococharcas.pe'
).replace(/\/+$/, '');

export const siteName = 'Santuario de Nuestra Señora de Cocharcas';

export const siteDescription =
  'Santuario de Nuestra Señora de Cocharcas — Cocharcas, Chincheros, Apurímac, Perú. Historia, fe, patrimonio, festividades y peregrinación.';

export const siteKeywords = [
  'Santuario de Cocharcas',
  'Nuestra Señora de Cocharcas',
  'Cocharcas',
  'Chincheros',
  'Apurímac',
  'santuario mariano',
  'peregrinación Perú',
  'fiestas patronales Apurímac',
  'patrimonio religioso',
  'turismo religioso Apurímac',
];

/** Construye una URL absoluta a partir de una ruta interna. */
export function absoluteUrl(path = ''): string {
  if (!path) return siteUrl;
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Ruta de la imagen Open Graph por defecto (asset estático en /public). */
export const ogImagePath = '/images/og-default.png';

/** Imagen Open Graph por defecto. */
export function defaultOgImages() {
  return [
    {
      url: absoluteUrl(ogImagePath),
      width: 1200,
      height: 630,
      alt: siteName,
    },
  ];
}

type PageMetadataInput = {
  title: string;
  description?: string | null;
  /** Ruta interna, p. ej. "/noticias". Se usa para canonical y og:url. */
  path: string;
  images?: { url: string; alt?: string }[];
  type?: 'website' | 'article';
  /** true para páginas que no deben indexarse (formularios, seguimiento, etc.). */
  noIndex?: boolean;
};

/**
 * Metadata completa y consistente para páginas: título, descripción,
 * canonical, Open Graph y Twitter Card.
 */
export function pageMetadata({
  title,
  description,
  path,
  images,
  type = 'website',
  noIndex = false,
}: PageMetadataInput): Metadata {
  const resolvedImages =
    images && images.length > 0
      ? images.map((img) => ({ url: absoluteUrl(img.url), alt: img.alt || title }))
      : defaultOgImages();

  return {
    title,
    description: description || undefined,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: description || undefined,
      url: absoluteUrl(path),
      type,
      images: resolvedImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || undefined,
      images: resolvedImages.map((img) => img.url),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

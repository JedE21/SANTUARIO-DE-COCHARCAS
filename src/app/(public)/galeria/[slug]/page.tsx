import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ImageIcon } from 'lucide-react';
import { Container, Section, EmptyState } from '@/components/public';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { JsonLd } from '@/components/shared/json-ld';
import { FadeIn } from '@/components/motion';
import { getGalleryAlbumBySlug, getGalleryItems, getGalleryAlbums } from '@/lib/queries';
import { absoluteUrl, pageMetadata } from '@/lib/seo';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const album = await getGalleryAlbumBySlug(params.slug);
  if (!album) return { title: 'Álbum no encontrado', robots: { index: false } };
  return pageMetadata({
    title: album.title,
    description: album.description,
    path: `/galeria/${album.slug}`,
    images: album.cover_image_url ? [{ url: album.cover_image_url, alt: album.title }] : undefined,
  });
}

export default async function AlbumPage({ params }: Props) {
  const [album, all] = await Promise.all([getGalleryAlbumBySlug(params.slug), getGalleryAlbums()]);
  if (!album) notFound();
  const items = await getGalleryItems(album.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: album.title,
    description: album.description || undefined,
    url: absoluteUrl(`/galeria/${album.slug}`),
    image: (album.cover_image_url ? [album.cover_image_url] : [])
      .concat(items.slice(0, 5).map((i) => i.image_url)),
    inLanguage: 'es-PE',
  };

  return (
    <main>
      <JsonLd data={jsonLd} />

      <Section className="bg-marfil">
        <Container>
          <div className="mx-auto max-w-3xl">
            <FadeIn>
              <p className="eyebrow text-tierra">Álbum</p>
              <h1 className="display-section mt-5 text-marron">{album.title}</h1>
              {album.description ? (
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{album.description}</p>
              ) : null}
            </FadeIn>
          </div>
        </Container>
      </Section>

      <Section className="bg-blanco">
        <Container>
          {items.length > 0 ? (
            <GalleryGrid
              images={items.map((item) => ({
                id: item.id,
                src: item.image_url,
                alt: item.alt_text || item.title || `Imagen de ${album.title}`,
                caption: item.description || item.title || undefined,
              }))}
            />
          ) : (
            <EmptyState
              icon={<ImageIcon className="h-6 w-6" />}
              title="Aún no hay imágenes en este álbum"
              description="Cuando se publiquen fotografías de esta colección aparecerán aquí."
            />
          )}

          {all.length > 1 ? (
            <div className="mx-auto mt-20 max-w-4xl">
              <p className="eyebrow text-tierra">Otros álbumes</p>
              <ol className="mt-8 border-t border-tierra/20">
                {all
                  .filter((a) => a.id !== album.id)
                  .slice(0, 3)
                  .map((a) => (
                    <li key={a.id} className="border-b border-tierra/20">
                      <Link
                        href={`/galeria/${a.slug}`}
                        className="group flex items-center justify-between gap-6 py-6"
                      >
                        <span className="font-heading text-xl font-medium text-marron transition-colors duration-300 group-hover:text-dorado-oscuro sm:text-2xl">
                          {a.title}
                        </span>
                        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-tierra">
                          Ver álbum
                        </span>
                      </Link>
                    </li>
                  ))}
              </ol>
            </div>
          ) : null}
        </Container>
      </Section>
    </main>
  );
}

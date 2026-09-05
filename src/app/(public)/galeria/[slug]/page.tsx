import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ImageIcon } from 'lucide-react';
import { Container, Section, Badge, Card, EmptyState } from '@/components/public';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { JsonLd } from '@/components/shared/json-ld';
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
        <Container className="py-16">
          <div className="mx-auto max-w-3xl">
            <Badge className="mb-4">Álbum</Badge>
            <h1 className="text-4xl font-bold">{album.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{album.description}</p>
          </div>
        </Container>
      </Section>
      <Section className="bg-background">
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
              className="py-16"
              icon={<ImageIcon className="h-6 w-6" />}
              title="Aún no hay imágenes en este álbum"
              description="Cuando se publiquen fotografías de esta colección aparecerán aquí."
            />
          )}

          {all.length > 0 && (
            <div className="mx-auto mt-16 max-w-5xl">
              <h2 className="text-2xl font-semibold">Otros álbumes</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {all.filter((a) => a.id !== album.id).slice(0, 3).map((a) => (
                  <Card key={a.id} className="p-6">
                    <Link href={`/galeria/${a.slug}`}>
                      <h3 className="text-lg font-semibold">{a.title}</h3>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}

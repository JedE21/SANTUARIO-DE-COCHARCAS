import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ImageIcon } from 'lucide-react';
import { Container, Section, SectionHeading, Badge, Card, EmptyState } from '@/components/public';
import { PageHero } from '@/components/public/page-hero';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { getGalleryAlbums, getGalleryItems, getGalleryCategories } from '@/lib/queries';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Galería fotográfica',
  description: 'Fotografías del santuario, festividades y vida comunitaria.',
  path: '/galeria',
});

export default async function GaleriaPage() {
  const [albums, items, categories] = await Promise.all([getGalleryAlbums(), getGalleryItems(), getGalleryCategories()]);
  const featured = items.slice(0, 6).map((item) => ({
    id: item.id,
    src: item.image_url,
    alt: item.alt_text || item.title || 'Imagen del santuario',
    caption: item.description || item.title || undefined,
  }));

  return (
    <main>
      <PageHero
        eyebrow="Galería"
        title="Galería fotográfica"
        description="Vistas del templo, celebraciones y momentos de la comunidad."
      />

      <Section className="bg-background">
        <Container>
          <Reveal>
            <SectionHeading title="Colecciones" description="Explora por álbumes temáticos." />
          </Reveal>
          {albums.length === 0 ? (
            <EmptyState
              className="mt-10"
              icon={<ImageIcon className="h-6 w-6" />}
              title="Aún no hay álbumes publicados"
              description="Cuando se publiquen colecciones fotográficas aparecerán en esta sección."
            />
          ) : (
            <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
              {albums.map((album) => {
                const category = categories.find((c) => c.id === album.category_id);
                const cover = album.cover_image_url || items.find((i) => i.album_id === album.id)?.image_url || '/images/cocharcas-gallery.svg';
                return (
                  <StaggerItem key={album.id} className="h-full">
                    <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <Link href={`/galeria/${album.slug}`} className="block">
                        <div className="relative aspect-video w-full overflow-hidden bg-muted/20">
                          <Image src={cover} alt={album.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                        </div>
                        <div className="space-y-2 p-6">
                          {category ? <Badge variant="outline">{category.name}</Badge> : null}
                          <h3 className="text-xl font-semibold text-azul transition-normal group-hover:text-carmesi">{album.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{album.description}</p>
                        </div>
                      </Link>
                    </Card>
                  </StaggerItem>
                );
              })}
            </Stagger>
          )}
        </Container>
      </Section>

      <Section className="bg-marfil">
        <Container>
          <Reveal>
            <SectionHeading title="Imágenes destacadas" description="Toca una fotografía para verla ampliada." />
          </Reveal>
          {featured.length === 0 ? (
            <EmptyState
              className="mt-10"
              icon={<ImageIcon className="h-6 w-6" />}
              title="Aún no hay imágenes destacadas"
              description="Las fotografías del templo y de la comunidad se mostrarán aquí."
            />
          ) : (
            <GalleryGrid images={featured} className="mt-10" />
          )}
        </Container>
      </Section>
    </main>
  );
}

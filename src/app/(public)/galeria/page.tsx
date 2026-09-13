import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ImageIcon } from 'lucide-react';
import { Container, Section, EmptyState } from '@/components/public';
import { PageHero } from '@/components/public/page-hero';
import { SectionSlider } from '@/components/public/section-slider';
import { FadeIn, Reveal } from '@/components/motion';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { getGalleryAlbums, getGalleryItems, getGalleryCategories, getSlidesBySection } from '@/lib/queries';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Galería fotográfica',
  description: 'Fotografías del santuario, festividades y vida comunitaria.',
  path: '/galeria',
});

export default async function GaleriaPage() {
  const [albums, items, categories, slides] = await Promise.all([
    getGalleryAlbums(),
    getGalleryItems(),
    getGalleryCategories(),
    getSlidesBySection('galeria'),
  ]);
  const featured = items.slice(0, 6).map((item) => ({
    id: item.id,
    src: item.image_url,
    alt: item.alt_text || item.title || 'Imagen del santuario',
    caption: item.description || item.title || undefined,
  }));

  return (
    <main>
      {/* Carrusel de fotografías de la sección: protagonista en lugar de la banda marrón */}
      {slides.length > 0 ? (
        <SectionSlider slides={slides} label="Galería" priority fullScreen />
      ) : (
        <PageHero
          eyebrow="Galería"
          title="El santuario en imágenes"
          description="Vistas del templo, celebraciones y momentos de la comunidad."
        />
      )}
      <h1 className="sr-only">El santuario en imágenes</h1>

      <Section className="bg-marfil">
        <Container>
          <FadeIn>
            <p className="eyebrow text-tierra">Colecciones</p>
            <h2 className="display-section mt-5 max-w-2xl text-marron">
              Álbumes que guardan la memoria del pueblo
            </h2>
          </FadeIn>
          {albums.length === 0 ? (
            <EmptyState
              className="mt-10"
              icon={<ImageIcon className="h-6 w-6" />}
              title="Aún no hay álbumes publicados"
              description="Cuando se publiquen colecciones fotográficas aparecerán en esta sección."
            />
          ) : (
            <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album, i) => {
                const category = categories.find((c) => c.id === album.category_id);
                const cover =
                  album.cover_image_url ||
                  items.find((i) => i.album_id === album.id)?.image_url ||
                  '/images/santuario/santuario-exterior.jpg';
                return (
                  <Reveal key={album.id} delay={Math.min(i * 0.07, 0.3)}>
                    <Link href={`/galeria/${album.slug}`} className="group block">
                      <div className="relative aspect-[4/5] overflow-hidden bg-piedra/30">
                        <Image
                          src={cover}
                          alt={album.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="img-zoom object-cover"
                        />
                      </div>
                      <p className="mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-tierra">
                        {category ? category.name : 'Álbum'}
                      </p>
                      <h3 className="mt-1.5 font-heading text-2xl font-medium text-marron transition-colors duration-300 group-hover:text-dorado-oscuro">
                        {album.title}
                      </h3>
                      {album.description ? (
                        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {album.description}
                        </p>
                      ) : null}
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </Container>
      </Section>

      {featured.length > 0 ? (
        <Section className="bg-blanco">
          <Container>
            <FadeIn>
              <p className="eyebrow text-tierra">Imágenes destacadas</p>
              <h2 className="display-section mt-5 text-marron">Momentos de fe y tradición</h2>
            </FadeIn>
            <div className="mt-12">
              <GalleryGrid images={featured} />
            </div>
          </Container>
        </Section>
      ) : null}
    </main>
  );
}

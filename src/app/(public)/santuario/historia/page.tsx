import * as React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHero } from '@/components/public/page-hero';
import { HistoricalTimeline } from '@/components/shared/historical-timeline';
import { Section, Container } from '@/components/public';
import { SectionSlider } from '@/components/public/section-slider';
import { FadeIn, Reveal } from '@/components/motion';
import { pageMetadata } from '@/lib/seo';
import { getHistoriaContent, getHistoriaTimeline, getSlidesBySection } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMetadata({
  title: 'Historia',
  description: 'Historia de la Virgen de Cocharcas y del Santuario: de la llegada de la imagen en 1598 al santuario de piedra de hoy.',
  path: '/santuario/historia',
});

export default async function HistoriaPage() {
  const [content, timeline, slides] = await Promise.all([
    getHistoriaContent(),
    getHistoriaTimeline(),
    getSlidesBySection('historia'),
  ]);

  const timelineItems = timeline.map((item) => ({
    year: item.year,
    title: item.title,
    description: item.description ?? '',
    image: item.image_url,
    imageAlt: item.image_alt,
  }));

  const archiveParagraphs = (content.archive_text ?? '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <main>
      <h1 className="sr-only">Historia: cuatro siglos de devoción</h1>

      {/* Carrusel de fotografías de la sección: protagonista en lugar de la banda marrón */}
      {slides.length > 0 ? (
        <SectionSlider slides={slides} label="Historia" priority fullScreen />
      ) : (
        <PageHero
          eyebrow="Historia"
          title={content.hero_title || 'Cuatro siglos de devoción'}
          description={content.hero_description || undefined}
        />
      )}

      {/* Orígenes: la historia de la Virgen de Cocharcas (composición editorial) */}
      <Section className="bg-marfil">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
            <FadeIn className="lg:col-span-5">
              <p className="eyebrow text-tierra">Orígenes y fundación</p>
              <h2 className="display-section mt-5 text-marron">
                {content.origins_title || 'Una imagen que llegó a pie'}
              </h2>
            </FadeIn>
            <FadeIn delay={0.1} className="lg:col-span-7">
              <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>{content.origins_text}</p>
                {content.origins_quote ? (
                  <p className="font-heading text-xl italic text-marron sm:text-2xl">{content.origins_quote}</p>
                ) : null}
              </div>
            </FadeIn>
          </div>
          {content.origins_image_url ? (
            <FadeIn delay={0.15}>
              <div className="relative mt-14">
                <div
                  aria-hidden="true"
                  className="absolute -left-4 -top-4 hidden h-full w-full border border-tierra/25 lg:block"
                />
                <div className="relative aspect-[4/3] overflow-hidden bg-piedra/30 lg:aspect-[16/7]">
                  <Image
                    src={content.origins_image_url}
                    alt={content.origins_image_alt || 'Imagen de la Virgen de Cocharcas'}
                    fill
                    sizes="(max-width: 1024px) 100vw, 90vw"
                    className="img-zoom object-cover"
                    unoptimized={!content.origins_image_url.startsWith('/')}
                  />
                </div>
                <p className="mt-4 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-tierra">
                  {content.origins_image_alt || 'Nuestra Señora de Cocharcas'}
                </p>
              </div>
            </FadeIn>
          ) : null}
        </Container>
      </Section>

      {/* Línea de tiempo (editable desde el panel) */}
      <Section className="bg-blanco">
        <Container>
          <FadeIn>
            <p className="eyebrow text-tierra">Línea de tiempo</p>
            <h2 className="display-section mt-5 text-marron">Acontecimientos que hicieron historia</h2>
          </FadeIn>
          <div className="mt-14">
            <HistoricalTimeline items={timelineItems} />
          </div>
        </Container>
      </Section>

      {/* Periodos históricos */}
      <Section className="bg-marfil">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            <FadeIn className="lg:col-span-4">
              <p className="eyebrow text-tierra">Periodos históricos</p>
              <h2 className="display-section mt-5 text-marron">
                {content.periods_title || 'Etapas del santuario'}
              </h2>
              {content.periods_description ? (
                <p className="mt-6 max-w-sm leading-relaxed text-muted-foreground">{content.periods_description}</p>
              ) : null}
            </FadeIn>
            <div className="lg:col-span-8">
              <ol className="border-t border-tierra/20">
                {timelineItems.map((event, index) => (
                  <Reveal key={`${event.year}-${event.title}`} delay={Math.min(index * 0.07, 0.3)}>
                    <li className="grid gap-2 border-b border-tierra/20 py-7 sm:grid-cols-[6rem_1fr] sm:gap-8">
                      <span className="eyebrow pt-1.5 text-dorado-oscuro">{event.year}</span>
                      <span>
                        <span className="block font-heading text-2xl font-medium text-marron">{event.title}</span>
                        <span className="mt-2 block max-w-2xl leading-relaxed text-muted-foreground">
                          {event.description}
                        </span>
                      </span>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </Section>

      {/* Archivo histórico */}
      <Section className="bg-blanco">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
            {content.archive_image_url ? (
              <FadeIn className="order-2 lg:order-1 lg:col-span-5">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute -left-4 -top-4 hidden h-full w-full border border-tierra/25 lg:block"
                  />
                  <div className="relative aspect-[4/3] overflow-hidden bg-piedra/30">
                    <Image
                      src={content.archive_image_url}
                      alt={content.archive_image_alt || 'Archivo histórico del santuario'}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="img-zoom object-cover"
                      unoptimized={!content.archive_image_url.startsWith('/')}
                    />
                  </div>
                </div>
              </FadeIn>
            ) : null}
            <FadeIn delay={0.1} className={`order-1 lg:order-2 ${content.archive_image_url ? 'lg:col-span-7' : 'lg:col-span-7'}`}>
              <p className="eyebrow text-tierra">Archivo histórico</p>
              <h2 className="display-section mt-5 text-marron">
                {content.archive_title || 'La memoria escrita'}
              </h2>
              <div className="mt-7 space-y-5 leading-relaxed text-muted-foreground">
                {archiveParagraphs.length > 0 ? (
                  archiveParagraphs.map((p, i) => <p key={i}>{p}</p>)
                ) : (
                  <p>Contenido del archivo histórico en preparación.</p>
                )}
              </div>
            </FadeIn>
          </div>
        </Container>
      </Section>
    </main>
  );
}

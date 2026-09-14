import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Container, Section, EmptyState } from '@/components/public';
import { PageHero } from '@/components/public/page-hero';
import { SectionSlider } from '@/components/public/section-slider';
import { FadeIn, Reveal } from '@/components/motion';
import { getFestivitiesList, getSlidesBySection } from '@/lib/queries';
import { pageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMetadata({
  title: 'Festividades',
  description: 'Festividades y celebraciones del Santuario de Cocharcas.',
  path: '/festividades',
});

function formatDate(value?: string | null) {
  if (!value) return '';
  return new Date(value + 'T00:00:00').toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function FestividadesPage() {
  const [festivities, slides] = await Promise.all([getFestivitiesList(), getSlidesBySection('festividades')]);
  const main = festivities[0] ?? null;
  const rest = festivities.slice(1);

  return (
    <main>
      {/* Carrusel de fotografías de la sección: protagonista en lugar de la banda marrón */}
      {slides.length > 0 ? (
        <SectionSlider slides={slides} label="Festividades" priority fullScreen />
      ) : (
        <PageHero
          eyebrow="Festividades"
          title="Celebraciones y fiestas patronales"
          description="Jornadas de fe, cultura y encuentro comunitario que dan vida al santuario."
        />
      )}
      <h1 className="sr-only">Celebraciones y fiestas patronales</h1>

      <Section className="bg-marfil">
        <Container>
          {festivities.length === 0 ? (
            <EmptyState
              icon={<Sparkles className="h-6 w-6" />}
              title="Aún no hay festividades publicadas"
              description="El calendario de celebraciones se anunciará en esta sección."
            />
          ) : (
            <>
              {/* Festividad principal: composición editorial protagonista */}
              {main ? (
                <FadeIn>
                  <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-7">
                      <Link href={`/festividades/${main.slug}`} className="group block">
                        <div className="relative aspect-[4/3] overflow-hidden bg-piedra/30 lg:aspect-[16/11]">
                          <Image
                            src={main.cover_image_url || '/images/santuario/pintura-colonial.jpg'}
                            alt={main.name}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 58vw"
                            className="img-zoom object-cover"
                          />
                        </div>
                      </Link>
                    </div>
                    <div className="lg:col-span-5">
                      <p className="eyebrow text-tierra">Festividad principal</p>
                      <h2 className="display-section mt-5 text-marron">
                        <Link
                          href={`/festividades/${main.slug}`}
                          className="transition-colors duration-300 hover:text-dorado-oscuro"
                        >
                          {main.name}
                        </Link>
                      </h2>
                      {main.start_date ? (
                        <p className="mt-4 font-heading text-lg italic text-tierra">
                          {formatDate(main.start_date)}
                          {main.end_date && main.end_date !== main.start_date
                            ? ` — ${formatDate(main.end_date)}`
                            : ''}
                        </p>
                      ) : null}
                      {main.description ? (
                        <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                          {main.description}
                        </p>
                      ) : null}
                      <Link
                        href={`/festividades/${main.slug}`}
                        className="group mt-8 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-marron transition-colors duration-300 hover:text-dorado-oscuro"
                      >
                        <span className="border-b border-marron/30 pb-1.5 transition-colors duration-300 group-hover:border-dorado">
                          Ver programa
                        </span>
                        <ArrowRight
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              ) : null}

              {/* Otras festividades: lista editorial */}
              {rest.length > 0 ? (
                <div className="mt-24">
                  <FadeIn>
                    <p className="eyebrow text-tierra">Calendario</p>
                    <h2 className="display-section mt-5 text-marron">Otras celebraciones</h2>
                  </FadeIn>
                  <ol className="mt-10 border-t border-tierra/20">
                    {rest.map((festivity, i) => (
                      <Reveal key={festivity.id} delay={Math.min(i * 0.06, 0.24)}>
                        <li className="border-b border-tierra/20">
                          <Link
                            href={`/festividades/${festivity.slug}`}
                            className="group grid gap-2 py-7 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline sm:gap-8"
                          >
                            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-tierra">
                              {festivity.start_date ? formatDate(festivity.start_date) : 'Próximamente'}
                            </span>
                            <span className="font-heading text-2xl font-medium leading-snug text-marron transition-colors duration-300 group-hover:text-dorado-oscuro">
                              {festivity.name}
                            </span>
                            <ArrowRight
                              className="hidden h-4 w-4 self-center text-tierra/60 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-dorado-oscuro sm:block"
                              aria-hidden="true"
                            />
                          </Link>
                        </li>
                      </Reveal>
                    ))}
                  </ol>
                </div>
              ) : null}
            </>
          )}
        </Container>
      </Section>
    </main>
  );
}

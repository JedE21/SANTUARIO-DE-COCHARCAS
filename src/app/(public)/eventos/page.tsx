import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { Container, Section, EmptyState } from '@/components/public';
import { PageHero } from '@/components/public/page-hero';
import { SectionSlider } from '@/components/public/section-slider';
import { FadeIn, Reveal } from '@/components/motion';
import { getEventsList, getSlidesBySection } from '@/lib/queries';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Eventos',
  description: 'Próximos eventos y celebraciones del Santuario de Cocharcas.',
  path: '/eventos',
});

function eventDay(value: string) {
  return new Date(value + 'T00:00:00').getDate().toString().padStart(2, '0');
}

function eventMonth(value: string) {
  return new Date(value + 'T00:00:00')
    .toLocaleDateString('es-PE', { month: 'short' })
    .replace(/\./g, '')
    .toUpperCase();
}

function formatDate(value: string) {
  return new Date(value + 'T00:00:00').toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function EventosPage() {
  const [events, slides] = await Promise.all([getEventsList(), getSlidesBySection('eventos')]);
  const upcoming = events.filter((e) => new Date(e.start_date + 'T00:00:00') >= new Date());
  const past = events.filter((e) => new Date(e.start_date + 'T00:00:00') < new Date());
  const visible = upcoming.length ? upcoming : events;

  return (
    <main>
      {/* Carrusel de fotografías de la sección: protagonista en lugar de la banda marrón */}
      {slides.length > 0 ? (
        <SectionSlider slides={slides} label="Eventos" priority fullScreen />
      ) : (
        <PageHero
          eyebrow="Eventos"
          title="Próximos eventos y celebraciones"
          description="Encuentros litúrgicos, peregrinaciones y actividades comunitarias."
        />
      )}
      <h1 className="sr-only">Próximos eventos y celebraciones</h1>

      <Section className="bg-marfil">
        <Container>
          <FadeIn>
            <p className="eyebrow text-tierra">{upcoming.length ? 'Agenda' : 'Eventos'}</p>
            <h2 className="display-section mt-5 text-marron">Programación de la comunidad</h2>
          </FadeIn>

          {visible.length === 0 ? (
            <EmptyState
              className="mt-10"
              icon={<CalendarDays className="h-6 w-6" />}
              title="No hay eventos programados por el momento"
              description="Cuando se anuncien celebraciones y actividades aparecerán en esta sección."
            />
          ) : (
            <ol className="mt-12 border-t border-tierra/20">
              {visible.map((event, i) => (
                <Reveal key={event.id} delay={Math.min(i * 0.06, 0.3)}>
                  <li className="border-b border-tierra/20">
                    <Link
                      href={`/eventos/${event.slug}`}
                      className="group flex items-center gap-6 py-8 sm:gap-10"
                    >
                      <span className="w-16 shrink-0 text-center sm:w-20">
                        <span className="block font-heading text-4xl font-medium leading-none text-marron sm:text-5xl">
                          {eventDay(event.start_date)}
                        </span>
                        <span className="mt-2 block text-[0.6rem] font-semibold uppercase tracking-[0.26em] text-tierra">
                          {eventMonth(event.start_date)}
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-heading text-xl font-medium leading-snug text-marron transition-colors duration-300 group-hover:text-dorado-oscuro sm:text-2xl">
                          {event.title}
                        </span>
                        <span className="mt-2 block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          {[event.location, formatDate(event.start_date)].filter(Boolean).join(' · ')}
                        </span>
                      </span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-tierra/60 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-dorado-oscuro"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ol>
          )}

          {past.length > 0 && (
            <div className="mt-20">
              <FadeIn>
                <p className="eyebrow text-tierra">Eventos anteriores</p>
              </FadeIn>
              <ol className="mt-8 border-t border-tierra/15">
                {past.slice(0, 8).map((event) => (
                  <li key={event.id} className="border-b border-tierra/15">
                    <Link
                      href={`/eventos/${event.slug}`}
                      className="group flex items-baseline justify-between gap-6 py-5"
                    >
                      <span className="font-heading text-lg font-medium text-marron/75 transition-colors duration-300 group-hover:text-dorado-oscuro">
                        {event.title}
                      </span>
                      <span className="shrink-0 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-tierra/70">
                        {formatDate(event.start_date)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}

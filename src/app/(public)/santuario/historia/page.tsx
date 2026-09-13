import * as React from 'react';
import type { Metadata } from 'next';
import { PageHero } from '@/components/public/page-hero';
import { HistoricalTimeline } from '@/components/shared/historical-timeline';
import { Section, Container } from '@/components/public';
import { SectionSlider } from '@/components/public/section-slider';
import { FadeIn, Reveal } from '@/components/motion';
import { pageMetadata } from '@/lib/seo';
import { getSlidesBySection } from '@/lib/queries';

// Types
type HistoricalEvent = {
  year: string | number;
  title: string;
  description: string;
};

// Fetch historical events (placeholder)
async function fetchHistoricalEvents(): Promise<HistoricalEvent[]> {
  // En una implementación real se obtendría del CMS o de Supabase.
  return [
    {
      year: '1598',
      title: 'Llegada de la imagen de la Virgen de Cocharcas',
      description: 'Según la tradición, el indígena Francisco Tito Yupanqui trajo una réplica de la Virgen de Copacabana a estas tierras después de un arduo viaje a pie desde Potosí.',
    },
    {
      year: '1600',
      title: 'Construcción de la primera capilla',
      description: 'Los fieles construyeron una primera capilla de adobe y paja para venerar la imagen traída.',
    },
    {
      year: '1650',
      title: 'Edificación de la iglesia actual',
      description: 'Se comenzó la construcción de la iglesia de piedra que actualmente se conserva.',
    },
    {
      year: '1700',
      title: 'Primeros documentos parroquiales',
      description: 'Se iniciaron los registros de bautismos, matrimonios y defunciones.',
    }
  ];
}

export const metadata: Metadata = pageMetadata({
  title: 'Historia',
  description: 'Conoce la historia del Santuario de Nuestra Señora de Cocharcas desde su fundación hasta la actualidad.',
  path: '/santuario/historia',
});

export default async function HistoriaPage() {
  const [historicalEvents, slides] = await Promise.all([fetchHistoricalEvents(), getSlidesBySection('historia')]);

  return (
    <main>
      {/* Carrusel de fotografías de la sección: protagonista en lugar de la banda marrón */}
      {slides.length > 0 ? (
        <SectionSlider slides={slides} label="Historia" priority fullScreen />
      ) : (
        <PageHero
          eyebrow="Historia"
          title="Cuatro siglos de devoción"
          description="Un legado que perdura a través de los siglos, desde la llegada de la imagen hasta el santuario de piedra de hoy."
        />
      )}
      <h1 className="sr-only">Historia: cuatro siglos de devoción</h1>

      {/* Orígenes: composición editorial */}
      <Section className="bg-marfil">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            <FadeIn className="lg:col-span-5">
              <p className="eyebrow text-tierra">Orígenes y fundación</p>
              <h2 className="display-section mt-5 text-marron">Una imagen que llegó a pie</h2>
            </FadeIn>
            <FadeIn delay={0.1} className="lg:col-span-7">
              <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>
                  La historia del Santuario de Nuestra Señora de Cocharcas se remonta a finales del siglo XVI,
                  cuando el indígena Francisco Tito Yupanqui, inspirado por la devoción a la Virgen de Copacabana,
                  decidió crear una réplica de la imagen sagrada. Tras un arduo viaje de más de 800 kilómetros,
                  logró traer la imagen a estas tierras, donde fue recibida con gran alegría y devoción por
                  la población local.
                </p>
                <p className="font-heading text-xl italic text-marron sm:text-2xl">
                  Este acto de fe marcó el comienzo de lo que hoy es uno de los centros religiosos más
                  importantes de los Andes peruanos.
                </p>
              </div>
            </FadeIn>
          </div>
        </Container>
      </Section>

      {/* Línea de tiempo */}
      <Section className="bg-blanco">
        <Container>
          <FadeIn>
            <p className="eyebrow text-tierra">Línea de tiempo</p>
            <h2 className="display-section mt-5 text-marron">Acontecimientos que hicieron historia</h2>
          </FadeIn>
          <div className="mt-14">
            <HistoricalTimeline items={historicalEvents} />
          </div>
        </Container>
      </Section>

      {/* Periodos históricos */}
      <Section className="bg-marfil">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            <FadeIn className="lg:col-span-4">
              <p className="eyebrow text-tierra">Periodos históricos</p>
              <h2 className="display-section mt-5 text-marron">Etapas del santuario</h2>
            </FadeIn>
            <div className="lg:col-span-8">
              <ol className="border-t border-tierra/20">
                {historicalEvents.map((event, index) => (
                  <Reveal key={event.year} delay={Math.min(index * 0.07, 0.3)}>
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
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            <FadeIn className="lg:col-span-5">
              <p className="eyebrow text-tierra">Archivo histórico</p>
              <h2 className="display-section mt-5 text-marron">La memoria escrita</h2>
            </FadeIn>
            <FadeIn delay={0.1} className="lg:col-span-7">
              <div className="space-y-5 leading-relaxed text-muted-foreground">
                <p>
                  El santuario posee un valioso archivo histórico que incluye documentos del siglo XVII,
                  como libros de bautismos, matrimonios y defunciones, así como correspondencia eclesiástica
                  y registros administrativos que permiten reconstruir la vida de la comunidad a lo largo de los siglos.
                </p>
                <p>
                  Actualmente, el archivo se encuentra en proceso de organización y digitalización para su
                  conservación y puesta a disposición de investigadores y del público interesado.
                </p>
              </div>
            </FadeIn>
          </div>
        </Container>
      </Section>
    </main>
  );
}

import * as React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { PageHeader } from '@/components/shared/page-header';
import { HistoricalTimeline } from '@/components/shared/historical-timeline';
import { Section, Container, SectionHeading, Link, Card } from '@/components/public';
import { FadeIn, Reveal } from '@/components/motion';
import { pageMetadata } from '@/lib/seo';

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
  const historicalEvents = await fetchHistoricalEvents();

  return (
    <main>
      <section className="pb-20">
        <Container>
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'El Santuario', href: '/santuario' },
              { label: 'Historia', href: '/santuario/historia', isActive: true }
            ]}
          />

          {/* Page Header */}
          <PageHeader
            title="Historia del Santuario"
            description="Un legado que perdura a través de los siglos."
            eyebrow="HISTORIA"
          />

          {/* Main content */}
          <div className="space-y-12">
            {/* Introduction */}
            <FadeIn delay={0} duration={0.5}>
              <Section>
                <Container>
                  <SectionHeading
                    title="Orígenes y Fundación"
                    description="Los orígenes del santuario"
                  />
                  <p className="text-muted-foreground">
                    La historia del Santuario de Nuestra Señora de Cocharcas se remonta a finales del siglo XVI,
                    cuando el indígena Francisco Tito Yupanqui, inspirado por la devoción a la Virgen de Copacabana,
                    decidió crear una réplica de la imagen sagrada. Tras un arduo viaje de más de 800 kilómetros,
                    logró traer la imagen a estas tierras, donde fue recibida con gran alegría y devoción por
                    la población local.
                  </p>
                  <p className="text-muted-foreground">
                    Este acto de fe marcó el comienzo de lo que hoy es uno de los centros religiosos más importantes
                    de los Andes peruanos.
                  </p>
                </Container>
              </Section>
            </FadeIn>

            {/* Historical Timeline */}
            <FadeIn delay={0.2} duration={0.5}>
              <Section>
                <Container>
                  <SectionHeading
                    title="Línea de Tiempo Histórica"
                    description="Acontecimientos importantes en la historia del santuario"
                  />
                  <HistoricalTimeline items={historicalEvents} />
                </Container>
              </Section>
            </FadeIn>

            {/* Detailed Sections */}
            <FadeIn delay={0.4} duration={0.5}>
              <Section className="bg-marfil">
                <Container>
                  <SectionHeading
                    title="Periodos Históricos"
                    description="Etapas significativas en el desarrollo del santuario"
                  />
                  <div className="space-y-8">
                    {historicalEvents.map((event, index) => (
                      <Reveal key={event.year} delay={index * 0.1} duration={0.3}>
                        <Card className="h-full flex flex-col">
                          <div className="p-4">
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                              {event.year} – {event.title}
                            </h3>
                            <p className="text-muted-foreground">{event.description}</p>
                          </div>
                        </Card>
                      </Reveal>
                    ))}
                  </div>
                </Container>
              </Section>
            </FadeIn>

            {/* Documents and Archives */}
            <FadeIn delay={0.6} duration={0.5}>
              <Section>
                <Container>
                  <SectionHeading
                    title="Archivo Histórico"
                    description="Documentos y archivos que cuentan nuestra historia"
                  />
                  <p className="text-muted-foreground">
                    El santuario posee un valioso archivo histórico que incluye documentos del siglo XVII,
                    como libros de bautismos, matrimonios y defunciones, así como correspondencia eclesiástica
                    y registros administrativos que permiten reconstruir la vida de la comunidad a lo largo de los siglos.
                  </p>
                  <p className="mt-4 text-muted-foreground">
                    Actualmente, el archivo se encuentra en proceso de organización y digitalización para su
                    conservación y puesta a disposición de investigadores y del público interesado.
                  </p>
                  <Link
                    href="/santuario/archivo-historico"
                    className="mt-6 inline-flex items-center rounded-md bg-dorado-oscuro px-4 py-2 text-sm font-medium text-blanco transition-normal hover:bg-dorado-oscuro/90"
                  >
                    Visitar el archivo histórico
                    <span className="ml-2" aria-hidden="true">→</span>
                  </Link>
                </Container>
              </Section>
            </FadeIn>

            {/* Call to Action */}
            <FadeIn delay={0.8} duration={0.5}>
              <Section className="bg-blanco">
                <Container className="py-12 text-center">
                  <h2 className="mb-6 text-2xl font-bold text-foreground">
                    Continúa explorando
                  </h2>
                  <p className="mx-auto mb-6 max-w-3xl text-lg text-muted-foreground">
                    La historia del santuario es vasta y fascinante. Te invitamos a descubrir más aspectos
                    de este importante patrimonio cultural y religioso.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href="/santuario/nuestra-senora"
                      className="flex items-center rounded-md bg-dorado-oscuro px-6 py-3 text-sm font-medium text-blanco transition-normal hover:bg-dorado-oscuro/90"
                    >
                      Nuestra Señora de Cocharcas
                      <span className="ml-2" aria-hidden="true">→</span>
                    </Link>
                    <Link
                      href="/santuario/arquitectura"
                      className="flex items-center rounded-md bg-dorado-oscuro px-6 py-3 text-sm font-medium text-blanco transition-normal hover:bg-dorado-oscuro/90"
                    >
                      Arquitectura y Detalles
                      <span className="ml-2" aria-hidden="true">→</span>
                    </Link>
                    <Link
                      href="/santuario/patrimonio"
                      className="flex items-center rounded-md bg-dorado-oscuro px-6 py-3 text-sm font-medium text-blanco transition-normal hover:bg-dorado-oscuro/90"
                    >
                      Patrimonio Cultural
                      <span className="ml-2" aria-hidden="true">→</span>
                    </Link>
                  </div>
                </Container>
              </Section>
            </FadeIn>
          </div>
        </Container>
      </section>
    </main>
  );
}

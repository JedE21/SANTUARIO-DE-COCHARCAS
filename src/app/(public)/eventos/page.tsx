import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import { Container, Section, SectionHeading, Badge, Card, EmptyState } from '@/components/public';
import { PageHero } from '@/components/public/page-hero';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';
import { getEventsList } from '@/lib/queries';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Eventos',
  description: 'Próximos eventos y celebraciones del Santuario de Cocharcas.',
  path: '/eventos',
});

function formatDate(value?: string | null) {
  if (!value) return '';
  return new Date(value + 'T00:00:00').toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function EventosPage() {
  const events = await getEventsList();
  const upcoming = events.filter((e) => new Date(e.start_date + 'T00:00:00') >= new Date());
  const past = events.filter((e) => new Date(e.start_date + 'T00:00:00') < new Date());
  const visible = upcoming.length ? upcoming : events;

  return (
    <main>
      <PageHero
        eyebrow="Eventos"
        title="Próximos eventos y celebraciones"
        description="Encuentros litúrgicos, peregrinaciones y actividades comunitarias."
      />

      <Section className="bg-background">
        <Container>
          <Reveal>
            <SectionHeading
              title={upcoming.length ? 'Agenda' : 'Eventos'}
              description="Programación de la comunidad."
            />
          </Reveal>
          {visible.length === 0 ? (
            <EmptyState
              className="mt-10"
              icon={<CalendarDays className="h-6 w-6" />}
              title="No hay eventos programados por el momento"
              description="Cuando se anuncien celebraciones y actividades aparecerán en esta sección."
            />
          ) : (
            <Stagger className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((event) => (
                <StaggerItem key={event.id} className="h-full">
                  <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <Link href={`/eventos/${event.slug}`} className="block">
                      <div className="relative aspect-video w-full overflow-hidden bg-muted/20">
                        <Image src={event.image_url || '/images/cocharcas-event.svg'} alt={event.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                      </div>
                      <div className="space-y-3 p-6">
                        <Badge variant="outline">{formatDate(event.start_date)}</Badge>
                        <h3 className="text-xl font-semibold text-azul transition-normal group-hover:text-carmesi">{event.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
                        {event.location ? <p className="text-xs uppercase tracking-wide text-carmesi">{event.location}</p> : null}
                      </div>
                    </Link>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          )}

          {past.length > 0 && (
            <>
              <Reveal>
                <SectionHeading className="mt-20" title="Eventos anteriores" />
              </Reveal>
              <Stagger className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {past.map((event) => (
                  <StaggerItem key={event.id} className="h-full">
                    <Card className="h-full p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                      <Link href={`/eventos/${event.slug}`}>
                        <p className="text-xs uppercase tracking-wide text-carmesi">{formatDate(event.start_date)}</p>
                        <h3 className="mt-2 text-lg font-semibold text-azul">{event.title}</h3>
                      </Link>
                    </Card>
                  </StaggerItem>
                ))}
              </Stagger>
            </>
          )}
        </Container>
      </Section>
    </main>
  );
}

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import { Container, Section, SectionHeading, Badge, Card, EmptyState } from '@/components/public';
import { Stagger, StaggerItem } from '@/components/motion';
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
      <Section className="bg-marfil">
        <Container className="py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Eventos</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl">Próximos eventos y celebraciones</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Encuentros litúrgicos, peregrinaciones y actividades comunitarias.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <SectionHeading
            title={upcoming.length ? 'Agenda' : 'Eventos'}
            description="Programación de la comunidad."
          />
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
                  <Card className="group h-full overflow-hidden">
                    <Link href={`/eventos/${event.slug}`} className="block">
                      <div className="relative aspect-video w-full overflow-hidden bg-muted/20">
                        <Image src={event.image_url || '/images/cocharcas-event.svg'} alt={event.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                      </div>
                      <div className="space-y-3 p-6">
                        <Badge variant="outline">{formatDate(event.start_date)}</Badge>
                        <h3 className="text-xl font-semibold group-hover:text-primary">{event.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
                        {event.location ? <p className="text-xs uppercase tracking-wide text-primary">{event.location}</p> : null}
                      </div>
                    </Link>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          )}

          {past.length > 0 && (
            <>
              <SectionHeading className="mt-20" title="Eventos anteriores" />
              <Stagger className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {past.map((event) => (
                  <StaggerItem key={event.id} className="h-full">
                    <Card className="h-full p-6">
                      <Link href={`/eventos/${event.slug}`}>
                        <p className="text-xs uppercase tracking-wide text-primary">{formatDate(event.start_date)}</p>
                        <h3 className="mt-2 text-lg font-semibold">{event.title}</h3>
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

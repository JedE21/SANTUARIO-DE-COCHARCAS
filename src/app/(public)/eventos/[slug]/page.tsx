import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Section, Badge, Card } from '@/components/public';
import { JsonLd } from '@/components/shared/json-ld';
import { getEventBySlug, getEventsList } from '@/lib/queries';
import { absoluteUrl, ogImagePath, pageMetadata } from '@/lib/seo';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  if (!event) return { title: 'Evento no encontrado', robots: { index: false } };
  return pageMetadata({
    title: event.seo_title || event.title,
    description: event.seo_description || event.description,
    path: `/eventos/${event.slug}`,
    images: event.image_url ? [{ url: event.image_url, alt: event.title }] : undefined,
  });
}

function formatDate(value: string) {
  return new Date(value + 'T00:00:00').toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function EventoPage({ params }: Props) {
  const [event, events] = await Promise.all([getEventBySlug(params.slug), getEventsList()]);
  if (!event) notFound();
  const related = events.filter((e) => e.id !== event.id).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.seo_description || event.description,
    url: absoluteUrl(`/eventos/${event.slug}`),
    image: event.image_url ? absoluteUrl(event.image_url) : absoluteUrl(ogImagePath),
    startDate: event.start_date,
    endDate: event.end_date || undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: event.location || 'Santuario de Nuestra Señora de Cocharcas',
      address: 'Cocharcas, Chincheros, Apurímac, Perú',
    },
    inLanguage: 'es-PE',
  };

  return (
    <main>
      <JsonLd data={jsonLd} />
      <Section className="bg-marfil">
        <Container className="py-16">
          <div className="mx-auto max-w-3xl">
            <Badge className="mb-4">Evento</Badge>
            <h1 className="text-4xl font-bold">{event.title}</h1>
            <p className="mt-4 text-sm text-muted-foreground">{formatDate(event.start_date)}{event.end_date ? ` — ${formatDate(event.end_date)}` : ''}</p>
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <article className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-border bg-card">
            {event.image_url && (
              <div className="relative aspect-video w-full overflow-hidden">
                <Image src={event.image_url} alt={event.title} fill sizes="(max-width: 768px) 100vw, 768px" priority className="object-cover" />
              </div>
            )}
            <div className="space-y-5 p-8">
              {event.location ? <p className="text-sm font-semibold uppercase tracking-wide text-primary">{event.location}</p> : null}
              <p className="leading-relaxed text-muted-foreground">{event.description}</p>
            </div>
          </article>

          {related.length > 0 && (
            <div className="mx-auto mt-16 max-w-5xl">
              <h2 className="text-2xl font-semibold">Más eventos</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {related.map((ev) => (
                  <Card key={ev.id} className="p-6">
                    <Link href={`/eventos/${ev.slug}`}>
                      <p className="text-xs uppercase tracking-wide text-primary">{formatDate(ev.start_date)}</p>
                      <h3 className="mt-2 text-lg font-semibold">{ev.title}</h3>
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

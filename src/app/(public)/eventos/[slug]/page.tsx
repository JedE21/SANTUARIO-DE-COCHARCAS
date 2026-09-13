import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Container, Section } from '@/components/public';
import { JsonLd } from '@/components/shared/json-ld';
import { FadeIn } from '@/components/motion';
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
  return new Date(value + 'T00:00:00').toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
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
        <Container>
          <div className="mx-auto max-w-3xl">
            <FadeIn>
              <p className="eyebrow text-tierra">
                Evento
                {event.start_date ? ` · ${formatDate(event.start_date)}` : ''}
                {event.end_date && event.end_date !== event.start_date
                  ? ` — ${formatDate(event.end_date)}`
                  : ''}
              </p>
              <h1 className="display-section mt-5 text-marron">{event.title}</h1>
              {event.location ? (
                <p className="mt-5 font-heading text-lg italic text-tierra">{event.location}</p>
              ) : null}
            </FadeIn>
            {event.image_url ? (
              <FadeIn delay={0.1} className="mt-10">
                <div className="relative aspect-[16/9] overflow-hidden bg-piedra/30">
                  <Image
                    src={event.image_url}
                    alt={event.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                  />
                </div>
              </FadeIn>
            ) : null}
          </div>
        </Container>
      </Section>

      <Section className="bg-blanco">
        <Container>
          <article className="mx-auto max-w-3xl">
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              {(event.description || 'Contenido próximamente disponible.')
                .split(/\n{2,}/)
                .filter(Boolean)
                .map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
            </div>
          </article>

          {related.length > 0 ? (
            <div className="mx-auto mt-20 max-w-4xl">
              <p className="eyebrow text-tierra">Más eventos</p>
              <ol className="mt-8 border-t border-tierra/20">
                {related.map((ev) => (
                  <li key={ev.id} className="border-b border-tierra/20">
                    <Link
                      href={`/eventos/${ev.slug}`}
                      className="group flex items-center justify-between gap-6 py-6"
                    >
                      <span>
                        <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-tierra">
                          {formatDate(ev.start_date)}
                        </span>
                        <span className="mt-1.5 block font-heading text-xl font-medium text-marron transition-colors duration-300 group-hover:text-dorado-oscuro sm:text-2xl">
                          {ev.title}
                        </span>
                      </span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-tierra/60 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-dorado-oscuro"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </Container>
      </Section>
    </main>
  );
}

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Container, Section } from '@/components/public';
import { JsonLd } from '@/components/shared/json-ld';
import { FadeIn } from '@/components/motion';
import { getFestivityBySlug, getFestivitiesList } from '@/lib/queries';
import { absoluteUrl, ogImagePath, pageMetadata } from '@/lib/seo';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const festivity = await getFestivityBySlug(params.slug);
  if (!festivity) return { title: 'Festividad no encontrada', robots: { index: false } };
  return pageMetadata({
    title: festivity.name,
    description: festivity.description,
    path: `/festividades/${festivity.slug}`,
    images: festivity.cover_image_url ? [{ url: festivity.cover_image_url, alt: festivity.name }] : undefined,
  });
}

function formatDate(value?: string | null) {
  if (!value) return '';
  return new Date(value + 'T00:00:00').toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function FestividadPage({ params }: Props) {
  const [festivity, all] = await Promise.all([
    getFestivityBySlug(params.slug),
    getFestivitiesList(),
  ]);
  if (!festivity) notFound();
  const related = all.filter((f) => f.id !== festivity.id).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Festival',
    name: festivity.name,
    description: festivity.description || undefined,
    url: absoluteUrl(`/festividades/${festivity.slug}`),
    image: festivity.cover_image_url ? absoluteUrl(festivity.cover_image_url) : absoluteUrl(ogImagePath),
    startDate: festivity.start_date || undefined,
    endDate: festivity.end_date || undefined,
    location: {
      '@type': 'Place',
      name: 'Santuario de Nuestra Señora de Cocharcas',
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
                Festividad
                {festivity.start_date ? ` · ${formatDate(festivity.start_date)}` : ''}
                {festivity.end_date && festivity.end_date !== festivity.start_date
                  ? ` — ${formatDate(festivity.end_date)}`
                  : ''}
              </p>
              <h1 className="display-section mt-5 text-marron">{festivity.name}</h1>
            </FadeIn>
            {festivity.cover_image_url ? (
              <FadeIn delay={0.1} className="mt-10">
                <div className="relative aspect-[16/9] overflow-hidden bg-piedra/30">
                  <Image
                    src={festivity.cover_image_url}
                    alt={festivity.name}
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
            {festivity.description ? (
              <p className="font-heading text-xl italic leading-relaxed text-marron sm:text-2xl">
                {festivity.description}
              </p>
            ) : null}
            {festivity.program ? (
              <div className="mt-10">
                <p className="eyebrow text-tierra">Programa</p>
                <div className="mt-5 space-y-4 border-t border-tierra/20 pt-6 text-lg leading-relaxed text-muted-foreground">
                  {festivity.program.split(/\n{2,}/).filter(Boolean).map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ) : null}
          </article>

          {related.length > 0 ? (
            <div className="mx-auto mt-20 max-w-4xl">
              <p className="eyebrow text-tierra">Otras festividades</p>
              <ol className="mt-8 border-t border-tierra/20">
                {related.map((f) => (
                  <li key={f.id} className="border-b border-tierra/20">
                    <Link
                      href={`/festividades/${f.slug}`}
                      className="group flex items-center justify-between gap-6 py-6"
                    >
                      <span>
                        <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-tierra">
                          {f.start_date ? formatDate(f.start_date) : 'Próximamente'}
                        </span>
                        <span className="mt-1.5 block font-heading text-xl font-medium text-marron transition-colors duration-300 group-hover:text-dorado-oscuro sm:text-2xl">
                          {f.name}
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

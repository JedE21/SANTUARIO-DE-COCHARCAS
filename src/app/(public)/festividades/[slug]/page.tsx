import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Section, Badge, Card } from '@/components/public';
import { JsonLd } from '@/components/shared/json-ld';
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
  return new Date(value + 'T00:00:00').toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function FestividadPage({ params }: Props) {
  const [festivity, all] = await Promise.all([getFestivityBySlug(params.slug), getFestivitiesList()]);
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
        <Container className="py-16">
          <div className="mx-auto max-w-3xl">
            <Badge className="mb-4">Festividad</Badge>
            <h1 className="text-4xl font-bold">{festivity.name}</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              {festivity.start_date ? formatDate(festivity.start_date) : ''}{festivity.end_date ? ` — ${formatDate(festivity.end_date)}` : ''}
            </p>
          </div>
        </Container>
      </Section>
      <Section className="bg-background">
        <Container>
          <article className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-border bg-card">
            {festivity.cover_image_url && (
              <div className="relative aspect-video w-full overflow-hidden">
                <Image src={festivity.cover_image_url} alt={festivity.name} fill sizes="(max-width: 768px) 100vw, 768px" priority className="object-cover" />
              </div>
            )}
            <div className="space-y-5 p-8">
              {festivity.description && <p className="text-lg text-muted-foreground">{festivity.description}</p>}
              {festivity.program && (
                <div>
                  <h2 className="text-xl font-semibold">Programa</h2>
                  <p className="mt-2 whitespace-pre-line text-muted-foreground">{festivity.program}</p>
                </div>
              )}
            </div>
          </article>

          {related.length > 0 && (
            <div className="mx-auto mt-16 max-w-5xl">
              <h2 className="text-2xl font-semibold">Otras festividades</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {related.map((f) => (
                  <Card key={f.id} className="p-6">
                    <Link href={`/festividades/${f.slug}`}>
                      <p className="text-xs uppercase tracking-wide text-primary">{f.start_date ? formatDate(f.start_date) : 'Próximamente'}</p>
                      <h3 className="mt-2 text-lg font-semibold">{f.name}</h3>
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

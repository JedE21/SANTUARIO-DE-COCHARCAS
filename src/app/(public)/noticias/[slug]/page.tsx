import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Section, Badge, Card } from '@/components/public';
import { JsonLd } from '@/components/shared/json-ld';
import { getNewsBySlug, getNewsList, getNewsCategories } from '@/lib/queries';
import { absoluteUrl, ogImagePath, pageMetadata, siteName } from '@/lib/seo';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getNewsBySlug(params.slug);
  if (!item) return { title: 'Noticia no encontrada', robots: { index: false } };
  return pageMetadata({
    title: item.seo_title || item.title,
    description: item.seo_description || item.excerpt || item.content,
    path: `/noticias/${item.slug}`,
    type: 'article',
    images: item.cover_image_url ? [{ url: item.cover_image_url, alt: item.title }] : undefined,
  });
}

function formatDate(value?: string | null) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function NoticiaPage({ params }: Props) {
  const [item, news, categories] = await Promise.all([getNewsBySlug(params.slug), getNewsList(4), getNewsCategories()]);
  if (!item) notFound();
  const category = categories.find((c) => c.id === item.category_id);
  const related = news.filter((n) => n.id !== item.id).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    description: item.excerpt || item.seo_description || undefined,
    image: item.cover_image_url ? [item.cover_image_url] : [absoluteUrl(ogImagePath)],
    datePublished: item.published_at || undefined,
    dateModified: item.updated_at || item.published_at || undefined,
    inLanguage: 'es-PE',
    mainEntityOfPage: absoluteUrl(`/noticias/${item.slug}`),
    author: { '@type': 'Organization', name: siteName, url: absoluteUrl('/') },
    publisher: { '@type': 'Organization', name: siteName, url: absoluteUrl('/') },
  };

  return (
    <main>
      <JsonLd data={jsonLd} />
      <Section className="bg-marfil">
        <Container className="py-16">
          <div className="mx-auto max-w-3xl">
            <Badge className="mb-4">{category?.name || 'Noticia'}</Badge>
            <h1 className="text-4xl font-bold">{item.title}</h1>
            <p className="mt-4 text-sm text-muted-foreground">{formatDate(item.published_at)}</p>
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <article className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-border bg-card">
            {item.cover_image_url && (
              <div className="relative aspect-video w-full overflow-hidden">
                <Image src={item.cover_image_url} alt={item.title} fill sizes="(max-width: 768px) 100vw, 768px" priority className="object-cover" />
              </div>
            )}
            <div className="space-y-5 p-8">
              {item.excerpt ? <p className="text-lg font-medium text-foreground">{item.excerpt}</p> : null}
              <p className="leading-relaxed text-muted-foreground">{item.content || 'Contenido próximamente disponible.'}</p>
            </div>
          </article>

          {related.length > 0 && (
            <div className="mx-auto mt-16 max-w-5xl">
              <h2 className="text-2xl font-semibold">Otras noticias</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {related.map((n) => (
                  <Card key={n.id} className="overflow-hidden">
                    <Link href={`/noticias/${n.slug}`} className="block p-6">
                      <Badge variant="outline" className="mb-3">{categories.find((c) => c.id === n.category_id)?.name || 'Noticia'}</Badge>
                      <h3 className="text-lg font-semibold">{n.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{n.excerpt || n.content}</p>
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

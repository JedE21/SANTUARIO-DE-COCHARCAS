import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Container, Section } from '@/components/public';
import { JsonLd } from '@/components/shared/json-ld';
import { FadeIn } from '@/components/motion';
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
  return new Date(value)
    .toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace(/\./g, '')
    .toUpperCase();
}

export default async function NoticiaPage({ params }: Props) {
  const [item, news, categories] = await Promise.all([
    getNewsBySlug(params.slug),
    getNewsList(4),
    getNewsCategories(),
  ]);
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

      {/* Cabecera editorial del artículo */}
      <Section className="bg-marfil">
        <Container>
          <div className="mx-auto max-w-3xl">
            <FadeIn>
              <p className="eyebrow text-tierra">
                {category?.name || 'Noticia'}
                {item.published_at ? ` · ${formatDate(item.published_at)}` : ''}
              </p>
              <h1 className="display-section mt-5 text-marron">{item.title}</h1>
            </FadeIn>
            {item.cover_image_url ? (
              <FadeIn delay={0.1} className="mt-10">
                <div className="relative aspect-[16/9] overflow-hidden bg-piedra/30">
                  <Image
                    src={item.cover_image_url}
                    alt={item.title}
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

      {/* Cuerpo del artículo */}
      <Section className="bg-blanco">
        <Container>
          <article className="mx-auto max-w-3xl">
            {item.excerpt ? (
              <p className="font-heading text-xl italic leading-relaxed text-marron sm:text-2xl">
                {item.excerpt}
              </p>
            ) : null}
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-muted-foreground">
              {(item.content || 'Contenido próximamente disponible.')
                .split(/\n{2,}/)
                .filter(Boolean)
                .map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
            </div>
          </article>

          {related.length > 0 ? (
            <div className="mx-auto mt-20 max-w-4xl">
              <p className="eyebrow text-tierra">Continúa leyendo</p>
              <ol className="mt-8 border-t border-tierra/20">
                {related.map((n) => (
                  <li key={n.id} className="border-b border-tierra/20">
                    <Link
                      href={`/noticias/${n.slug}`}
                      className="group flex items-center justify-between gap-6 py-6"
                    >
                      <span>
                        <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-tierra">
                          {formatDate(n.published_at)}
                        </span>
                        <span className="mt-1.5 block font-heading text-xl font-medium text-marron transition-colors duration-300 group-hover:text-dorado-oscuro sm:text-2xl">
                          {n.title}
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

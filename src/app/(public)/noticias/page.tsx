import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Newspaper } from 'lucide-react';
import { Container, Section, EmptyState } from '@/components/public';
import { PageHero } from '@/components/public/page-hero';
import { SectionSlider } from '@/components/public/section-slider';
import { FadeIn, Reveal } from '@/components/motion';
import { getNewsList, getNewsCategories, getSlidesBySection } from '@/lib/queries';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Noticias',
  description: 'Noticias y novedades de la comunidad del Santuario de Cocharcas.',
  path: '/noticias',
});

function formatDate(value?: string | null) {
  if (!value) return 'Próximamente';
  return new Date(value)
    .toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace(/\./g, '')
    .toUpperCase();
}

export default async function NoticiasPage() {
  const [news, categories, slides] = await Promise.all([getNewsList(30), getNewsCategories(), getSlidesBySection('noticias')]);
  const featured = news.find((n) => n.is_featured);
  const rest = news.filter((n) => n.id !== featured?.id);
  const list = featured ? rest : news;

  return (
    <main>
      {/* Carrusel de fotografías de la sección: protagonista en lugar de la banda marrón */}
      {slides.length > 0 ? (
        <SectionSlider slides={slides} label="Noticias" priority fullScreen />
      ) : (
        <PageHero
          eyebrow="Noticias"
          title="Últimas noticias del santuario"
          description="Novedades pastorales, culturales y patrimoniales de la comunidad de Cocharcas."
        />
      )}
      <h1 className="sr-only">Últimas noticias del santuario</h1>

      <Section className="bg-marfil">
        <Container>
          {news.length === 0 ? (
            <EmptyState
              icon={<Newspaper className="h-6 w-6" />}
              title="Aún no hay noticias publicadas"
              description="Cuando se publiquen novedades del santuario aparecerán en esta sección."
            />
          ) : (
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
              {/* Columna editorial: lista numerada de artículos */}
              <div className="lg:col-span-7 lg:order-2">
                <ol className="border-t border-tierra/20">
                  {list.map((item, i) => {
                    const category = categories.find((c) => c.id === item.category_id);
                    return (
                      <Reveal key={item.id} delay={Math.min(i * 0.06, 0.3)}>
                        <li className="border-b border-tierra/20">
                          <Link
                            href={`/noticias/${item.slug}`}
                            className="group grid gap-3 py-8 sm:grid-cols-[3rem_1fr_auto] sm:items-baseline sm:gap-8"
                          >
                            <span className="font-heading text-lg tabular-nums text-tierra/70">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span>
                              <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-tierra">
                                {formatDate(item.published_at)}
                                {category ? ` · ${category.name}` : ''}
                              </span>
                              <span className="mt-2 block font-heading text-2xl font-medium leading-snug text-marron transition-colors duration-300 group-hover:text-dorado-oscuro sm:text-3xl">
                                {item.title}
                              </span>
                              {item.excerpt ? (
                                <span className="mt-2 line-clamp-2 block max-w-xl text-sm leading-relaxed text-muted-foreground">
                                  {item.excerpt}
                                </span>
                              ) : null}
                            </span>
                            <ArrowRight
                              className="hidden h-4 w-4 text-tierra/60 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-dorado-oscuro sm:block"
                              aria-hidden="true"
                            />
                          </Link>
                        </li>
                      </Reveal>
                    );
                  })}
                </ol>
              </div>

              {/* Noticia destacada: imagen protagonista */}
              {featured ? (
                <FadeIn className="lg:col-span-5 lg:order-1">
                  <div className="lg:sticky lg:top-28">
                    <p className="eyebrow text-tierra">Destacada</p>
                    <Link href={`/noticias/${featured.slug}`} className="group mt-6 block">
                      <div className="relative aspect-[4/5] overflow-hidden bg-piedra/40 sm:aspect-[4/3]">
                        <Image
                          src={featured.cover_image_url || '/images/santuario/santuario-plaza.jpg'}
                          alt={featured.title}
                          fill
                          priority
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          className="img-zoom object-cover"
                        />
                      </div>
                      <p className="mt-5 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-tierra">
                        {formatDate(featured.published_at)}
                      </p>
                      <h2 className="mt-2 font-heading text-3xl font-medium leading-tight text-marron transition-colors duration-300 group-hover:text-dorado-oscuro">
                        {featured.title}
                      </h2>
                      {featured.excerpt ? (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{featured.excerpt}</p>
                      ) : null}
                      <span className="group mt-5 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-marron transition-colors duration-300 hover:text-dorado-oscuro">
                        <span className="border-b border-marron/30 pb-1.5 transition-colors duration-300 group-hover:border-dorado">
                          Leer la noticia
                        </span>
                        <ArrowRight
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </div>
                </FadeIn>
              ) : null}
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}

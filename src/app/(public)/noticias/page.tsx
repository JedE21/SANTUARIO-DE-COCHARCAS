import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Newspaper } from 'lucide-react';
import { Container, Section, SectionHeading, Badge, Card, EmptyState } from '@/components/public';
import { FadeIn, Stagger, StaggerItem } from '@/components/motion';
import { getNewsList, getNewsCategories } from '@/lib/queries';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Noticias',
  description: 'Noticias y novedades de la comunidad del Santuario de Cocharcas.',
  path: '/noticias',
});

function formatDate(value?: string | null) {
  if (!value) return 'Próximamente';
  return new Date(value).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function NoticiasPage() {
  const [news, categories] = await Promise.all([getNewsList(30), getNewsCategories()]);
  const featured = news.find((n) => n.is_featured);
  const rest = news.filter((n) => n.id !== featured?.id);

  return (
    <main>
      <Section className="bg-marfil">
        <Container className="py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Noticias</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl">Últimas noticias del santuario</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Novedades pastorales, culturales y patrimoniales de la comunidad de Cocharcas.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          {featured && (
            <FadeIn>
              <Link href={`/noticias/${featured.slug}`} className="group mb-12 grid overflow-hidden rounded-xl border border-border bg-card md:grid-cols-2">
                <div className="relative aspect-video w-full overflow-hidden bg-muted/20">
                  <Image src={featured.cover_image_url || '/images/cocharcas-news.svg'} alt={featured.title} fill sizes="(max-width: 768px) 100vw, 50vw" priority className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-center p-8">
                  <Badge variant="outline" className="mb-4 self-start">Destacada</Badge>
                  <h2 className="text-3xl font-semibold text-foreground">{featured.title}</h2>
                  <p className="mt-3 text-muted-foreground">{featured.excerpt || featured.content}</p>
                  <p className="mt-4 text-xs uppercase tracking-wide text-primary">{formatDate(featured.published_at)}</p>
                </div>
              </Link>
            </FadeIn>
          )}

          <SectionHeading
            title="Todas las noticias"
            description="Mantente al día con la vida del santuario."
          />

          {(featured ? rest : news).length === 0 ? (
            <EmptyState
              className="mt-10"
              icon={<Newspaper className="h-6 w-6" />}
              title="Aún no hay noticias publicadas"
              description="Cuando se publiquen novedades del santuario aparecerán en esta sección."
            />
          ) : (
            <Stagger className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(featured ? rest : news).map((item) => {
                const category = categories.find((c) => c.id === item.category_id);
                return (
                  <StaggerItem key={item.id} className="h-full">
                    <Card className="group h-full overflow-hidden">
                      <Link href={`/noticias/${item.slug}`} className="block">
                        <div className="relative aspect-video w-full overflow-hidden bg-muted/20">
                          <Image src={item.cover_image_url || '/images/cocharcas-news.svg'} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <div className="space-y-3 p-6">
                          <div className="flex items-center gap-2">
                            {category ? <Badge variant="outline">{category.name}</Badge> : null}
                            <span className="text-xs text-muted-foreground">{formatDate(item.published_at)}</span>
                          </div>
                          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary">{item.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.excerpt || item.content}</p>
                        </div>
                      </Link>
                    </Card>
                  </StaggerItem>
                );
              })}
            </Stagger>
          )}
        </Container>
      </Section>
    </main>
  );
}

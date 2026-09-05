import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Container, Section, SectionHeading, Badge, Card, EmptyState } from '@/components/public';
import { PageHero } from '@/components/public/page-hero';
import { Stagger, StaggerItem, Reveal } from '@/components/motion';
import { getFestivitiesList } from '@/lib/queries';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Festividades',
  description: 'Festividades y celebraciones del Santuario de Cocharcas.',
  path: '/festividades',
});

function formatDate(value?: string | null) {
  if (!value) return '';
  return new Date(value + 'T00:00:00').toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function FestividadesPage() {
  const festivities = await getFestivitiesList();
  return (
    <main>
      <PageHero
        eyebrow="Festividades"
        title="Celebraciones y fiestas patronales"
        description="Jornadas de fe, cultura y encuentro comunitario que dan vida al santuario."
      />
      <Section className="bg-background">
        <Container>
          <Reveal>
            <SectionHeading title="Festividades" description="Calendario de las celebraciones principales." />
          </Reveal>
          {festivities.length === 0 ? (
            <EmptyState
              className="mt-10"
              icon={<Sparkles className="h-6 w-6" />}
              title="Aún no hay festividades publicadas"
              description="El calendario de celebraciones se anunciará en esta sección."
            />
          ) : (
            <Stagger className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {festivities.map((festivity) => (
                <StaggerItem key={festivity.id} className="h-full">
                  <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <Link href={`/festividades/${festivity.slug}`} className="block">
                      <div className="relative aspect-video w-full overflow-hidden bg-muted/20">
                        <Image src={festivity.cover_image_url || '/images/cocharcas-hero.svg'} alt={festivity.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                      </div>
                      <div className="space-y-3 p-6">
                        <Badge variant="outline">{festivity.start_date ? formatDate(festivity.start_date) : 'Próximamente'}</Badge>
                        <h3 className="text-xl font-semibold text-azul transition-normal group-hover:text-carmesi">{festivity.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">{festivity.description}</p>
                      </div>
                    </Link>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </Container>
      </Section>
    </main>
  );
}

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Section, SectionHeading, Card, Button } from '@/components/public';
import { PageHero } from '@/components/public/page-hero';
import { Reveal } from '@/components/motion';
import { getSacraments } from '@/lib/queries';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Sacramentos',
  description: 'Información sobre bautismo, confirmación, matrimonio y más.',
  path: '/fe/sacramentos',
});

export default async function SacramentosPage() {
  const sacraments = await getSacraments();
  return (
    <main>
      <PageHero
        eyebrow="Vida de fe"
        title="Sacramentos"
        description="Información y orientación para recibir los sacramentos en el santuario."
      />
      <Section className="bg-background">
        <Container>
          <Reveal>
            <SectionHeading title="Preparación sacramental" />
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {sacraments.map((sacrament) => (
              <Card key={sacrament.id} className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex min-h-40 flex-col">
                  {sacrament.image_url && (
                    <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-md bg-muted/20">
                      <Image src={sacrament.image_url} alt={sacrament.name} fill sizes="80px" className="object-cover" />
                    </div>
                  )}
                  <h2 className="font-heading text-xl font-semibold text-azul">{sacrament.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{sacrament.description}</p>
                  <Link href={`/fe/sacramentos/${sacrament.slug}`} className="link-editorial mt-6 inline-flex items-center text-sm font-medium text-primary">
                    Ver más <span className="ml-2" aria-hidden="true">→</span>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button asChild>
              <Link href="/solicitudes/sacramentos">Solicitar un sacramento</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}

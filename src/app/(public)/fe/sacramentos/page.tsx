import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Section, SectionHeading, Badge, Card, Button } from '@/components/public';
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
      <Section className="bg-marfil">
        <Container className="py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Vida de fe</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl">Sacramentos</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Información y orientación para recibir los sacramentos en el santuario.
            </p>
          </div>
        </Container>
      </Section>
      <Section className="bg-background">
        <Container>
          <SectionHeading title="Preparación sacramental" />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {sacraments.map((sacrament) => (
              <Card key={sacrament.id} className="p-6">
                <div className="flex min-h-40 flex-col">
                  {sacrament.image_url && (
                    <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-md bg-muted/20">
                      <Image src={sacrament.image_url} alt={sacrament.name} fill sizes="80px" className="object-cover" />
                    </div>
                  )}
                  <h2 className="text-xl font-semibold">{sacrament.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{sacrament.description}</p>
                  <Link href={`/fe/sacramentos/${sacrament.slug}`} className="mt-6 inline-flex items-center text-sm font-medium text-primary">
                    Ver más <span className="ml-2">→</span>
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

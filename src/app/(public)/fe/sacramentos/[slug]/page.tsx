import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Section, Badge, Card, Button } from '@/components/public';
import { getSacramentBySlug } from '@/lib/queries';
import { pageMetadata } from '@/lib/seo';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sacrament = await getSacramentBySlug(params.slug);
  if (!sacrament) return { title: 'Sacramento no encontrado', robots: { index: false } };
  return pageMetadata({
    title: sacrament.name,
    description: sacrament.description,
    path: `/fe/sacramentos/${sacrament.slug}`,
    images: sacrament.image_url ? [{ url: sacrament.image_url, alt: sacrament.name }] : undefined,
  });
}

export default async function SacramentDetailPage({ params }: Props) {
  const sacrament = await getSacramentBySlug(params.slug);
  if (!sacrament) notFound();

  return (
    <main>
      <Section className="bg-marfil">
        <Container className="py-16">
          <div className="mx-auto max-w-3xl">
            <Badge className="mb-4">Sacramento</Badge>
            <h1 className="text-4xl font-bold">{sacrament.name}</h1>
          </div>
        </Container>
      </Section>
      <Section className="bg-background">
        <Container>
          <Card className="mx-auto max-w-3xl overflow-hidden">
            {sacrament.image_url && (
              <div className="relative aspect-video w-full overflow-hidden">
                <Image src={sacrament.image_url} alt={sacrament.name} fill sizes="(max-width: 768px) 100vw, 768px" priority className="object-cover" />
              </div>
            )}
            <div className="space-y-5 p-8">
              {sacrament.description ? <p className="text-lg text-muted-foreground">{sacrament.description}</p> : null}
              {sacrament.requirements ? (
                <div>
                  <h2 className="text-xl font-semibold">Requisitos y orientación</h2>
                  <p className="mt-2 text-muted-foreground">{sacrament.requirements}</p>
                </div>
              ) : null}
              <div className="pt-2">
                <Button asChild>
                  <Link href="/solicitudes/sacramentos">Solicitar este sacramento</Link>
                </Button>
              </div>
            </div>
          </Card>
        </Container>
      </Section>
    </main>
  );
}

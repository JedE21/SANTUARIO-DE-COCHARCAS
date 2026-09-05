import type { Metadata } from 'next';
import { Container, Section, Badge, SectionHeading } from '@/components/public';
import { TrackingForm } from '@/components/forms/TrackingForm';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Seguimiento de solicitudes',
  description: 'Consulta el estado de tu solicitud pastoral usando tu código.',
  path: '/solicitudes/seguimiento',
  noIndex: true,
});

export default function SeguimientoPage() {
  return (
    <main>
      <Section className="bg-marfil">
        <Container className="py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Seguimiento</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl">Consulta el estado de tu solicitud</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Ingresa el código que recibiste al enviar tu solicitud.
            </p>
          </div>
        </Container>
      </Section>
      <Section className="bg-background">
        <Container className="flex justify-center">
          <TrackingForm />
        </Container>
      </Section>
    </main>
  );
}

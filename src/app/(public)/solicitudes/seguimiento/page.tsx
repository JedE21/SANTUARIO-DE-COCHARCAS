import type { Metadata } from 'next';
import { Container, Section } from '@/components/public';
import { PageHero } from '@/components/public/page-hero';
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
      <PageHero
        eyebrow="Seguimiento"
        title="Consulta el estado de tu solicitud"
        description="Ingresa el código que recibiste al enviar tu solicitud."
      />
      <Section className="bg-background">
        <Container className="flex justify-center">
          <TrackingForm />
        </Container>
      </Section>
    </main>
  );
}

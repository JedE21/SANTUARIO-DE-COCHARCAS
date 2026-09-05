import type { Metadata } from 'next';
import { Container, Section } from '@/components/public';
import { PageHero } from '@/components/public/page-hero';
import { MassRequestForm } from '@/components/forms/MassRequestForm';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Solicitar una misa',
  description: 'Envía una intención de misa al Santuario de Cocharcas.',
  path: '/solicitudes/misa',
});

export default function SolicitarMisaPage() {
  return (
    <main>
      <PageHero
        eyebrow="Solicitudes"
        title="Solicitar una misa"
        description="Completa la información y la coordinación pastoral confirmará la intención."
      />
      <Section className="bg-background">
        <Container className="max-w-3xl">
          <MassRequestForm />
        </Container>
      </Section>
    </main>
  );
}

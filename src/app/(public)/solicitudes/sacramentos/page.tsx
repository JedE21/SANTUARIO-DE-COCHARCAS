import type { Metadata } from 'next';
import { Container, Section } from '@/components/public';
import { PageHero } from '@/components/public/page-hero';
import { SacramentRequestForm } from '@/components/forms/SacramentRequestForm';
import { getSacraments } from '@/lib/queries';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Solicitar un sacramento',
  description: 'Inicia tu solicitud pastoral para un sacramento.',
  path: '/solicitudes/sacramentos',
});

export default async function SolicitarSacramentoPage() {
  const sacraments = await getSacraments();
  return (
    <main>
      <PageHero
        eyebrow="Solicitudes"
        title="Solicitar un sacramento"
        description="El equipo pastoral te contactará para orientar la preparación."
      />
      <Section className="bg-background">
        <Container className="max-w-3xl">
          <SacramentRequestForm sacraments={sacraments} />
        </Container>
      </Section>
    </main>
  );
}

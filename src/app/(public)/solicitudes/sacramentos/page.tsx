import type { Metadata } from 'next';
import { Container, Section, Badge } from '@/components/public';
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
      <Section className="bg-marfil">
        <Container className="py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Solicitudes</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl">Solicitar un sacramento</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              El equipo pastoral te contactará para orientar la preparación.
            </p>
          </div>
        </Container>
      </Section>
      <Section className="bg-background">
        <Container className="max-w-3xl">
          <SacramentRequestForm sacraments={sacraments} />
        </Container>
      </Section>
    </main>
  );
}

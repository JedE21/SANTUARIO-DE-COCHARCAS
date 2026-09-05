import type { Metadata } from 'next';
import { Container, Section, Badge } from '@/components/public';
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
      <Section className="bg-marfil">
        <Container className="py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Solicitudes</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl">Solicitar una misa</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Completa la información y la coordinación pastoral confirmará la intención.
            </p>
          </div>
        </Container>
      </Section>
      <Section className="bg-background">
        <Container className="max-w-3xl">
          <MassRequestForm />
        </Container>
      </Section>
    </main>
  );
}

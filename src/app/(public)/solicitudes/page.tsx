import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, SectionHeading, Badge, Card } from '@/components/public';
import { Stagger, StaggerItem } from '@/components/motion';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Solicitudes pastorales',
  description: 'Solicita misas, sacramentos y consulta el estado de tus solicitudes.',
  path: '/solicitudes',
});

const options = [
  { title: 'Solicitar una misa', href: '/solicitudes/misa', description: 'Envía una intención para una celebración eucarística.' },
  { title: 'Solicitar un sacramento', href: '/solicitudes/sacramentos', description: 'Inicia la preparación para bautismo, confirmación, matrimonio o primera comunión.' },
  { title: 'Seguimiento de solicitudes', href: '/solicitudes/seguimiento', description: 'Consulta el estado de tu solicitud con tu código.' },
];

export default function SolicitudesPage() {
  return (
    <main>
      <Section className="bg-marfil">
        <Container className="py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Pastoral</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl">Solicitudes pastorales</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Gestiona tus pedidos de misa, sacramentos y sigue su estado de forma sencilla.
            </p>
          </div>
        </Container>
      </Section>
      <Section className="bg-background">
        <Container>
          <SectionHeading title="Opciones" />
          <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
            {options.map((option) => (
              <StaggerItem key={option.href} className="h-full">
                <Card className="h-full p-6">
                  <h2 className="text-xl font-semibold">{option.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{option.description}</p>
                  <Link href={option.href} className="mt-6 inline-flex items-center text-sm font-medium text-primary">
                    Ir a la solicitud <span className="ml-2">→</span>
                  </Link>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>
    </main>
  );
}

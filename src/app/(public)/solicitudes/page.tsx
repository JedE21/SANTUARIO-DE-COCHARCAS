import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, SectionHeading, Card } from '@/components/public';
import { PageHero } from '@/components/public/page-hero';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';
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
      <PageHero
        eyebrow="Pastoral"
        title="Solicitudes pastorales"
        description="Gestiona tus pedidos de misa, sacramentos y sigue su estado de forma sencilla."
      />
      <Section className="bg-background">
        <Container>
          <Reveal>
            <SectionHeading title="Opciones" />
          </Reveal>
          <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
            {options.map((option) => (
              <StaggerItem key={option.href} className="h-full">
                <Card className="h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <h2 className="font-heading text-xl font-semibold text-azul">{option.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{option.description}</p>
                  <Link href={option.href} className="link-editorial mt-6 inline-flex items-center text-sm font-medium text-primary">
                    Ir a la solicitud <span className="ml-2" aria-hidden="true">→</span>
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

import type { Metadata } from 'next';
import { Container, Section, SectionHeading, Link, Button, Card } from '@/components/public';
import { PageHero } from '@/components/public/page-hero';
import { Reveal, Stagger } from '@/components/motion';
import { pageMetadata } from '@/lib/seo';

const feSections = [
  {
    title: 'Horarios de Misa',
    href: '/fe/misas',
    description: 'Consulta los horarios de la Eucaristía y las celebraciones dominicales.',
  },
  {
    title: 'Sacramentos',
    href: '/fe/sacramentos',
    description: 'Información sobre bautismo, confirmación, matrimonio y más.',
  },
  {
    title: 'Solicitar Misa',
    href: '/fe/solicitar-misa',
    description: 'Envía una intención especial para una celebración eucarística.',
  },
  {
    title: 'Solicitar Sacramento',
    href: '/fe/solicitar-sacramento',
    description: 'Inicia tu solicitud con orientación pastoral y comunitaria.',
  },
];

export const metadata: Metadata = pageMetadata({
  title: 'Vida de fe',
  description: 'Vida sacramental, celebraciones y acompañamiento pastoral en Cocharcas.',
  path: '/fe',
});

export default function FELandingPage() {
  return (
    <main>
      <PageHero
        eyebrow="Vida de fe"
        title="Camina con la comunidad del santuario"
        description="Un lugar para celebrar, pedir, agradecer y crecer en la fe con acompañamiento pastoral."
      />

      <Section className="bg-background">
        <Container>
          <Reveal>
            <SectionHeading
              title="Áreas de la vida de fe"
              description="Accesos directos a los espacios más solicitados por la comunidad."
            />
          </Reveal>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href="/fe/misas">Ver horarios</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/fe/sacramentos">Explorar sacramentos</Link>
            </Button>
          </div>
          <Stagger className="mt-12 grid gap-6 md:grid-cols-2">
            {feSections.map((section) => (
              <Card key={section.href} className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <h2 className="font-heading text-2xl font-semibold text-azul">{section.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground">{section.description}</p>
                <Link href={section.href} className="link-editorial mt-6 inline-flex items-center text-sm font-medium text-primary">
                  Abrir sección
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
                </Link>
              </Card>
            ))}
          </Stagger>
        </Container>
      </Section>
    </main>
  );
}

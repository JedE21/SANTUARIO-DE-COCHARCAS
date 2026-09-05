import type { Metadata } from 'next';
import { Container, Section, SectionHeading, Link, Button, Card, Badge } from '@/components/public';
import { FadeIn, Stagger } from '@/components/motion';
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
      <Section className="bg-gradient-to-br from-marfil via-background to-blanco">
        <Container className="py-20">
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn>
              <Badge className="mb-4">Vida de fe</Badge>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="text-4xl font-bold sm:text-5xl">Camina con la comunidad del santuario</h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-6 text-lg text-muted-foreground">
                Un lugar para celebrar, pedir, agradecer y crecer en la fe con acompañamiento pastoral.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button asChild>
                  <Link href="/fe/misas">Ver horarios</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/fe/sacramentos">Explorar sacramentos</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <SectionHeading
            title="Áreas de la vida de fe"
            description="Accesos directos a los espacios más solicitados por la comunidad."
          />
          <Stagger className="mt-10 grid gap-6 md:grid-cols-2">
            {feSections.map((section) => (
              <Card key={section.href} className="p-6">
                <h2 className="text-2xl font-semibold">{section.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground">{section.description}</p>
                <Link href={section.href} className="mt-6 inline-flex items-center text-sm font-medium text-primary">
                  Abrir sección
                  <span className="ml-2" aria-hidden="true">→</span>
                </Link>
              </Card>
            ))}
          </Stagger>
        </Container>
      </Section>
    </main>
  );
}

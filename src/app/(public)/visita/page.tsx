import type { Metadata } from 'next';
import { CalendarDays, MapPin, Phone } from 'lucide-react';
import { Container, Section, SectionHeading, Badge, Card, Link, Button } from '@/components/public';
import { Stagger, StaggerItem } from '@/components/motion';
import { MassSchedule } from '@/components/shared/mass-schedule';
import { getMassSchedules, getSiteSettings } from '@/lib/queries';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Planifica tu visita',
  description:
    'Ubicación, cómo llegar y qué visitar en el Santuario de Nuestra Señora de Cocharcas, Chincheros, Apurímac.',
  path: '/visita',
});

export default async function VisitaPage() {
  const [settings, schedules] = await Promise.all([getSiteSettings(), getMassSchedules()]);

  const infoCards = [
    {
      icon: MapPin,
      title: 'Ubicación',
      description: settings.address || 'Cocharcas, Chincheros, Apurímac, Perú',
    },
    {
      icon: Phone,
      title: 'Contacto',
      description: [settings.phone, settings.email].filter(Boolean).join(' · ') || 'Consulta la sección de contacto.',
    },
    {
      icon: CalendarDays,
      title: 'Festividades',
      description: 'Las celebraciones principales se congregan especialmente en septiembre.',
    },
  ];

  return (
    <main>
      <Section className="bg-marfil">
        <Container className="py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Visita</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl">Planifica tu visita</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Información esencial para peregrinos, turistas y visitantes del santuario.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <SectionHeading title="Información práctica" description="Datos clave para organizar tu llegada." />
          <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
            {infoCards.map((card) => (
              <StaggerItem key={card.title}>
                <Card className="h-full p-6">
                  <card.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="mt-4 text-lg font-semibold">{card.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section className="bg-marfil">
        <Container>
          <SectionHeading
            title="Horarios de celebración"
            description="Horarios administrados por la coordinación pastoral del santuario."
          />
          <div className="mt-10">
            <MassSchedule items={schedules} title="" />
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container className="text-center">
          <h2 className="text-2xl font-semibold">¿Necesitas orientación pastoral?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Puedes solicitar una misa o un sacramento antes de tu visita.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href="/solicitudes">Solicitudes pastorales</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contacto">Contacto</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}

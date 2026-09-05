import type { Metadata } from 'next';
import { CalendarDays, MapPin, Phone } from 'lucide-react';
import { Container, Section, SectionHeading, Card, Link, Button } from '@/components/public';
import { PageHero } from '@/components/public/page-hero';
import { Stagger, StaggerItem, Reveal } from '@/components/motion';
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
      <PageHero
        eyebrow="Visita"
        title="Planifica tu visita"
        description="Información esencial para peregrinos, turistas y visitantes del santuario."
      />

      <Section className="bg-background">
        <Container>
          <Reveal>
            <SectionHeading title="Información práctica" description="Datos clave para organizar tu llegada." />
          </Reveal>
          <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
            {infoCards.map((card) => (
              <StaggerItem key={card.title}>
                <Card className="h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <card.icon className="h-6 w-6 text-carmesi" aria-hidden="true" />
                  <h2 className="mt-4 font-heading text-lg font-semibold text-azul">{card.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section className="bg-marfil">
        <Container>
          <Reveal>
            <SectionHeading
              title="Horarios de celebración"
              description="Horarios administrados por la coordinación pastoral del santuario."
            />
          </Reveal>
          <div className="mt-10">
            <MassSchedule items={schedules} title="" />
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container className="text-center">
          <Reveal>
            <h2 className="font-heading text-2xl font-semibold text-azul">¿Necesitas orientación pastoral?</h2>
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
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}

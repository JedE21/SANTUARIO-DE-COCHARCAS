import type { Metadata } from 'next';
import { Container, Section, SectionHeading, Link, Button, Card, Badge } from '@/components/public';
import { getMassSchedules } from '@/lib/queries';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Horarios de misa',
  description: 'Consulta los horarios de celebración eucarística del santuario.',
  path: '/fe/misas',
});

function formatTime(value: string) {
  return value.slice(0, 5);
}

export default async function MisasPage() {
  const schedule = await getMassSchedules();
  return (
    <main>
      <Section className="bg-marfil">
        <Container className="py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Celebración eucarística</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl">Horarios de misa</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              La Eucaristía es el centro de nuestra vida de fe. Estos son los horarios de referencia para la comunidad y los peregrinos.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <SectionHeading
            title="Programación semanal"
            description="Horarios estables para organizar tu visita y tu participación."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {schedule.map((item) => (
              <Card key={`${item.day_of_week}-${item.time}`} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-wide text-primary">{item.day_of_week}</p>
                    <h2 className="mt-1 text-2xl font-semibold">{formatTime(item.time)}</h2>
                    {item.description ? <p className="mt-1 text-sm text-muted-foreground">{item.description}</p> : null}
                  </div>
                  <Badge variant="outline">{item.place}</Badge>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/solicitudes/misa">Solicitar una misa</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/fe">Volver a vida de fe</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}

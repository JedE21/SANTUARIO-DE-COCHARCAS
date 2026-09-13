import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/public/page-hero';
import { Section, Container } from '@/components/public';
import { FadeIn } from '@/components/motion';
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
      <PageHero
        eyebrow="Celebración eucarística"
        title="Horarios de misa"
        description="La Eucaristía es el centro de nuestra vida de fe. Estos son los horarios de referencia para la comunidad y los peregrinos."
      />

      <Section className="bg-marfil">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <FadeIn className="lg:col-span-5">
              <p className="eyebrow text-tierra">Programación semanal</p>
              <h2 className="display-section mt-5 text-marron">
                Horarios estables para tu visita
              </h2>
              <div className="mt-10 flex flex-col gap-6">
                <Link
                  href="/solicitudes/misa"
                  className="group inline-flex w-fit items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-marron transition-colors duration-300 hover:text-dorado-oscuro"
                >
                  <span className="border-b border-marron/30 pb-1.5 transition-colors duration-300 group-hover:border-dorado">
                    Solicitar una misa
                  </span>
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href="/fe"
                  className="group inline-flex w-fit items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-tierra transition-colors duration-300 hover:text-dorado-oscuro"
                >
                  <span className="border-b border-tierra/30 pb-1.5 transition-colors duration-300 group-hover:border-dorado">
                    Volver a vida de fe
                  </span>
                </Link>
              </div>
            </FadeIn>

            <div className="lg:col-span-7">
              {schedule.length === 0 ? (
                <p className="text-muted-foreground">
                  Aún no hay horarios publicados. Consulta la sección de contacto para mayor información.
                </p>
              ) : (
                <FadeIn delay={0.1}>
                  <ol className="border-t border-tierra/20">
                    {schedule.map((item) => (
                      <li
                        key={`${item.day_of_week}-${item.time}`}
                        className="group flex items-baseline justify-between gap-4 border-b border-tierra/20 py-5"
                      >
                        <div>
                          <p className="font-heading text-xl font-medium text-marron">
                            {item.day_of_week}
                          </p>
                          {item.place ? (
                            <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-tierra">
                              {item.place}
                            </p>
                          ) : null}
                          {item.description ? (
                            <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                          ) : null}
                        </div>
                        <p className="font-heading text-3xl font-medium tabular-nums text-marron transition-colors duration-300 group-hover:text-dorado-oscuro">
                          {formatTime(item.time)}
                        </p>
                      </li>
                    ))}
                  </ol>
                </FadeIn>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

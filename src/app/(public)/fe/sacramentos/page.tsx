import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/public/page-hero';
import { Section, Container } from '@/components/public';
import { FadeIn, Reveal } from '@/components/motion';
import { getSacraments } from '@/lib/queries';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Sacramentos',
  description: 'Información sobre bautismo, confirmación, matrimonio y más.',
  path: '/fe/sacramentos',
});

export default async function SacramentosPage() {
  const sacraments = await getSacraments();
  return (
    <main>
      <PageHero
        eyebrow="Vida de fe"
        title="Sacramentos"
        description="Información y orientación para recibir los sacramentos en el santuario."
      />

      <Section className="bg-marfil">
        <Container>
          <FadeIn>
            <p className="eyebrow text-tierra">Preparación sacramental</p>
            <h2 className="display-section mt-5 max-w-2xl text-marron">
              Los sacramentos que se celebran en el santuario
            </h2>
          </FadeIn>

          {sacraments.length === 0 ? (
            <p className="mt-10 text-muted-foreground">
              Pronto publicaremos la información de cada sacramento.
            </p>
          ) : (
            <div className="mt-14 grid gap-px border border-tierra/15 bg-tierra/15 sm:grid-cols-2">
              {sacraments.map((sacrament, i) => (
                <Reveal key={sacrament.id} delay={0.06 * i} className="bg-marfil">
                  <Link
                    href={`/fe/sacramentos/${sacrament.slug}`}
                    className="group flex h-full flex-col gap-3 px-7 py-9 transition-colors duration-300 hover:bg-blanco"
                  >
                    <span className="font-heading text-lg tabular-nums text-dorado-oscuro">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="font-heading text-2xl font-medium text-marron">{sacrament.name}</h2>
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {sacrament.description}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-3 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-tierra transition-colors duration-300 group-hover:text-dorado-oscuro">
                      Conocer más
                      <ArrowRight
                        className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}

          <FadeIn delay={0.15}>
            <div className="mt-14 flex justify-center">
              <Link
                href="/solicitudes/sacramentos"
                className="group inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-marron transition-colors duration-300 hover:text-dorado-oscuro"
              >
                <span className="border-b border-marron/30 pb-1.5 transition-colors duration-300 group-hover:border-dorado">
                  Solicitar un sacramento
                </span>
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </FadeIn>
        </Container>
      </Section>
    </main>
  );
}

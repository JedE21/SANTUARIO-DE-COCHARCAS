import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/public/page-hero';
import { Section, Container } from '@/components/public';
import { FadeIn, Reveal } from '@/components/motion';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Solicitudes pastorales',
  description: 'Solicita misas, sacramentos y consulta el estado de tus solicitudes.',
  path: '/solicitudes',
});

const options = [
  {
    title: 'Solicitar una misa',
    href: '/solicitudes/misa',
    description: 'Envía una intención para una celebración eucarística.',
  },
  {
    title: 'Solicitar un sacramento',
    href: '/solicitudes/sacramentos',
    description:
      'Inicia la preparación para bautismo, confirmación, matrimonio o primera comunión.',
  },
  {
    title: 'Seguimiento de solicitudes',
    href: '/solicitudes/seguimiento',
    description: 'Consulta el estado de tu solicitud con tu código.',
  },
];

export default function SolicitudesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Pastoral"
        title="Solicitudes pastorales"
        description="Gestiona tus pedidos de misa, sacramentos y sigue su estado de forma sencilla."
      />

      <Section className="bg-marfil">
        <Container>
          <FadeIn>
            <p className="eyebrow text-tierra">Opciones</p>
            <h2 className="display-section mt-5 max-w-2xl text-marron">
              ¿En qué puede acompañarte el santuario?
            </h2>
          </FadeIn>

          <div className="mt-14 grid gap-px border border-tierra/15 bg-tierra/15 md:grid-cols-3">
            {options.map((option, i) => (
              <Reveal key={option.href} delay={0.06 * i} className="bg-marfil">
                <Link
                  href={option.href}
                  className="group flex h-full flex-col gap-3 px-7 py-9 transition-colors duration-300 hover:bg-blanco"
                >
                  <span className="font-heading text-lg tabular-nums text-dorado-oscuro">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-heading text-2xl font-medium text-marron">{option.title}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{option.description}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-3 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-tierra transition-colors duration-300 group-hover:text-dorado-oscuro">
                    Ir a la solicitud
                    <ArrowRight
                      className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}

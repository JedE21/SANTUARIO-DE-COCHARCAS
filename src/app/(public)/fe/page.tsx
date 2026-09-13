import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Church, Cross, Heart, PenLine } from 'lucide-react';
import { PageHero } from '@/components/public/page-hero';
import { Section, Container } from '@/components/public';
import { SectionSlider } from '@/components/public/section-slider';
import { FadeIn, Reveal } from '@/components/motion';
import { pageMetadata } from '@/lib/seo';
import { getSlidesBySection } from '@/lib/queries';

const feSections = [
  {
    icon: Church,
    title: 'Horarios de Misa',
    href: '/fe/misas',
    description: 'Consulta los horarios de la Eucaristía y las celebraciones dominicales.',
  },
  {
    icon: Cross,
    title: 'Sacramentos',
    href: '/fe/sacramentos',
    description: 'Información sobre bautismo, confirmación, matrimonio y más.',
  },
  {
    icon: PenLine,
    title: 'Solicitar Misa',
    href: '/fe/solicitar-misa',
    description: 'Envía una intención especial para una celebración eucarística.',
  },
  {
    icon: Heart,
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

export default async function FELandingPage() {
  const slides = await getSlidesBySection('fe-peregrinacion');

  return (
    <main>
      {/* Carrusel de fotografías de la sección: protagonista en lugar de la banda marrón */}
      {slides.length > 0 ? (
        <SectionSlider slides={slides} label="Fe y Peregrinación" priority fullScreen />
      ) : (
        <PageHero
          eyebrow="Vida de fe"
          title="Camina con la comunidad del santuario"
          description="Un lugar para celebrar, pedir, agradecer y crecer en la fe con acompañamiento pastoral."
        />
      )}
      <h1 className="sr-only">Vida de fe: camina con la comunidad del santuario</h1>

      <Section className="bg-marfil">
        <Container>
          <FadeIn>
            <p className="eyebrow text-tierra">Áreas de la vida de fe</p>
            <h2 className="display-section mt-5 max-w-2xl text-marron">
              Los espacios más solicitados por la comunidad
            </h2>
          </FadeIn>

          <div className="mt-14 grid gap-px border border-tierra/15 bg-tierra/15 sm:grid-cols-2">
            {feSections.map((section, i) => (
              <Reveal key={section.href} delay={0.06 * i} className="bg-marfil">
                <Link
                  href={section.href}
                  className="group flex h-full flex-col gap-3 px-7 py-9 transition-colors duration-300 hover:bg-blanco"
                >
                  <section.icon
                    className="h-5 w-5 text-dorado-oscuro"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <h3 className="font-heading text-2xl font-medium text-marron">{section.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{section.description}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-3 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-tierra transition-colors duration-300 group-hover:text-dorado-oscuro">
                    Abrir sección
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

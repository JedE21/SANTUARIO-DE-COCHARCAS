import * as React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/public/page-hero';
import { Section, Container } from '@/components/public';
import { FadeIn, Reveal } from '@/components/motion';
import { pageMetadata } from '@/lib/seo';

// Types
type ArchitectureInfo = {
  title: string;
  description: string;
  history: string;
  style: string;
  features: string[];
  preservation: string;
  imageUrl: string | null;
  imageAlt: string;
  details: ArchitecturalDetail[];
};

type ArchitecturalDetail = {
  title: string;
  description: string;
  imageUrl: string | null;
  imageAlt: string;
};

// Fetch architecture info (placeholder)
async function fetchArchitectureInfo(): Promise<ArchitectureInfo> {
  // In a real implementation, we would fetch from a CMS or Supabase
  // For now, we'll return placeholder data
  return {
    title: 'Arquitectura del Santuario',
    description: 'Una fusión de estilos que narra siglos de historia.',
    history: 'La construcción actual del santuario se inició alrededor de 1650, sustituyendo a la primera capilla de adobe y paja. El edificio presenta una arquitectura mestiza que combina elementos del barroco colonial español con influencias andinas autóctonas, adaptadas al entorno geográfico y cultural de la región.',
    style: 'Barroco andino con adaptación local',
    features: [
      'Fachada de piedra tallada',
      'Retablos dorados en hojas de oro',
      'Techo de madera trabajada con artesanía local',
      'Portada principal de estilo renacentista',
      'Campanario de tres cuerpos',
      'Crucero con cúpula sobre pechinas'
    ],
    preservation: 'El santuario ha pasado por diversos procesos de restauración y conservación a lo largo de los años, preservando su valor arquitectónico y artístico. Los trabajos han sido realizados con técnicas tradicionales y materiales compatibles con la estructura original.',
    imageUrl: '/images/santuario/santuario-plaza.jpg',
    imageAlt: 'Vista arquitectónica del Santuario de Cocharcas',
    details: [
      {
        title: 'Fachada Principal',
        description: 'La fachada presenta un diseño simétrico con elementos barrocos, incluyendo columnas salomónicas y nichos que albergan imágenes de santos. El uso de piedra local tallada a mano demuestra la habilidad de los artesanos de la época.',
        imageUrl: '/images/santuario/santuario-plaza.jpg',
        imageAlt: 'Fachada principal del santuario'
      },
      {
        title: 'Retablo Mayor',
        description: 'El retablo mayor es una obra de arte en madera tallada y cubierta con hojas de oro. Presenta escenas bíblicas y figuras de santos, organizadas en un diseño jerárquico que culmina con la Virgen de Cocharcas en el centro.',
        imageUrl: '/images/santuario/pintura-detalle.jpg',
        imageAlt: 'Retablo mayor del santuario'
      },
      {
        title: 'Techo de Madera',
        description: 'El techo del santuario está realizado con madera de calidad, tallada y trabajada por artesanos locales. Presenta motivos geométricos y florales que combinan influencias europeas y andinas.',
        imageUrl: '/images/santuario/santuario-exterior.jpg',
        imageAlt: 'Detalle del techo de madera'
      }
    ]
  };
}

export const metadata: Metadata = pageMetadata({
  title: 'Arquitectura',
  description: 'Descubre los detalles arquitectónicos y artísticos del Santuario de Nuestra Señora de Cocharcas.',
  path: '/santuario/arquitectura',
});

export default async function ArchitecturePage() {
  const archInfo = await fetchArchitectureInfo();

  return (
    <main>
      <PageHero
        eyebrow="Arquitectura"
        title={archInfo.title}
        description={archInfo.description}
      />

      {/* Historia constructiva + estilo */}
      <Section className="bg-marfil">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <FadeIn className="lg:col-span-7">
              <p className="eyebrow text-tierra">Historia constructiva</p>
              <h2 className="display-section mt-5 text-marron">Piedra levantada con fe</h2>
              <p className="mt-7 leading-relaxed text-muted-foreground">{archInfo.history}</p>
            </FadeIn>
            <FadeIn delay={0.1} className="lg:col-span-5">
              <p className="eyebrow text-tierra">Estilo</p>
              <h2 className="display-section mt-5 text-marron">{archInfo.style}</h2>
              <ul className="mt-7 border-t border-tierra/20">
                {archInfo.features.map((feature, i) => (
                  <li
                    key={feature}
                    className={`border-b border-tierra/20 py-3 text-sm text-muted-foreground ${i === 0 ? 'pt-4' : ''}`}
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </Container>
      </Section>

      {/* Detalles arquitectónicos: composición editorial alternada */}
      <Section className="bg-blanco">
        <Container>
          <FadeIn>
            <p className="eyebrow text-tierra">Detalles</p>
            <h2 className="display-section mt-5 text-marron">Elementos que hacen único este templo</h2>
          </FadeIn>
          <div className="mt-16 space-y-20 lg:space-y-28">
            {archInfo.details.map((detail, index) => (
              <FadeIn key={detail.title}>
                <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-20">
                  <div className={`lg:col-span-7 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="relative aspect-[16/10] overflow-hidden bg-piedra/30">
                      <Image
                        src={detail.imageUrl || '/images/santuario/santuario-exterior.jpg'}
                        alt={detail.imageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className="img-zoom object-cover"
                      />
                    </div>
                  </div>
                  <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <p className="eyebrow text-dorado-oscuro">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="display-section mt-4 text-marron">{detail.title}</h3>
                    <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                      {detail.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* Preservación */}
      <Section className="bg-marfil">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            <FadeIn className="lg:col-span-4">
              <p className="eyebrow text-tierra">Conservación</p>
              <h2 className="display-section mt-5 text-marron">Preservación del patrimonio</h2>
            </FadeIn>
            <FadeIn delay={0.1} className="lg:col-span-8">
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {archInfo.preservation}
              </p>
              <Link
                href="/santuario/patrimonio"
                className="group mt-9 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-marron transition-colors duration-300 hover:text-dorado-oscuro"
              >
                <span className="border-b border-marron/30 pb-1.5 transition-colors duration-300 group-hover:border-dorado">
                  Explorar el patrimonio cultural
                </span>
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </FadeIn>
          </div>
        </Container>
      </Section>
    </main>
  );
}

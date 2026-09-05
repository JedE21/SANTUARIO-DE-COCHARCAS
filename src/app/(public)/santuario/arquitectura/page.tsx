import * as React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { Section, Container, SectionHeading, Image, Link } from '@/components/public';
import { FadeIn } from '@/components/motion';
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
    imageUrl: null,
    imageAlt: 'Vista arquitectónica del Santuario de Cocharcas',
    details: [
      {
        title: 'Fachada Principal',
        description: 'La fachada presenta un diseño simétrico con elementos barrocos, incluyendo columnas salomónicas y nichos que albergan imágenes de santos. El uso de piedra local tallada a mano demuestra la habilidad de los artesanos de la época.',
        imageUrl: null,
        imageAlt: 'Fachada principal del santuario'
      },
      {
        title: 'Retablo Mayor',
        description: 'El retablo mayor es una obra de arte en madera tallada y cubierta con hojas de oro. Presenta escenas bíblicas y figuras de santos, organizadas en un diseño jerárquico que culmina con la Virgen de Cocharcas en el centro.',
        imageUrl: null,
        imageAlt: 'Retablo mayor del santuario'
      },
      {
        title: 'Techo de Madera',
        description: 'El techo del santuario está realizado con madera de calidad, tallada y trabajada por artesanos locales. Presenta motivos geométricos y florales que combinan influencias europeas y andinas.',
        imageUrl: null,
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
      <section className="pb-20">
        <Container>
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'El Santuario', href: '/santuario' },
              { label: 'Arquitectura', href: '/santuario/arquitectura', isActive: true }
            ]}
          />

          {/* Page Header - Contemplative style */}
          <section className="relative">
            <div className="absolute inset-0">
              {archInfo.imageUrl ? (
                <Image
                  src={archInfo.imageUrl}
                  alt="Arquitectura del Santuario"
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-b from-carbone/80 to-verde-andes" aria-hidden="true"></div>
              )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[50vh] px-4 sm:px-6 lg:px-8">
              <FadeIn delay={0} duration={0.5}>
                <p className="text-xs font-medium text-dorado-claro tracking-wider mb-2">
                  ARQUITECTURA
                </p>
              </FadeIn>

              <FadeIn delay={0.2} duration={0.5}>
                <h1 className="text-4xl font-bold text-blanco sm:text-5xl mb-2 leading-tight">
                  {archInfo.title}
                </h1>
              </FadeIn>

              <FadeIn delay={0.4} duration={0.5}>
                <p className="text-xl text-blanco/90 max-w-2xl mb-6 sm:text-2xl">
                  {archInfo.description}
                </p>
              </FadeIn>
            </div>
          </section>

          {/* Main content */}
          <div className="space-y-12">
            {/* History */}
            <FadeIn delay={0} duration={0.5}>
              <Section>
                <Container>
                  <SectionHeading
                    title="Historia Constructiva"
                    description="Evolución arquitectónica a través de los siglos"
                  />
                  <p className="text-muted-foreground">
                    {archInfo.history}
                  </p>
                </Container>
              </Section>
            </FadeIn>

            {/* Architectural Style */}
            <FadeIn delay={0.2} duration={0.5}>
              <Section className="bg-marfil">
                <Container>
                  <SectionHeading
                    title="Estilo Arquitectónico"
                    description="Características distintivas del santuario"
                  />
                  <p className="text-muted-foreground">
                    {archInfo.style}
                  </p>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Elementos destacados:</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                      {archInfo.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </Container>
              </Section>
            </FadeIn>

            {/* Architectural Details */}
            <FadeIn delay={0.4} duration={0.5}>
              <Section>
                <Container>
                  <SectionHeading
                    title="Detalles Arquitectónicos"
                    description="Elementos que hacen único este templo"
                  />
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {archInfo.details.map((detail, index) => (
                      <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
                        {detail.imageUrl ? (
                          <div className="relative h-48 w-full">
                            <Image
                              src={detail.imageUrl}
                              alt={detail.imageAlt}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-48 bg-gradient-to-b from-piedra/20 to-piedra/40" aria-hidden="true"></div>
                        )}
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {detail.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {detail.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Container>
              </Section>
            </FadeIn>

            {/* Preservation and Conservation */}
            <FadeIn delay={0.6} duration={0.5}>
              <Section className="bg-marfil">
                <Container>
                  <SectionHeading
                    title="Preservación y Conservación"
                    description="Manteniendo viva la historia para las futuras generaciones"
                  />
                  <p className="text-muted-foreground">
                    {archInfo.preservation}
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/santuario/patrimonio"
                      className="inline-flex items-center rounded-md bg-dorado-oscuro px-4 py-2 text-sm font-medium text-blanco transition-normal hover:bg-dorado-oscuro/90"
                    >
                      Explorar el patrimonio cultural
                      <span className="ml-2" aria-hidden="true">→</span>
                    </Link>
                  </div>
                </Container>
              </Section>
            </FadeIn>

            {/* Call to Action */}
            <FadeIn delay={0.8} duration={0.5}>
              <Section className="bg-dorado-oscuro">
                <Container className="text-center py-12">
                  <h2 className="text-3xl font-bold text-blanco mb-4">
                    Ven a admirar su belleza
                  </h2>
                  <p className="text-xl text-blanco/90 mb-6 max-w-2xl mx-auto">
                    Experimenta la grandeza arquitectónica que ha inspirado
                    a generaciones de fieles y visitantes.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                      href="/visita"
                      className="flex items-center rounded-md bg-blanco px-6 py-3 text-sm font-medium text-dorado-oscuro transition-normal hover:bg-marfil"
                    >
                      Planifica tu visita
                      <span className="ml-2" aria-hidden="true">→</span>
                    </Link>
                    <Link
                      href="/fe/solicitar-misa"
                      className="flex items-center rounded-md border border-blanco bg-transparent px-6 py-3 text-sm font-medium text-blanco transition-normal hover:bg-blanco/10"
                    >
                      Solicitar una misa
                      <span className="ml-2" aria-hidden="true">→</span>
                    </Link>
                  </div>
                </Container>
              </Section>
            </FadeIn>
          </div>
        </Container>
      </section>
    </main>
  );
}
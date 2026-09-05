import * as React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { Section, Container, SectionHeading, Image, Link } from '@/components/public';
import { FadeIn } from '@/components/motion';
import { pageMetadata } from '@/lib/seo';

// Types
type PatrimonioInfo = {
  title: string;
  description: string;
  historicalValue: string;
  artisticValue: string;
  culturalValue: string;
  documentaryHeritage: string;
  religiousArt: ReligiousArtItem[];
  imageUrl: string | null;
  imageAlt: string;
};

type ReligiousArtItem = {
  title: string;
  description: string;
  imageUrl: string | null;
  imageAlt: string;
  period: string;
};

// Fetch patrimonio info (placeholder)
async function fetchPatrimonioInfo(): Promise<PatrimonioInfo> {
  // En una implementación real se obtendría del CMS o de Supabase.
  return {
    title: 'Patrimonio Cultural del Santuario',
    description: 'Tesoros que atesoran fe, historia y arte.',
    historicalValue: 'El santuario alberga documentos y objetos que datan desde sus inicios en el siglo XVI, permitiendo reconstruir aspectos importantes de la historia local y regional. Los archivos parroquiales contienen registros de bautismos, matrimonios y defunciones que son fuente invaluable para investigadores.',
    artisticValue: 'Posee una significativa colección de arte religioso que incluye pinturas, esculturas y orfebrería de diferentes períodos, reflejando la evolución artística de la región andina bajo influencia colonial.',
    culturalValue: 'Más allá de su valor religioso, el santuario representa un importante centro de identidad cultural para la comunidad cocharquina y andina en general, siendo escenario de expresiones culturales vivas.',
    documentaryHeritage: 'El archivo histórico del santuario contiene documentos del siglo XVII en adelante, incluyendo libros de cuentas, correspondencia eclesiástica y documentos legales que reflejan la vida económica, social y religiosa de la comunidad.',
    religiousArt: [
      {
        title: 'Pintura de la Virgen de la Candelaria',
        description: 'Obra del siglo XVIII que representa a la Virgen bajo una advocación relacionada con la purificación y la luz.',
        imageUrl: null,
        imageAlt: 'Pintura de la Virgen de la Candelaria',
        period: 'Siglo XVIII'
      },
      {
        title: 'Cáliz de plata repujada',
        description: 'Objeto litúrgico de plata repujada con motivos florales andinos y símbolos eucarísticos.',
        imageUrl: null,
        imageAlt: 'Cáliz de plata repujada',
        period: 'Siglo XVII'
      },
      {
        title: 'Imagen de San José',
        description: 'Figura tallada en madera que representa al esposo de la Virgen, con policromía original parcialmente conservada.',
        imageUrl: null,
        imageAlt: 'Imagen de San José',
        period: 'Siglo XIX'
      }
    ],
    imageUrl: null,
    imageAlt: 'Elementos del patrimonio cultural del santuario'
  };
}

export const metadata: Metadata = pageMetadata({
  title: 'Patrimonio',
  description: 'Explora el rico patrimonio histórico, artístico y cultural del Santuario de Nuestra Señora de Cocharcas.',
  path: '/santuario/patrimonio',
});

export default async function PatrimonioPage() {
  const patrimonioInfo = await fetchPatrimonioInfo();

  return (
    <main>
      <section className="pb-20">
        <Container>
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'El Santuario', href: '/santuario' },
              { label: 'Patrimonio', href: '/santuario/patrimonio', isActive: true }
            ]}
          />

          {/* Page Header - Contemplative style */}
          <section className="relative">
            <div className="absolute inset-0">
              {patrimonioInfo.imageUrl ? (
                <Image
                  src={patrimonioInfo.imageUrl}
                  alt="Patrimonio del Santuario"
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-b from-carbone/80 to-verde-andes"></div>
              )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            <div className="relative z-10 flex min-h-[50vh] flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
              <FadeIn delay={0} duration={0.5}>
                <p className="mb-2 text-xs font-medium tracking-wider text-dorado-claro">
                  PATRIMONIO
                </p>
              </FadeIn>

              <FadeIn delay={0.2} duration={0.5}>
                <h1 className="mb-2 text-4xl font-bold leading-tight text-blanco sm:text-5xl">
                  {patrimonioInfo.title}
                </h1>
              </FadeIn>

              <FadeIn delay={0.4} duration={0.5}>
                <p className="mb-6 max-w-2xl text-xl text-blanco/90 sm:text-2xl">
                  {patrimonioInfo.description}
                </p>
              </FadeIn>
            </div>
          </section>

          {/* Main content */}
          <div className="space-y-12">
            {/* Historical Value */}
            <FadeIn delay={0} duration={0.5}>
              <Section>
                <Container>
                  <SectionHeading
                    title="Valor Histórico"
                    description="Documentos y objetos que narran nuestra historia"
                  />
                  <p className="text-muted-foreground">
                    {patrimonioInfo.historicalValue}
                  </p>
                </Container>
              </Section>
            </FadeIn>

            {/* Artistic Value */}
            <FadeIn delay={0.2} duration={0.5}>
              <Section className="bg-marfil">
                <Container>
                  <SectionHeading
                    title="Valor Artístico"
                    description="Obras de arte religioso que atesoramos"
                  />
                  <p className="text-muted-foreground">
                    {patrimonioInfo.artisticValue}
                  </p>
                  <div className="mt-6">
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Colección de arte religioso:</h3>
                    <div className="grid gap-6 md:grid-cols-3">
                      {patrimonioInfo.religiousArt.map((art) => (
                        <div key={art.title} className="overflow-hidden rounded-lg border border-border bg-card">
                          {art.imageUrl ? (
                            <div className="relative h-48 w-full">
                              <Image
                                src={art.imageUrl}
                                alt={art.imageAlt}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-48 bg-gradient-to-b from-piedra/20 to-piedra/40" aria-hidden="true"></div>
                          )}
                          <div className="p-4">
                            <h4 className="mb-2 text-lg font-semibold text-foreground">
                              {art.title}
                            </h4>
                            <p className="text-muted-foreground">
                              {art.description}
                            </p>
                            <p className="mt-2 text-xs text-muted-foreground">
                              <em>{art.period}</em>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Container>
              </Section>
            </FadeIn>

            {/* Cultural Value */}
            <FadeIn delay={0.4} duration={0.5}>
              <Section>
                <Container>
                  <SectionHeading
                    title="Valor Cultural"
                    description="Identidad y expresiones vivas de la comunidad"
                  />
                  <p className="text-muted-foreground">
                    {patrimonioInfo.culturalValue}
                  </p>
                  <div className="mt-6">
                    <p className="text-muted-foreground">
                      Cada año, durante las festividades en honor a la Virgen, la comunidad expresa su identidad
                      a través de danzas tradicionales, música andina, vestimentas típicas y gastronomía local.
                      Estas manifestaciones culturales forman parte del patrimonio intangible del santuario.
                    </p>
                  </div>
                </Container>
              </Section>
            </FadeIn>

            {/* Documentary Heritage */}
            <FadeIn delay={0.6} duration={0.5}>
              <Section className="bg-marfil">
                <Container>
                  <SectionHeading
                    title="Herencia Documental"
                    description="Archivos que preservan la memoria escrita"
                  />
                  <p className="text-muted-foreground">
                    {patrimonioInfo.documentaryHeritage}
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/santuario/archivo-historico"
                      className="inline-flex items-center rounded-md bg-dorado-oscuro px-4 py-2 text-sm font-medium text-blanco transition-normal hover:bg-dorado-oscuro/90"
                    >
                      Visitar el archivo histórico
                      <span className="ml-2" aria-hidden="true">→</span>
                    </Link>
                  </div>
                </Container>
              </Section>
            </FadeIn>

            {/* Call to Action */}
            <FadeIn delay={0.8} duration={0.5}>
              <Section className="bg-dorado-oscuro">
                <Container className="py-12 text-center">
                  <h2 className="mb-4 text-3xl font-bold text-blanco">
                    Ven a descubrir nuestros tesoros
                  </h2>
                  <p className="mx-auto mb-6 max-w-2xl text-xl text-blanco/90">
                    Acércate y conoce de cerca el legado histórico, artístico y cultural
                    que hemos preservado por más de cuatro siglos.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
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

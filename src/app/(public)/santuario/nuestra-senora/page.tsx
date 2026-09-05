import * as React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { Section, Container, SectionHeading, Image, Link } from '@/components/public';
import { FadeIn } from '@/components/motion';
import { pageMetadata } from '@/lib/seo';

// Types
type VirginInfo = {
  title: string;
  description: string;
  history: string;
  significance: string;
  devotion: string;
  festivities: string;
  imageUrl: string | null;
  imageAlt: string;
};

// Fetch virgin info (placeholder)
async function fetchVirginInfo(): Promise<VirginInfo> {
  // In a real implementation, we would fetch from a CMS or Supabase
  // For now, we'll return placeholder data
  return {
    title: 'Nuestra Señora de Cocharcas',
    description: 'La Virgen que protege y guía a su pueblo.',
    history: 'La imagen de Nuestra Señora de Cocharcas es una réplica exacta de la Virgen de Copacabana, traída a estas tierras en el año 1598 por el conquistador Francisco Tito Yupanqui. Según la tradición, Yupanqui, un indígena devoto, decidió crear una réplica después de visitar el santuario de Copacabana en Bolivia y quedar profundamente impresionado por la imagen.',
    significance: 'Esta imagen representa no solo una copia fiel de la Virgen de Copacabana, sino también un símbolo de la fe y la resistencia del pueblo andino. Su llegada marcó el comienzo de una profunda devoción mariana que ha perdurado por más de cuatro siglos.',
    devotion: 'La devoción a Nuestra Señora de Cocharcas se manifiesta en diversas formas: peregrinaciones anuales, novenas, procesiones, y ofrendas florales. Los fieles atribuyen numerosos milagros y gracias a su intercesión, especialmente en materia de salud, protección y provisión.',
    festivities: 'La festividad principal se celebra en septiembre, coincidiendo con la fiesta de la Virgen de Copacabana. Durante esta época, el santuario recibe a miles de peregrinos que participan en misas, procesiones, danzas tradicionales y actos de fe.',
    imageUrl: null,
    imageAlt: 'Imagen de Nuestra Señora de Cocharcas'
  };
}

export const metadata: Metadata = pageMetadata({
  title: 'Nuestra Señora de Cocharcas',
  description: 'Conoce la historia, significado y devoción a Nuestra Señora de Cocharcas.',
  path: '/santuario/nuestra-senora',
});

export default async function VirginPage() {
  const virginInfo = await fetchVirginInfo();

  return (
    <main>
      <section className="pb-20">
        <Container>
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'El Santuario', href: '/santuario' },
              { label: 'Nuestra Señora de Cocharcas', href: '/santuario/nuestra-senora', isActive: true }
            ]}
          />

          {/* Page Header - solemne: azul profundo + dorado */}
          <section className="relative overflow-hidden rounded-xl">
            <div className="absolute inset-0">
              {virginInfo.imageUrl ? (
                <Image
                  src={virginInfo.imageUrl}
                  alt="Virgen de Cocharcas"
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-azul-oscuro via-azul to-azul-oscuro" aria-hidden="true" />
              )}
            </div>

            {/* Overlay editorial azul + resplandor dorado sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-azul-oscuro/90 via-azul/50 to-transparent" aria-hidden="true" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.12),transparent_60%)]" aria-hidden="true" />

            <div className="relative z-10 flex min-h-[52vh] flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
              <FadeIn delay={0} duration={0.5}>
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-dorado-claro">
                  Nuestra Señora de Cocharcas
                </p>
              </FadeIn>

              <FadeIn delay={0.12} duration={0.6}>
                <h1 className="font-heading text-4xl font-bold leading-tight text-blanco sm:text-5xl">
                  {virginInfo.title}
                </h1>
              </FadeIn>

              <FadeIn delay={0.24} duration={0.6}>
                <div className="linea-dorada mx-auto mt-5 h-px w-24" aria-hidden="true" />
                <p className="mx-auto mt-4 max-w-2xl text-xl text-marfil/90 sm:text-2xl">
                  {virginInfo.description}
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
                    title="Historia de la Devoción"
                    description="Orígenes y tradición de la imagen sagrada"
                  />
                  <p className="text-muted-foreground">
                    {virginInfo.history}
                  </p>
                </Container>
              </Section>
            </FadeIn>

            {/* Significance */}
            <FadeIn delay={0.2} duration={0.5}>
              <Section className="bg-marfil">
                <Container>
                  <SectionHeading
                    title="Significado Espiritual"
                    description="¿Qué representa esta imagen para los fieles?"
                  />
                  <p className="text-muted-foreground">
                    {virginInfo.significance}
                  </p>
                </Container>
              </Section>
            </FadeIn>

            {/* Devotion and Practices */}
            <FadeIn delay={0.4} duration={0.5}>
              <Section>
                <Container>
                  <SectionHeading
                    title="Expresiones de Devoción"
                    description="Cómo se manifiesta la fe hacia la Virgen"
                  />
                  <p className="text-muted-foreground">
                    {virginInfo.devotion}
                  </p>
                </Container>
              </Section>
            </FadeIn>

            {/* Festivities */}
            <FadeIn delay={0.6} duration={0.5}>
              <Section className="bg-marfil">
                <Container>
                  <SectionHeading
                    title="Festividades y Celebraciones"
                    description="Los momentos de mayor congregación y fe"
                  />
                  <p className="text-muted-foreground">
                    {virginInfo.festivities}
                  </p>
                  <div className="mt-8">
                    <Link
                      href="/festividades"
                      className="inline-flex items-center rounded-md bg-azul px-5 py-2.5 text-sm font-medium text-blanco transition-normal hover:bg-azul-oscuro"
                    >
                      Ver festividades
                      <span className="ml-2" aria-hidden="true">→</span>
                    </Link>
                  </div>
                </Container>
              </Section>
            </FadeIn>

            {/* Image Gallery */}
            <FadeIn delay={0.8} duration={0.5}>
              <Section>
                <Container>
                  <SectionHeading
                    title="Galería de la Virgen"
                    description="Imágenes que capturan la belleza y devoción"
                  />
                  <p className="text-muted-foreground">
                    En esta sección se presentarán diversas fotografías de la Virgen de Cocharcas
                    en diferentes momentos del año, vestimentas festivales y detalles de su
                    ornamentación. Actualmente, la galería se encuentra en preparación.
                  </p>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Galería en preparación</p>
                  </div>
                </Container>
              </Section>
            </FadeIn>

            {/* Call to Action */}
            <FadeIn delay={1.0} duration={0.5}>
              <Section className="relative overflow-hidden rounded-xl bg-azul-oscuro">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dorado to-transparent" aria-hidden="true" />
                <Container className="py-14 text-center">
                  <h2 className="mb-4 font-heading text-3xl font-bold text-blanco">
                    Ven a conocer su presencia
                  </h2>
                  <div className="linea-dorada mx-auto mb-6 h-px w-20" aria-hidden="true" />
                  <p className="mx-auto mb-8 max-w-2xl text-xl text-marfil/85">
                    Experimenta la paz y la bendición que muchos han encontrado
                    ante la imagen de Nuestra Señora de Cocharcas.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href="/fe/solicitar-misa"
                      className="inline-flex items-center rounded-md bg-dorado px-6 py-3 text-sm font-semibold text-azul-oscuro transition-all duration-300 hover:bg-dorado-claro"
                    >
                      Solicitar una misa
                      <span className="ml-2" aria-hidden="true">→</span>
                    </Link>
                    <Link
                      href="/contacto"
                      className="inline-flex items-center rounded-md border border-marfil/40 px-6 py-3 text-sm font-medium text-blanco transition-all duration-300 hover:border-dorado/70 hover:bg-blanco/10"
                    >
                      Contactar al santuario
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
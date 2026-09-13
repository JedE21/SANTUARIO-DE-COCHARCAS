import * as React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/public/page-hero';
import { Section, Container } from '@/components/public';
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
    history: 'La imagen de Nuestra Señora de Cocharcas es una réplica exacta de la Virgen de Copacabana, traída a estas tierras en el año 1598 por Francisco Tito Yupanqui. Según la tradición, Yupanqui, un indígena devoto, decidió crear una réplica después de visitar el santuario de Copacabana en Bolivia y quedar profundamente impresionado por la imagen.',
    significance: 'Esta imagen representa no solo una copia fiel de la Virgen de Copacabana, sino también un símbolo de la fe y la resistencia del pueblo andino. Su llegada marcó el comienzo de una profunda devoción mariana que ha perdurado por más de cuatro siglos.',
    devotion: 'La devoción a Nuestra Señora de Cocharcas se manifiesta en diversas formas: peregrinaciones anuales, novenas, procesiones, y ofrendas florales. Los fieles atribuyen numerosos milagros y gracias a su intercesión, especialmente en materia de salud, protección y provisión.',
    festivities: 'La festividad principal se celebra en septiembre. Durante esta época, el santuario recibe a miles de peregrinos que participan en misas, procesiones, danzas tradicionales y actos de fe.',
    imageUrl: '/images/santuario/virgen-cocharcas.jpg',
    imageAlt: 'Imagen de Nuestra Señora de Cocharcas',
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
      <PageHero
        eyebrow="Nuestra Señora"
        title={virginInfo.title}
        description={virginInfo.description}
      />

      {/* La imagen de la Virgen como protagonista */}
      <Section className="bg-marfil">
        <Container>
          <FadeIn>
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -left-4 -top-4 hidden h-full w-full border border-tierra/25 lg:block"
              />
              <div className="relative aspect-[4/3] overflow-hidden bg-piedra/30 lg:aspect-[16/10]">
                <Image
                  src={virginInfo.imageUrl || '/images/santuario/virgen-cocharcas.jpg'}
                  alt={virginInfo.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 90vw"
                  className="img-zoom object-cover"
                />
              </div>
              <p className="mt-4 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-tierra">
                Nuestra Señora de Cocharcas · Devoción mariana de los Andes
              </p>
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Historia + Significado: dos columnas editoriales */}
      <Section className="bg-blanco">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <FadeIn className="lg:col-span-6">
              <p className="eyebrow text-tierra">Historia de la devoción</p>
              <h2 className="display-section mt-5 text-marron">Origen de la imagen</h2>
              <p className="mt-7 leading-relaxed text-muted-foreground">{virginInfo.history}</p>
            </FadeIn>
            <FadeIn delay={0.1} className="lg:col-span-6">
              <p className="eyebrow text-tierra">Significado espiritual</p>
              <h2 className="display-section mt-5 text-marron">Fe del pueblo andino</h2>
              <p className="mt-7 leading-relaxed text-muted-foreground">{virginInfo.significance}</p>
            </FadeIn>
          </div>
        </Container>
      </Section>

      {/* Devoción + Festividades */}
      <Section className="bg-marfil">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <FadeIn className="lg:col-span-6">
              <p className="eyebrow text-tierra">Expresiones de devoción</p>
              <h2 className="display-section mt-5 text-marron">Cómo se vive la fe</h2>
              <p className="mt-7 leading-relaxed text-muted-foreground">{virginInfo.devotion}</p>
            </FadeIn>
            <FadeIn delay={0.1} className="lg:col-span-6">
              <p className="eyebrow text-tierra">Festividades</p>
              <h2 className="display-section mt-5 text-marron">El encuentro de septiembre</h2>
              <p className="mt-7 leading-relaxed text-muted-foreground">{virginInfo.festivities}</p>
              <Link
                href="/festividades"
                className="group mt-8 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-marron transition-colors duration-300 hover:text-dorado-oscuro"
              >
                <span className="border-b border-marron/30 pb-1.5 transition-colors duration-300 group-hover:border-dorado">
                  Ver festividades
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

      {/* Cierre solemne */}
      <section className="bg-marron text-marfil">
        <Container>
          <div className="section-xl max-w-3xl">
            <FadeIn>
              <p className="eyebrow text-dorado-claro">Ven a conocerla</p>
              <h2 className="display-section mt-5 text-marfil">
                La paz que muchos han encontrado ante su presencia
              </h2>
              <div className="mt-10 flex flex-wrap gap-10">
                <Link
                  href="/fe/solicitar-misa"
                  className="group inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-dorado-claro transition-colors duration-300 hover:text-blanco"
                >
                  <span className="border-b border-dorado-claro/40 pb-1.5 transition-colors duration-300 group-hover:border-blanco/60">
                    Solicitar una misa
                  </span>
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href="/contacto"
                  className="group inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-marfil/80 transition-colors duration-300 hover:text-blanco"
                >
                  <span className="border-b border-marfil/30 pb-1.5 transition-colors duration-300 group-hover:border-blanco/60">
                    Contactar al santuario
                  </span>
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>
    </main>
  );
}

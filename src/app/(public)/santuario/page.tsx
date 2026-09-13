import * as React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/public/page-hero';
import { Section, Container } from '@/components/public';
import { SectionSlider } from '@/components/public/section-slider';
import { FadeIn, Reveal } from '@/components/motion';
import { pageMetadata } from '@/lib/seo';
import { getSlidesBySection } from '@/lib/queries';

export const metadata: Metadata = pageMetadata({
  title: 'El Santuario',
  description: 'Descubre la historia, arquitectura y patrimonio del Santuario de Nuestra Señora de Cocharcas.',
  path: '/santuario',
});

const capitulos = [
  {
    eyebrow: 'Historia',
    title: 'Cuatro siglos de devoción',
    description:
      'Desde la llegada de la imagen traída por Francisco Tito Yupanqui hasta hoy, la memoria del santuario.',
    href: '/santuario/historia',
    image: '/images/santuario/santuario-exterior.jpg',
    alt: 'Torres y cúpulas del Santuario de Cocharcas entre los cerros de Apurímac',
  },
  {
    eyebrow: 'Nuestra Señora',
    title: 'La Virgen de Cocharcas',
    description:
      'La imagen que reúne a los pueblos de los Andes: historia, significado y devoción del pueblo cocharquino.',
    href: '/santuario/nuestra-senora',
    image: '/images/santuario/virgen-cocharcas.jpg',
    alt: 'Imagen de Nuestra Señora de Cocharcas, devoción mariana de Apurímac',
  },
  {
    eyebrow: 'Arquitectura',
    title: 'Piedra, cal y barroco andino',
    description:
      'Fachada tallada, retablos dorados y techos de madera: un tesoro del mestizaje artístico andino.',
    href: '/santuario/arquitectura',
    image: '/images/santuario/santuario-plaza.jpg',
    alt: 'Fachada principal del Santuario de Nuestra Señora de Cocharcas',
  },
  {
    eyebrow: 'Patrimonio',
    title: 'Memoria que se conserva',
    description:
      'Pintura colonial, orfebrería litúrgica y un archivo histórico que narra la vida de la comunidad.',
    href: '/santuario/patrimonio',
    image: '/images/santuario/pintura-detalle.jpg',
    alt: 'Detalle del óleo colonial de Nuestra Señora de Cocharcas de 1751',
  },
];

export default async function SantuarioPage() {
  const slides = await getSlidesBySection('santuario');

  return (
    <main>
      {/* Carrusel de fotografías de la sección: protagonista en lugar de la banda marrón */}
      {slides.length > 0 ? (
        <SectionSlider slides={slides} label="El Santuario" priority fullScreen />
      ) : (
        <PageHero
          eyebrow="El Santuario"
          title="Un lugar de fe, historia y memoria"
          description="Uno de los espacios de peregrinación y devoción mariana más importantes de Apurímac."
        />
      )}
      <h1 className="sr-only">El Santuario: un lugar de fe, historia y memoria</h1>

      {/* Capítulos editoriales: imagen grande + texto, alternados */}
      <Section className="bg-marfil">
        <Container>
          <div className="space-y-24 lg:space-y-32">
            {capitulos.map((cap, i) => (
              <FadeIn key={cap.href}>
                <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-20">
                  <div
                    className={`lg:col-span-7 ${i % 2 === 1 ? 'lg:order-2' : ''}`}
                  >
                    <Link href={cap.href} className="group block">
                      <div className="relative aspect-[4/3] overflow-hidden bg-piedra/30 lg:aspect-[16/11]">
                        <Image
                          src={cap.image}
                          alt={cap.alt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 58vw"
                          className="img-zoom object-cover"
                        />
                      </div>
                    </Link>
                  </div>
                  <div className={`lg:col-span-5 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <p className="eyebrow text-tierra">{cap.eyebrow}</p>
                    <h2 className="display-section mt-5 text-marron">
                      <Link
                        href={cap.href}
                        className="transition-colors duration-300 hover:text-dorado-oscuro"
                      >
                        {cap.title}
                      </Link>
                    </h2>
                    <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                      {cap.description}
                    </p>
                    <Link
                      href={cap.href}
                      className="group mt-8 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-marron transition-colors duration-300 hover:text-dorado-oscuro"
                    >
                      <span className="border-b border-marron/30 pb-1.5 transition-colors duration-300 group-hover:border-dorado">
                        Continuar leyendo
                      </span>
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* Enlace al archivo histórico: banda solemne */}
      <section className="relative overflow-hidden bg-negro text-marfil">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src="/images/santuario/pintura-detalle.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(23,22,21,0.9) 0%, rgba(23,22,21,0.65) 50%, rgba(23,22,21,0.4) 100%)',
            }}
          />
        </div>
        <Container className="relative">
          <Reveal className="section max-w-2xl">
            <p className="eyebrow text-dorado-claro">Archivo histórico</p>
            <h2 className="display-section mt-5 text-marfil">
              Documentos que preservan la memoria escrita
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-marfil/75">
              Libros parroquiales, correspondencia y registros que datan desde el siglo XVII,
              hoy en proceso de organización y digitalización.
            </p>
            <Link
              href="/santuario/archivo-historico"
              className="group mt-9 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-dorado-claro transition-colors duration-300 hover:text-blanco"
            >
              <span className="border-b border-dorado-claro/40 pb-1.5 transition-colors duration-300 group-hover:border-blanco/60">
                Visitar el archivo
              </span>
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}

import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/public/page-hero';
import { Section, Container } from '@/components/public';
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
        imageUrl: '/images/santuario/pintura-colonial.jpg',
        imageAlt: 'Pintura colonial de la Virgen',
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
    imageUrl: '/images/santuario/pintura-detalle.jpg',
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
      <PageHero
        eyebrow="Patrimonio"
        title={patrimonioInfo.title}
        description={patrimonioInfo.description}
      />

      {/* Valores: lista editorial en dos columnas */}
      <Section className="bg-marfil">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <FadeIn className="lg:col-span-6">
              <p className="eyebrow text-tierra">Valor histórico</p>
              <h2 className="display-section mt-5 text-marron">Documentos y memoria</h2>
              <p className="mt-7 leading-relaxed text-muted-foreground">
                {patrimonioInfo.historicalValue}
              </p>
            </FadeIn>
            <FadeIn delay={0.08} className="lg:col-span-6">
              <p className="eyebrow text-tierra">Valor artístico</p>
              <h2 className="display-section mt-5 text-marron">Arte religioso andino</h2>
              <p className="mt-7 leading-relaxed text-muted-foreground">
                {patrimonioInfo.artisticValue}
              </p>
            </FadeIn>
          </div>
        </Container>
      </Section>

      {/* Colección de arte religioso: inventario editorial */}
      <Section className="bg-blanco">
        <Container>
          <FadeIn>
            <p className="eyebrow text-tierra">Colección</p>
            <h2 className="display-section mt-5 text-marron">Obras que custodia el templo</h2>
          </FadeIn>
          <ol className="mt-12 border-t border-tierra/20">
            {patrimonioInfo.religiousArt.map((art, i) => (
              <FadeIn key={art.title} delay={Math.min(i * 0.07, 0.25)}>
                <li className="grid gap-2 border-b border-tierra/20 py-8 sm:grid-cols-[8rem_1fr_8rem] sm:items-baseline sm:gap-8">
                  <span className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-dorado-oscuro">
                    {art.period}
                  </span>
                  <span>
                    <span className="block font-heading text-2xl font-medium text-marron">{art.title}</span>
                    <span className="mt-2 block max-w-2xl leading-relaxed text-muted-foreground">
                      {art.description}
                    </span>
                  </span>
                  <span className="hidden text-right font-heading text-lg tabular-nums text-tierra/70 sm:block">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </li>
              </FadeIn>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Valor cultural + herencia documental */}
      <Section className="bg-marfil">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <FadeIn className="lg:col-span-6">
              <p className="eyebrow text-tierra">Valor cultural</p>
              <h2 className="display-section mt-5 text-marron">Identidad viva</h2>
              <p className="mt-7 leading-relaxed text-muted-foreground">
                {patrimonioInfo.culturalValue}
              </p>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                Cada año, durante las festividades en honor a la Virgen, la comunidad expresa su identidad
                a través de danzas tradicionales, música andina, vestimentas típicas y gastronomía local.
                Estas manifestaciones culturales forman parte del patrimonio intangible del santuario.
              </p>
            </FadeIn>
            <FadeIn delay={0.08} className="lg:col-span-6">
              <p className="eyebrow text-tierra">Herencia documental</p>
              <h2 className="display-section mt-5 text-marron">El archivo histórico</h2>
              <p className="mt-7 leading-relaxed text-muted-foreground">
                {patrimonioInfo.documentaryHeritage}
              </p>
              <Link
                href="/santuario/archivo-historico"
                className="group mt-8 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-marron transition-colors duration-300 hover:text-dorado-oscuro"
              >
                <span className="border-b border-marron/30 pb-1.5 transition-colors duration-300 group-hover:border-dorado">
                  Visitar el archivo histórico
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

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Container, Section } from '@/components/public';
import { FadeIn } from '@/components/motion';
import { getSacramentBySlug } from '@/lib/queries';
import { pageMetadata } from '@/lib/seo';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sacrament = await getSacramentBySlug(params.slug);
  if (!sacrament) return { title: 'Sacramento no encontrado', robots: { index: false } };
  return pageMetadata({
    title: sacrament.name,
    description: sacrament.description,
    path: `/fe/sacramentos/${sacrament.slug}`,
    images: sacrament.image_url ? [{ url: sacrament.image_url, alt: sacrament.name }] : undefined,
  });
}

export default async function SacramentDetailPage({ params }: Props) {
  const sacrament = await getSacramentBySlug(params.slug);
  if (!sacrament) notFound();

  return (
    <main>
      <Section className="bg-marfil">
        <Container>
          <div className="mx-auto max-w-3xl">
            <FadeIn>
              <p className="eyebrow text-tierra">Sacramento</p>
              <h1 className="display-section mt-5 text-marron">{sacrament.name}</h1>
            </FadeIn>
            {sacrament.image_url ? (
              <FadeIn delay={0.1} className="mt-10">
                <div className="relative aspect-[16/9] overflow-hidden bg-piedra/30">
                  <Image
                    src={sacrament.image_url}
                    alt={sacrament.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                  />
                </div>
              </FadeIn>
            ) : null}
          </div>
        </Container>
      </Section>

      <Section className="bg-blanco">
        <Container>
          <article className="mx-auto max-w-3xl">
            {sacrament.description ? (
              <p className="font-heading text-xl italic leading-relaxed text-marron sm:text-2xl">
                {sacrament.description}
              </p>
            ) : null}
            {sacrament.requirements ? (
              <div className="mt-10">
                <p className="eyebrow text-tierra">Requisitos y orientación</p>
                <div className="mt-5 space-y-4 border-t border-tierra/20 pt-6 text-lg leading-relaxed text-muted-foreground">
                  {sacrament.requirements.split(/\n{2,}/).filter(Boolean).map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-12">
              <Link
                href="/solicitudes/sacramentos"
                className="group inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-marron transition-colors duration-300 hover:text-dorado-oscuro"
              >
                <span className="border-b border-marron/30 pb-1.5 transition-colors duration-300 group-hover:border-dorado">
                  Solicitar este sacramento
                </span>
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </article>
        </Container>
      </Section>
    </main>
  );
}

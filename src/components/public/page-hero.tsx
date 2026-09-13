import { FadeIn } from '@/components/motion';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
}

/**
 * Encabezado solemne de página interna: banda marrón profundo con
 * destello dorado tenue — patrimonio, no corporativo.
 */
export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-marron-profundo text-marfil">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(176,138,69,0.14),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(122,98,80,0.16),transparent_55%)]"
      />
      <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-28">
        <FadeIn duration={0.5}>
          <p className="eyebrow text-dorado-claro">{eyebrow}</p>
        </FadeIn>
        <FadeIn delay={0.08} duration={0.6}>
          <h1 className="display-xxl mt-5 text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
        </FadeIn>
        {description ? (
          <FadeIn delay={0.16} duration={0.6}>
            <div className="linea-dorada mx-auto mt-7 h-px w-20" aria-hidden="true" />
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-marfil/85 sm:text-lg">{description}</p>
          </FadeIn>
        ) : null}
      </div>
    </section>
  );
}

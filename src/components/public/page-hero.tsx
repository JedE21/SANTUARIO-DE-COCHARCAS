import { FadeIn } from '@/components/motion';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
}

/**
 * Encabezado solemne de pagina interna: banda azul profundo con detalle
 * dorado. Reemplaza el patron marfil+badge repetido en las paginas.
 */
export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-azul text-blanco">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(201,162,39,0.16),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(143,36,52,0.10),transparent_50%)]"
      />
      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <FadeIn duration={0.5}>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-dorado-claro">{eyebrow}</p>
        </FadeIn>
        <FadeIn delay={0.08} duration={0.6}>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        </FadeIn>
        {description ? (
          <FadeIn delay={0.16} duration={0.6}>
            <div className="linea-dorada mx-auto mt-6 h-px w-20" aria-hidden="true" />
            <p className="mx-auto mt-6 max-w-2xl text-lg text-marfil/90">{description}</p>
          </FadeIn>
        ) : null}
      </div>
    </section>
  );
}

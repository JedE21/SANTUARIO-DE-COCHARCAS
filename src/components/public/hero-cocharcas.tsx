'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { easeOutSoft, fadeUpStrong, heroStagger, lineGrow } from '@/components/motion/variants';

interface HeroCocharcasProps {
  badge: string;
  title: string;
  description: string;
  imageUrl?: string | null;
}

/**
 * Hero cinematografico del Santuario: pantalla casi completa, fotografia
 * protagonista (administrable desde el CMS), composicion editorial
 * abajo-izquierda, titulo serif grande, layout inspirado en sitios de
 * arquitectura patrimonial premium. Respeta prefers-reduced-motion.
 */
export function HeroCocharcas({ badge, title, description, imageUrl }: HeroCocharcasProps) {
  const reduced = usePrefersReducedMotion();
  const hasPhoto = Boolean(imageUrl && !imageUrl.endsWith('.svg'));
  const ref = React.useRef<HTMLElement>(null);

  // Parallax sutil: la imagen se desplaza un poco mas lento que la pagina
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  return (
    <section ref={ref} className="relative min-h-[94svh] overflow-hidden bg-azul text-blanco">
      {/* Fotografia protagonista / fondo azul institucional */}
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { y: imageY, scale: 1.08 }}
        aria-hidden="true"
      >
        {hasPhoto ? (
          <Image
            src={imageUrl as string}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-azul-oscuro via-azul to-azul-oscuro" />
        )}
      </motion.div>

      {/* Overlap editorial: azul profundo + elegancia, sin grises baratos */}
      <div
        aria-hidden="true"
        className={
          hasPhoto
            ? 'absolute inset-0 bg-gradient-to-t from-azul-oscuro/95 via-azul/35 to-azul-oscuro/40'
            : 'absolute inset-0 bg-[radial-gradient(ellipse_at_30%_10%,rgba(201,162,39,0.13),transparent_50%),radial-gradient(ellipse_at_85%_85%,rgba(143,36,52,0.10),transparent_45%)]'
        }
      />

      {/* Composicion abajo-izquierda (estilo editorial hoteleria de patrimonio) */}
      <motion.div
        className="relative flex min-h-[94svh] items-end"
        style={reduced ? undefined : { y: textY }}
        initial={reduced ? false : 'hidden'}
        animate="visible"
        variants={heroStagger}
      >
        <div className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
          <motion.p
            variants={fadeUpStrong}
            transition={{ duration: 0.6, ease: easeOutSoft }}
            className="eyebrow text-dorado-claro"
          >
            {badge}
          </motion.p>

          <motion.h1
            variants={fadeUpStrong}
            transition={{ duration: 0.8, ease: easeOutSoft }}
            className="display-xxl mt-6 max-w-3xl text-5xl text-blanco sm:text-6xl lg:text-7xl"
          >
            {title}
          </motion.h1>

          <motion.div
            aria-hidden="true"
            variants={lineGrow}
            transition={{ duration: 0.6, ease: easeOutSoft }}
            className="mt-8 h-px w-28 origin-left bg-dorado"
          />

          <motion.p
            variants={fadeUpStrong}
            transition={{ duration: 0.7, ease: easeOutSoft }}
            className="mt-6 max-w-xl text-base text-marfil/90 sm:text-lg"
          >
            {description}
          </motion.p>

          <motion.div
            variants={fadeUpStrong}
            transition={{ duration: 0.7, ease: easeOutSoft }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              href="/santuario"
              className="group inline-flex items-center rounded-sm bg-dorado px-7 py-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-azul-oscuro transition-all duration-300 hover:bg-dorado-claro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado focus-visible:ring-offset-2 focus-visible:ring-offset-azul"
            >
              Conocer el Santuario
              <span className="ml-2.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </Link>
            <Link
              href="/visita"
              className="group inline-flex items-center rounded-sm border border-marfil/40 px-7 py-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-blanco transition-all duration-300 hover:border-dorado hover:text-dorado-claro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado focus-visible:ring-offset-2 focus-visible:ring-offset-azul"
            >
              Planifica tu visita
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Indicador de scroll sobrio */}
      <motion.div
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 0.75 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 right-6 hidden flex-col items-center gap-3 sm:flex lg:right-10"
      >
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-marfil/70 [writing-mode:vertical-rl]">
          Descubre
        </span>
        <motion.span
          className="h-10 w-px bg-dorado/70"
          animate={reduced ? undefined : { scaleY: [0.4, 1, 0.4] }}
          transition={reduced ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.div>
    </section>
  );
}

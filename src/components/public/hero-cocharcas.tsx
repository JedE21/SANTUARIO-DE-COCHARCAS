'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { easeOutSoft, fadeUpStrong, heroStagger, lineGrow } from '@/components/motion/variants';

interface HeroCocharcasProps {
  badge: string;
  title: string;
  description: string;
  imageUrl?: string | null;
}

/**
 * Hero cinematografico del Santuario: azul profundo + detalles dorados,
 * entrada coreografiada (badge -> titulo -> linea -> descripcion -> CTA).
 * Si hay fotografia del santuario (administrable), se luce con overlay azul.
 */
export function HeroCocharcas({ badge, title, description, imageUrl }: HeroCocharcasProps) {
  const reduced = usePrefersReducedMotion();
  const hasPhoto = Boolean(imageUrl && !imageUrl.endsWith('.svg'));

  return (
    <section className="relative overflow-hidden bg-azul text-blanco">
      {/* Fotografia protagonista (si el panel la administra) */}
      {hasPhoto && (
        <div className="absolute inset-0">
          <Image
            src={imageUrl as string}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* Overlay editorial azul profundo (contraste + profundidad) */}
      <div
        aria-hidden="true"
        className={
          hasPhoto
            ? 'absolute inset-0 bg-gradient-to-b from-azul-oscuro/70 via-azul/60 to-azul-oscuro/90'
            : 'absolute inset-0 bg-gradient-to-b from-azul-oscuro via-azul to-azul-oscuro'
        }
      />

      {/* Resplandor dorado sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.14),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(143,36,52,0.12),transparent_45%)]"
      />

      <motion.div
        className="relative mx-auto max-w-4xl px-4 py-28 text-center sm:px-6 sm:py-36 lg:py-40"
        initial={reduced ? false : 'hidden'}
        animate="visible"
        variants={heroStagger}
      >
        <motion.p
          variants={fadeUpStrong}
          transition={{ duration: 0.6, ease: easeOutSoft }}
          className="inline-block rounded-full border border-dorado/40 bg-blanco/10 px-4 py-1.5 text-xs font-medium tracking-wider text-dorado-claro backdrop-blur-sm"
        >
          {badge}
        </motion.p>

        <motion.h1
          variants={fadeUpStrong}
          transition={{ duration: 0.7, ease: easeOutSoft }}
          className="mt-6 font-heading text-4xl font-bold leading-tight tracking-tight text-blanco sm:text-6xl"
        >
          {title}
        </motion.h1>

        {/* Linea dorada que crece: detalle de solemnidad */}
        <motion.div
          aria-hidden="true"
          variants={lineGrow}
          transition={{ duration: 0.5, ease: easeOutSoft }}
          className="mx-auto mt-7 h-px w-24 origin-center bg-gradient-to-r from-transparent via-dorado to-transparent"
        />

        <motion.p
          variants={fadeUpStrong}
          transition={{ duration: 0.6, ease: easeOutSoft }}
          className="mx-auto mt-6 max-w-2xl text-lg text-marfil/90 sm:text-xl"
        >
          {description}
        </motion.p>

        <motion.div
          variants={fadeUpStrong}
          transition={{ duration: 0.6, ease: easeOutSoft }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/santuario"
            className="group inline-flex items-center rounded-md bg-dorado px-6 py-3 text-sm font-semibold text-azul-oscuro transition-all duration-300 hover:bg-dorado-claro hover:shadow-[0_10px_24px_-8px_rgba(201,162,39,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado focus-visible:ring-offset-2 focus-visible:ring-offset-azul"
          >
            Conocer el Santuario
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </Link>
          <Link
            href="/visita"
            className="group inline-flex items-center rounded-md border border-marfil/40 px-6 py-3 text-sm font-semibold text-blanco transition-all duration-300 hover:border-dorado/70 hover:bg-blanco/10 hover:text-dorado-claro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado focus-visible:ring-offset-2 focus-visible:ring-offset-azul"
          >
            Planifica tu visita
          </Link>
        </motion.div>
      </motion.div>

      {/* Indicador de scroll sutil */}
      <motion.div
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <div className="h-8 w-px bg-gradient-to-b from-dorado/0 via-dorado/80 to-dorado/0" />
      </motion.div>
    </section>
  );
}

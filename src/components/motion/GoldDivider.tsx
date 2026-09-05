'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { lineGrow, revealTransition } from './variants';

interface GoldDividerProps {
  className?: string;
  /** center o left para el origen de la expansion */
  align?: 'center' | 'left';
}

/**
 * Separador dorado animado: crece al entrar en viewport.
 * Detalle patrimonial sutil para encabezados de seccion.
 */
export const GoldDivider = ({ className = '', align = 'center' }: GoldDividerProps) => {
  const reduced = usePrefersReducedMotion();
  const cls = `linea-dorada h-px w-20 ${align === 'center' ? 'mx-auto origin-center' : 'origin-left'} ${className}`;

  if (reduced) return <div className={cls} aria-hidden="true" />;

  return (
    <motion.div
      aria-hidden="true"
      className={cls}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={lineGrow}
      transition={{ ...revealTransition, duration: 0.6, delay: 0.1 }}
    />
  );
};

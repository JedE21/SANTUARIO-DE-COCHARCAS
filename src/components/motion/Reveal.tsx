'use client';

import * as React from 'react';
import { motion, type Variants } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { fadeUp, revealTransition } from './variants';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  /** Variante de entrada (fadeUp por defecto; ver variants.ts). */
  variant?: Variants;
}

export const Reveal = ({
  children,
  className = '',
  delay = 0,
  duration = 0.55,
  once = true,
  variant = fadeUp,
}: RevealProps) => {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.18, margin: '0px 0px -40px 0px' }}
      variants={variant}
      transition={{ ...revealTransition, duration, delay }}
    >
      {children}
    </motion.div>
  );
};

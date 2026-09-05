'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { fadeUp, revealTransition } from './variants';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export const FadeIn = ({ children, className = '', delay = 0, duration = 0.55 }: FadeInProps) => {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      transition={{ ...revealTransition, duration, delay }}
    >
      {children}
    </motion.div>
  );
};

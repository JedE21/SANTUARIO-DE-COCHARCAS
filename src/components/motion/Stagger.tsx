'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { staggerContainer } from './variants';

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
  staggerDirection?: number;
}

export const Stagger = ({
  children,
  className = '',
  delayChildren = 0.05,
  staggerChildren = 0.08,
  staggerDirection = 1,
}: StaggerProps) => {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={{
        ...staggerContainer,
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerChildren * staggerDirection,
            delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

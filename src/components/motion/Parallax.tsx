'use client';

import * as React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  offset?: number;
}

export const Parallax = ({ children, className = '', offset = 36 }: ParallaxProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [offset, -offset]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

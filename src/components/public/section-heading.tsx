import * as React from 'react';
import { GoldDivider } from '@/components/motion';

interface SectionHeadingProps {
  title: string;
  description?: string;
  eyebrow?: string;
  className?: string;
  textAlign?: 'left' | 'center' | 'right';
  /** Linea dorada animada bajo el titulo (detalle patrimonial). */
  withDivider?: boolean;
}

export const SectionHeading = ({
  title,
  description,
  eyebrow,
  className = '',
  textAlign = 'center',
  withDivider = true,
}: SectionHeadingProps) => {
  const alignmentClass = textAlign === 'left' ? 'text-left' : textAlign === 'right' ? 'text-right' : 'text-center';

  return (
    <div className={`space-y-4 ${alignmentClass} ${className}`}>
      {eyebrow && <span className="text-xs font-medium tracking-widest text-carmesi uppercase">{eyebrow}</span>}
      <h2 className="font-heading text-3xl font-bold tracking-tight text-azul sm:text-4xl">{title}</h2>
      {withDivider && <GoldDivider align={textAlign === 'center' ? 'center' : 'left'} />}
      {description && (
        <p className={`text-muted-foreground max-w-2xl ${textAlign === 'center' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </div>
  );
};

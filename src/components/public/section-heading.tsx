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
    <div className={`space-y-5 ${alignmentClass} ${className}`}>
      {eyebrow && <span className="eyebrow text-carmesi">{eyebrow}</span>}
      <h2 className="font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-azul sm:text-5xl">{title}</h2>
      {withDivider && <GoldDivider align={textAlign === 'center' ? 'center' : 'left'} />}
      {description && (
        <p className={`mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground ${textAlign === 'center' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </div>
  );
};

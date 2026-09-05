import * as React from 'react';

interface SectionHeadingProps {
  title: string;
  description?: string;
  eyebrow?: string;
  className?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export const SectionHeading = ({
  title,
  description,
  eyebrow,
  className = '',
  textAlign = 'center',
}: SectionHeadingProps) => {
  const alignmentClass = textAlign === 'left' ? 'text-left' : textAlign === 'right' ? 'text-right' : 'text-center';

  return (
    <div className={`space-y-4 ${alignmentClass} ${className}`}>
      {eyebrow && <span className="text-xs font-medium text-primary tracking-wider">{eyebrow}</span>}
      <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{title}</h2>
      {description && (
        <p className={`text-muted-foreground max-w-2xl ${textAlign === 'center' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </div>
  );
};

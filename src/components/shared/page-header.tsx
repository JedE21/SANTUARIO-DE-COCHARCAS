import * as React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  className?: string;
}

export const PageHeader = ({
  title,
  description,
  eyebrow,
  className = '',
}: PageHeaderProps) => {
  return (
    <div className={`${className} space-y-5`}>
      {eyebrow && <p className="eyebrow text-tierra">{eyebrow}</p>}
      <h1 className="display-section text-marron">{title}</h1>
      {description && (
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>
      )}
    </div>
  );
};
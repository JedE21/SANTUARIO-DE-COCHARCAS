import * as React from 'react';
import { GoldDivider } from '@/components/motion';

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
    <div className={`${className} space-y-4`}>
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-carmesi">
          {eyebrow}
        </p>
      )}
      <h1 className="font-heading text-3xl font-bold tracking-tight text-azul sm:text-4xl">
        {title}
      </h1>
      <GoldDivider />
      {description && (
        <p className="text-muted-foreground mx-auto max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
};
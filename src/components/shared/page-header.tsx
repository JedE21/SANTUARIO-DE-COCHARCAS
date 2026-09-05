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
    <div className={`${className} space-y-4`}>
      {eyebrow && (
        <p className="text-xs font-medium text-primary tracking-wider">
          {eyebrow}
        </p>
      )}
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};
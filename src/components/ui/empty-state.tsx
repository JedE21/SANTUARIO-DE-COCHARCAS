import * as React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({
  title,
  description,
  icon,
  action,
  className = '',
}: EmptyStateProps) => {
  return (
    <div className={`text-center space-y-4 ${className}`}>
      {icon && (
        <div className="mx-auto flex h-12 w-12 items-center justify-center border border-tierra/25 text-dorado-oscuro">
          {icon}
        </div>
      )}
      <h3 className="font-heading text-xl font-medium text-marron">{title}</h3>
      {description && <p className="mx-auto max-w-xl text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

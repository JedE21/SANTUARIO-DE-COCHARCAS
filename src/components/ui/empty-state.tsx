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
      {icon && <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-accent/10 text-accent">{icon}</div>}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-xl mx-auto">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

import * as React from 'react';

interface ErrorStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const ErrorState = ({
  title,
  description,
  icon,
  action,
  className = '',
}: ErrorStateProps) => {
  return (
    <div className={`text-center space-y-4 ${className}`}>
      {icon && <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-destructive/10 text-destructive">{icon}</div>}
      <h3 className="text-lg font-semibold text-destructive">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-xl mx-auto">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

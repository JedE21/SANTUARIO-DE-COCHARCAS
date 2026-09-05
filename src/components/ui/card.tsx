import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'rounded-sm border border-border/70 bg-card text-card-foreground shadow-sm transition-shadow duration-300 hover:shadow-md',
  {
    variants: {},
    defaultVariants: {},
  }
);

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      className={cardVariants({ className })}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';

export { Card, cardVariants };

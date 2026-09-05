import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const skeletonVariants = cva('animate-pulse rounded-md bg-muted', {
  variants: {},
  defaultVariants: {},
});

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonVariants> {
  height?: number | string;
  width?: number | string;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, height, width, ...props }, ref) => (
    <div
      className={skeletonVariants({ className })}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width,
      }}
      ref={ref}
      {...props}
    />
  )
);
Skeleton.displayName = 'Skeleton';

export { Skeleton, skeletonVariants };

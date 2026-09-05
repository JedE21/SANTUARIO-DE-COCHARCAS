import * as React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
}

export const Container = ({
  children,
  className = '',
  fluid = false,
}: ContainerProps) => {
  return (
    <div className={`w-full mx-auto px-4 ${!fluid ? 'max-w-[1536px]' : ''} ${className}`}>
      {children}
    </div>
  );
};
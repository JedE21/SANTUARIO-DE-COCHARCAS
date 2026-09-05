import * as React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  background?: string;
}

export const Section = ({
  children,
  className = '',
  padding = 'section',
  background = '',
}: SectionProps) => {
  return (
    <section className={`${background} ${padding} ${className}`}>
      {children}
    </section>
  );
};
'use client';

import * as React from 'react';
import { Reveal } from '@/components/motion';

interface TimelineItem {
  year: string | number;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

interface HistoricalTimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const HistoricalTimeline = ({ items, className = '' }: HistoricalTimelineProps) => {
  if (items.length === 0) {
    return (
      <div className={`${className} py-8 text-center`}>
        <p className="text-muted-foreground">No hay eventos históricos disponibles.</p>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      {/* Linea cronologica: piedra con toque dorado */}
      <div className="absolute inset-y-0 left-3 w-px bg-gradient-to-b from-dorado/70 via-piedra/40 to-dorado/30" aria-hidden="true" />
      <ol className="relative space-y-8 pl-8 pt-4">
        {items.map((item) => (
          <li key={`${item.year}-${item.title}`}>
            <Reveal>
              <div className="absolute -left-0 mt-1.5 flex h-5 w-5 items-center justify-center" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-dorado ring-4 ring-marfil" />
              </div>
              <article className="rounded-lg border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <p className="font-heading text-2xl font-bold leading-none text-carmesi">{item.year}</p>
                <h3 className="mt-2 text-lg font-semibold text-azul">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
};

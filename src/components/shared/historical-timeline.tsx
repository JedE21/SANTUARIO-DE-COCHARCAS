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
      <div className="absolute inset-y-0 left-3 w-0.5 bg-piedra/25" aria-hidden="true" />
      <ol className="relative space-y-8 pl-8 pt-4">
        {items.map((item) => (
          <li key={`${item.year}-${item.title}`}>
            <Reveal>
              <div className="absolute -left-0.5 mt-2 flex h-5 w-5 items-center justify-center">
                <span className="h-3 w-3 rounded-full bg-primary ring-4 ring-marfil" />
              </div>
              <article className="rounded-lg border border-border/70 bg-card p-6 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-primary">{item.year}</p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
};

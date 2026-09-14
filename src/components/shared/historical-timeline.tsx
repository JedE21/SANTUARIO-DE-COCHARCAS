'use client';

import * as React from 'react';
import Image from 'next/image';
import { Reveal } from '@/components/motion';

interface TimelineItem {
  year: string | number;
  title: string;
  description: string;
  image?: string | null;
  imageAlt?: string | null;
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
      <ol className="relative space-y-10 pl-8 pt-2">
        {items.map((item) => (
          <li key={`${item.year}-${item.title}`}>
            <Reveal>
              <div className="absolute -left-0 mt-2 flex h-5 w-5 items-center justify-center" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-dorado ring-4 ring-marfil" />
              </div>
              <article className="border-b border-tierra/20 pb-8">
                <p className="eyebrow text-dorado-oscuro">{item.year}</p>
                <h3 className="mt-2 font-heading text-2xl font-medium text-marron">{item.title}</h3>
                <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">{item.description}</p>
                {item.image ? (
                  <div className="relative mt-5 aspect-[16/9] max-w-xl overflow-hidden rounded-sm bg-piedra/20 sm:aspect-[2/1]">
                    <Image
                      src={item.image}
                      alt={item.imageAlt || `Imagen del hito histórico: ${item.title}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 40vw"
                      className="img-zoom object-cover"
                      unoptimized={!item.image.startsWith('/')}
                    />
                  </div>
                ) : null}
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
};

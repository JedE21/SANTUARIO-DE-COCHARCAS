'use client';

import * as React from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

export type LightboxImage = {
  id: string;
  src: string;
  alt: string;
  caption?: string | null;
};

interface ImageLightboxProps {
  images: LightboxImage[];
  index: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function ImageLightbox({ images, index, open, onClose, onIndexChange }: ImageLightboxProps) {
  const reduced = usePrefersReducedMotion();
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const current = images[index];

  const goToPrevious = React.useCallback(() => {
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  const goToNext = React.useCallback(() => {
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  React.useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') goToNext();
      if (event.key === 'ArrowLeft') goToPrevious();
    }

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, goToNext, goToPrevious]);

  const overlay = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const panel = reduced
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1 } };

  return (
    <AnimatePresence>
      {open && current ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-carbone/88 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt || 'Imagen ampliada'}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlay}
          transition={{ duration: reduced ? 0 : 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-h-[90vh] w-full max-w-5xl"
            variants={panel}
            transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
            drag={images.length > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_event, info) => {
              if (images.length < 2) return;
              if (info.offset.x <= -60) goToNext();
              else if (info.offset.x >= 60) goToPrevious();
            }}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-carbone">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                className="pointer-events-none object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
                draggable={false}
              />
            </div>
            <div className="mt-3 flex items-center justify-center gap-4">
              {(current.caption || current.alt) && (
                <p className="text-center text-sm text-marfil/80">{current.caption || current.alt}</p>
              )}
              {images.length > 1 ? (
                <p className="text-xs tabular-nums text-marfil/60" aria-live="polite">
                  {index + 1} / {images.length}
                </p>
              ) : null}
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="absolute -top-3 right-0 rounded-full bg-blanco/95 p-2 text-carbone shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>

            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-blanco/90 p-2 text-carbone shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado sm:-left-4"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-blanco/90 p-2 text-carbone shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado sm:-right-4"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

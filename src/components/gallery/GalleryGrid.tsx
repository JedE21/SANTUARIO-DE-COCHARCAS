'use client';

import * as React from 'react';
import Image from 'next/image';
import { Stagger, StaggerItem } from '@/components/motion';
import { ImageLightbox, type LightboxImage } from './ImageLightbox';

interface GalleryGridProps {
  images: LightboxImage[];
  className?: string;
  columnsClassName?: string;
  aspectClassName?: string;
}

export function GalleryGrid({
  images,
  className = '',
  columnsClassName = 'grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3',
  aspectClassName = 'aspect-square',
}: GalleryGridProps) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const lastTriggerRef = React.useRef<HTMLButtonElement | null>(null);

  const handleClose = React.useCallback(() => {
    setOpen(false);
    // Accesibilidad: devolver el foco a la miniatura que abrió el lightbox
    requestAnimationFrame(() => lastTriggerRef.current?.focus());
  }, []);

  if (images.length === 0) return null;

  return (
    <>
      <Stagger className={`${columnsClassName} ${className}`}>
        {images.map((image, imageIndex) => (
          <StaggerItem key={image.id}>
            <button
              type="button"
              onClick={(event) => {
                lastTriggerRef.current = event.currentTarget;
                setIndex(imageIndex);
                setOpen(true);
              }}
              className="group relative block w-full overflow-hidden bg-piedra/30 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-oscuro focus-visible:ring-offset-2"
              aria-label={`Ampliar: ${image.alt}`}
            >
              <span className={`relative block ${aspectClassName} w-full overflow-hidden`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="img-zoom object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </span>
              {image.caption ? (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-negro/60 to-transparent p-3 pt-8 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-marfil">
                  {image.caption}
                </span>
              ) : null}
            </button>
          </StaggerItem>
        ))}
      </Stagger>
      <ImageLightbox
        images={images}
        open={open}
        index={index}
        onClose={handleClose}
        onIndexChange={setIndex}
      />
    </>
  );
}

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
  columnsClassName = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
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
              className="group relative block w-full overflow-hidden rounded-lg bg-muted/20 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Ampliar: ${image.alt}`}
            >
              <span className={`relative block ${aspectClassName} w-full overflow-hidden`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </span>
              {image.caption ? (
                <span className="block bg-card p-3 text-sm text-muted-foreground">{image.caption}</span>
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

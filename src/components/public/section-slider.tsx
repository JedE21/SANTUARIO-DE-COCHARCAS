'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import type { Slide } from '@/types/database';

/* ------------------------------------------------------------------ */
/*  Detección de luminosidad (cliente, onLoad)                         */
/* ------------------------------------------------------------------ */

/**
 * Luminancia percibida 0–1 (ITU-R BT.709 ponderada) muestreando la imagen
 * en un canvas pequeño. Se usa para adaptar el color del texto al fondo:
 *   luminosidad baja  → texto claro (blanco)
 *   luminosidad alta  → texto oscuro (marrón profundo)
 */
function measureLuminance(src: string): Promise<number> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(0.35);
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    const done = (v: number) => resolve(Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0.35);
    const timer = setTimeout(() => done(0.35), 4000); // red de seguridad

    img.onload = () => {
      clearTimeout(timer);
      try {
        const size = 48;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = Math.max(1, Math.round((size * img.naturalHeight) / Math.max(1, img.naturalWidth)));
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return done(0.35);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let total = 0;
        const px = data.length / 4;
        for (let i = 0; i < data.length; i += 4) {
          // Ponderación perceptual estándar
          total += (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
        }
        done(total / Math.max(1, px));
      } catch {
        done(0.35); // CORS/Tainted canvas: asume fondo oscuro
      }
    };
    img.onerror = () => {
      clearTimeout(timer);
      done(0.35);
    };
    img.src = src;
  });
}

/** Estilo de texto adaptado al fondo detectado. */
function contrastStyle(luminance: number): React.CSSProperties {
  const dark = luminance >= 0.6;
  return dark
    ? {
        color: '#2E2620',
        textShadow: '0 1px 14px rgba(255,255,255,0.45), 0 0 2px rgba(255,255,255,0.4)',
      }
    : {
        color: '#FDFCF8',
        textShadow: '0 1px 18px rgba(23,22,21,0.55), 0 0 2px rgba(23,22,21,0.4)',
      };
}

/** Overlay sutil que refuerza el contraste sin "caja negra". */
function overlayStyle(luminance: number): React.CSSProperties {
  if (luminance >= 0.6) {
    // Imagen clara: velo marfil muy tenue para asentar el texto oscuro.
    return {
      background:
        'linear-gradient(180deg, rgba(245,241,232,0.34) 0%, rgba(245,241,232,0.10) 45%, rgba(245,241,232,0.18) 100%)',
    };
  }
  // Imagen oscura: gradiente neutro clásico muy suave.
  return {
    background:
      'linear-gradient(180deg, rgba(23,22,21,0.30) 0%, rgba(23,22,21,0.06) 45%, rgba(23,22,21,0.42) 100%)',
  };
}

/* ------------------------------------------------------------------ */
/*  Componente                                                         */
/* ------------------------------------------------------------------ */

const SLIDE_DURATION_MS = 6500;

interface SectionSliderProps {
  slides: Slide[];
  /** Altura del carrusel (clases Tailwind para min-height del section). */
  heightClass?: string;
  /** Título accesible del carrusel. */
  label: string;
  /** Aria-label del botón CTA si el slide trae button_text. */
  priority?: boolean;
  /** Pantalla completa como el hero del inicio: 100svh y bajo el header transparente. */
  fullScreen?: boolean;
}

/**
 * Carrusel cinematográfico por sección: crossfade lento + Ken Burns muy
 * sutil, indicadores en línea, flechas elegantes y CONTRASTE AUTOMÁTICO
 * del texto según la luminosidad de cada fotografía (medida en el cliente).
 */
export function SectionSlider({
  slides,
  heightClass = 'min-h-[62svh] lg:min-h-[72svh]',
  label,
  priority = false,
  fullScreen = false,
}: SectionSliderProps) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = React.useState(0);
  const [lum, setLum] = React.useState<number | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const active = slides[index];

  // Autoplay con pausa cuando la pestaña no es visible
  React.useEffect(() => {
    if (slides.length < 2) return;
    const start = () => {
      stop();
      timerRef.current = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_DURATION_MS);
    };
    const stop = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [slides.length]);

  // Contraste automático: mide la imagen activa
  React.useEffect(() => {
    let cancelled = false;
    setLum(null);
    if (!active) return;
    void measureLuminance(active.image_url).then((v) => {
      if (!cancelled) setLum(v);
    });
    return () => {
      cancelled = true;
    };
  }, [active]);

  if (slides.length === 0) return null;

  const textStyle = contrastStyle(lum ?? 0.35); // mientras mide: asumir oscuro
  const go = (i: number) => setIndex(((i % slides.length) + slides.length) % slides.length);

  return (
    <section
      aria-label={label}
      className={`group relative flex overflow-hidden bg-negro text-blanco ${
        fullScreen ? '-mt-16 min-h-[100svh] lg:-mt-20' : heightClass
      }`}
    >
      {/* Fotografías en crossfade */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
            i === index ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <div className={`h-full w-full ${i === index && !reduced ? 'hero-kenburns' : ''}`}>
            <Image
              src={slide.image_url}
              alt={slide.title || 'Imagen del santuario'}
              fill
              priority={priority && i === 0}
              sizes="(max-width: 768px) 100vw, 100vw"
              className="object-cover"
              unoptimized={!slide.image_url.startsWith('/')}
            />
          </div>
        </div>
      ))}

      {/* Overlay adaptativo sutil */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 transition-opacity duration-700" style={overlayStyle(lum ?? 0.35)} />

      {/* Contenido del slide activo */}
      <div
        key={active?.id ?? 'empty'}
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 py-20 text-center sm:px-8"
        style={textStyle}
      >
        <div className="fade-up-on-slide" key={`t-${active?.id ?? 'empty'}`}>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] opacity-80 sm:text-[0.65rem]">
            {String(index + 1).padStart(2, '0')} · {label}
          </p>
          <h2 className="display-section mt-5 max-w-3xl sm:text-5xl lg:text-6xl">{active?.title}</h2>
          {active?.description ? (
            <p className="mx-auto mt-6 max-w-2xl font-heading text-lg italic leading-relaxed opacity-90 sm:text-xl">
              {active.description}
            </p>
          ) : null}
          {active?.button_text && active?.button_url ? (
            <Link
              href={active.button_url}
              className="group mt-10 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.28em]"
            >
              <span className="border-b border-current/40 pb-1.5 transition-opacity group-hover:opacity-75">
                {active.button_text}
              </span>
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          ) : null}
        </div>
      </div>

      {/* Controles: flechas discretas + indicadores en línea */}
      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Slide anterior"
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full p-2.5 text-blanco/70 opacity-0 transition-all duration-300 hover:bg-negro/25 hover:text-blanco focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-claro group-hover:opacity-100 sm:left-6"
            style={textStyle}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Slide siguiente"
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full p-2.5 text-blanco/70 opacity-0 transition-all duration-300 hover:bg-negro/25 hover:text-blanco focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-claro group-hover:opacity-100 sm:right-6"
            style={textStyle}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5" role="tablist" aria-label={`${label}: escenas`}>
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Escena ${i + 1}: ${slide.title || ''}`}
                onClick={() => go(i)}
                className="group flex h-6 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-claro"
              >
                <span
                  className={`block h-px transition-all duration-500 ${
                    i === index ? 'w-10 bg-dorado-claro' : 'w-5 bg-blanco/40 group-hover:bg-blanco/80'
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}

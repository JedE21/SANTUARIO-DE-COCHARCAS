'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { easeOutSoft, fadeUpStrong, heroStagger } from '@/components/motion/variants';

interface HeroCocharcasProps {
  badge: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  /** Slides administrados desde el panel (tabla `slides`, sección home). */
  slides?: HeroSlide[];
}

interface HeroSlide {
  src: string;
  alt: string;
}

/** Fotografías reales del Santuario y de la Virgen de Cocharcas
 *  (Wikimedia Commons, servidas localmente para máxima fiabilidad). */
const DEFAULT_SLIDES: HeroSlide[] = [
  {
    src: '/images/santuario/santuario-exterior.jpg',
    alt: 'Santuario de Cocharcas: torres y cúpulas de piedra entre los cerros de Apurímac',
  },
  {
    src: '/images/santuario/santuario-plaza.jpg',
    alt: 'Fachada principal del Santuario de Nuestra Señora de Cocharcas',
  },
  {
    src: '/images/santuario/pintura-detalle.jpg',
    alt: 'Nuestra Señora de Cocharcas, detalle de óleo colonial de 1751',
  },
  {
    src: '/images/santuario/pintura-colonial.jpg',
    alt: 'Nuestra Señora de Cocharcas, pintura colonial peruana de 1751',
  },
];

const SLIDE_DURATION_MS = 6500;

/**
 * Hero cinematográfico del Santuario: pantalla completa, fotografía real
 * protagonista en slider con crossfade lento, composición editorial centrada,
 * contador de escenas e indicador de descenso. Respeta prefers-reduced-motion.
 */
export function HeroCocharcas({ badge, title, description, imageUrl, slides: dbSlides }: HeroCocharcasProps) {
  const reduced = usePrefersReducedMotion();
  const ref = React.useRef<HTMLElement>(null);

  const slides = React.useMemo<HeroSlide[]>(() => {
    // Prioridad 1: slides administrados en el panel (sección home).
    if (dbSlides && dbSlides.length > 0) return dbSlides;
    // Prioridad 2: imagen de la sección hero configurada.
    if (imageUrl && !imageUrl.endsWith('.svg')) {
      return [{ src: imageUrl, alt: title }, ...DEFAULT_SLIDES.filter((s) => s.src !== imageUrl)];
    }
    return DEFAULT_SLIDES;
  }, [imageUrl, title, dbSlides]);

  const [index, setIndex] = React.useState(0);

  // Autoplay con crossfade; se pausa cuando la pestaña no es visible
  React.useEffect(() => {
    if (slides.length < 2) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      stop();
      timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_DURATION_MS);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [slides.length]);

  // Parallax muy sutil: el fondo se desplaza un poco más lento que la página
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '26%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const goTo = (i: number) => setIndex(i);

  return (
    <section
      ref={ref}
      aria-label={title}
      className="relative -mt-16 flex min-h-[100svh] flex-col overflow-hidden bg-negro text-blanco lg:-mt-20"
    >
      {/* ── Slider de fotografías (crossfade CSS, visible sin JS) ────── */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={reduced ? undefined : { y: imageY }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity ease-in-out ${
              i === index ? 'opacity-100' : 'opacity-0'
            } duration-[1400ms]`}
          >
            <div className={`h-full w-full ${i === index ? 'hero-kenburns' : ''}`}>
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Veladura sutil: legibilidad sin apagar la fotografía ───────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(23,22,21,0.58) 0%, rgba(23,22,21,0.22) 18%, rgba(23,22,21,0.10) 42%, rgba(23,22,21,0.60) 100%)',
        }}
      />
      {/* Viñeta muy tenue para centrar la mirada */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 44%, transparent 58%, rgba(23,22,21,0.32) 100%)',
        }}
      />

      {/* ── Composición editorial centrada ────────────────────────────── */}
      <motion.div
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-28 pt-32 text-center sm:px-6"
        style={reduced ? undefined : { y: textY, opacity: textOpacity }}
        initial={reduced ? false : 'hidden'}
        animate="visible"
        variants={heroStagger}
      >
        <motion.div
          aria-hidden="true"
          variants={fadeUpStrong}
          transition={{ duration: 0.9, ease: easeOutSoft }}
          className="flex items-center gap-4 text-blanco/85 sm:gap-5"
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-dorado-claro/80 sm:w-16" />
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.44em] sm:text-[0.65rem]">{badge}</span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-dorado-claro/80 sm:w-16" />
        </motion.div>

        <motion.h1
          variants={fadeUpStrong}
          transition={{ duration: 1, ease: easeOutSoft }}
          className="display-hero mt-8 max-w-5xl text-blanco [text-shadow:0_2px_30px_rgba(23,22,21,0.28)]"
        >
          {title}
        </motion.h1>

        <motion.p
          variants={fadeUpStrong}
          transition={{ duration: 1, ease: easeOutSoft }}
          className="mt-8 max-w-2xl font-heading text-xl italic leading-relaxed text-blanco/90 sm:text-2xl"
        >
          {description}
        </motion.p>

        <motion.div
          variants={fadeUpStrong}
          transition={{ duration: 1, ease: easeOutSoft }}
          className="mt-12"
        >
          <Link
            href="/santuario"
            className="group inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-blanco/90 transition-colors duration-300 hover:text-dorado-claro"
          >
            <span className="border-b border-blanco/40 pb-1.5 transition-colors duration-300 group-hover:border-dorado-claro/70">
              Descubrir el Santuario
            </span>
            <motion.span
              aria-hidden="true"
              animate={reduced ? undefined : { y: [0, 5, 0] }}
              transition={reduced ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ↓
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Pie del hero: numeración de escena + indicadores ──────────── */}
      <motion.div
        aria-hidden={false}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="relative z-10 flex items-center justify-between px-5 pb-8 sm:px-8 lg:px-12"
      >
        <p className="max-w-[16rem] text-[0.62rem] font-medium uppercase leading-relaxed tracking-[0.24em] text-blanco/60">
          Santuario histórico · Cocharcas, Chincheros
        </p>

        <div className="flex items-center gap-5">
          {slides.length > 1 ? (
            <div className="flex items-center gap-2.5" role="tablist" aria-label="Escenas del santuario">
              {slides.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Escena ${i + 1}: ${slide.alt}`}
                  onClick={() => goTo(i)}
                  className="group relative flex h-6 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-claro"
                >
                  <span
                    className={`block h-px transition-all duration-500 ${
                      i === index ? 'w-10 bg-dorado-claro' : 'w-5 bg-blanco/40 group-hover:bg-blanco/80'
                    }`}
                  />
                </button>
              ))}
            </div>
          ) : null}
          <p className="font-heading text-sm tabular-nums tracking-[0.2em] text-blanco/70">
            {String(index + 1).padStart(2, '0')}
            <span className="mx-1.5 text-blanco/40">/</span>
            <span className="text-blanco/50">{String(slides.length).padStart(2, '0')}</span>
          </p>
        </div>
      </motion.div>
    </section>
  );
}

import type { Transition, Variants } from 'framer-motion';

export const easeOutSoft: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const revealTransition: Transition = {
  duration: 0.55,
  ease: easeOutSoft,
};

export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

/* ------------------------------------------------------------------
 * Variantes extendidas (identidad Cocharcas: elegantes y sobrias)
 * ------------------------------------------------------------------ */

/** Desplazamiento un poco mas expresivo para elementos protagonistas. */
export const fadeUpStrong: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

/** Aparece anadiendo una micro-escala (imagenes, tarjetas principales). */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.975, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

/** Entrada lateral suave para composiciones editoriales. */
export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0 },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0 },
};

/** Linea dorada que crece desde el centro (separadores de seccion). */
export const lineGrow: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1 },
};

/** Transicion lenta y solemne (secciones de devocion, patrimonio). */
export const solemnTransition: Transition = {
  duration: 0.8,
  ease: easeOutSoft,
};

/** Contenedor de entrada coreografiada (hero: badge -> titulo -> texto -> botones). */
export const heroStagger: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

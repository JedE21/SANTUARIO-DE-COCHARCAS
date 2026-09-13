/**
 * Constantes compartidas del sistema de slides por sección.
 * Seguro de importar desde cliente y servidor (sin dependencias de Supabase).
 */

export const SLIDE_SECTIONS = [
  { value: 'home', label: 'Inicio' },
  { value: 'santuario', label: 'Santuario' },
  { value: 'fe-peregrinacion', label: 'Fe y Peregrinación' },
  { value: 'festividades', label: 'Festividades' },
  { value: 'historia', label: 'Historia' },
  { value: 'galeria', label: 'Galería' },
  { value: 'eventos', label: 'Eventos' },
  { value: 'noticias', label: 'Noticias' },
  { value: 'visita', label: 'Visita' },
  { value: 'contacto', label: 'Contacto' },
] as const;

export type SlideSectionValue = (typeof SLIDE_SECTIONS)[number]['value'];

export function isSlideSection(value: string): value is SlideSectionValue {
  return SLIDE_SECTIONS.some((s) => s.value === value);
}

export function slideSectionLabel(value: string): string {
  return SLIDE_SECTIONS.find((s) => s.value === value)?.label ?? value;
}

/**
 * Rutas cuyo carrusel de sección se muestra a pantalla completa (100svh,
 * por debajo del header transparente), igual que el hero del inicio.
 * Debe mantenerse en sync con las páginas que pasan `fullScreen` al SectionSlider.
 */
export const FULLSCREEN_SLIDER_ROUTES = [
  '/',
  '/santuario',
  '/fe',
  '/festividades',
  '/galeria',
  '/eventos',
  '/noticias',
  '/visita',
  '/contacto',
  '/santuario/historia',
] as const;

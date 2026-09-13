'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { FULLSCREEN_SLIDER_ROUTES } from '@/lib/slides';

export interface NavItem {
  label: string;
  href: string;
}

interface HeaderShellProps {
  siteName: string;
  navItems: NavItem[];
  className?: string;
}

/**
 * Navegación principal: en la portada flota transparente sobre el hero
 * (texto claro); al hacer scroll o en páginas internas se vuelve una
 * barra fina color marfil. Menú móvil de pantalla completa.
 */
export function HeaderShell({ siteName, navItems, className = '' }: HeaderShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();

  // Modo overlay en la portada y en las páginas con carrusel a pantalla completa
  const overlay = (FULLSCREEN_SLIDER_ROUTES as readonly string[]).includes(pathname);

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Accesibilidad: cerrar el menú móvil con Escape
  React.useEffect(() => {
    if (!isMobileMenuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    }
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMobileMenuOpen]);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  const overHero = overlay && !scrolled && !isMobileMenuOpen;

  return (
    <>
      <header
        className={`${className} sticky top-0 z-40 transition-all duration-500 ${
          overHero
            ? 'border-b border-transparent bg-transparent'
            : 'border-b border-marron/10 bg-marfil/95 shadow-[0_1px_0_rgba(58,48,41,0.04)] backdrop-blur-md'
        }`}
      >
        <div className="mx-auto max-w-[100rem] px-5 sm:px-8 lg:px-12">
          <div className="flex h-16 items-center justify-between lg:h-20">
            <Link
              href="/"
              className={`group flex items-baseline gap-2 transition-colors duration-500 ${
                overHero ? 'text-blanco' : 'text-marron'
              }`}
              aria-label={`${siteName} — Inicio`}
            >
              <span className="font-heading text-lg font-semibold leading-none tracking-[0.18em] sm:text-xl">
                COCHARCAS
              </span>
              <span
                className={`hidden text-[0.58rem] font-medium uppercase tracking-[0.3em] transition-colors duration-500 sm:block ${
                  overHero ? 'text-blanco/60' : 'text-tierra'
                }`}
              >
                Santuario Mariano
              </span>
            </Link>

            <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
              {navItems.map((item) => {
                if (item.href === '/') return null;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`group relative py-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${
                      overHero
                        ? active
                          ? 'text-dorado-claro'
                          : 'text-blanco/75 hover:text-blanco'
                        : active
                          ? 'text-dorado-oscuro'
                          : 'text-marron/70 hover:text-marron'
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-current transition-transform duration-300 ${
                        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-5">
              <Link
                href="/visita"
                className={`hidden items-center gap-2 border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.22em] transition-all duration-300 lg:inline-flex ${
                  overHero
                    ? 'border-blanco/40 text-blanco hover:border-blanco hover:bg-blanco hover:text-marron'
                    : 'border-marron/30 text-marron hover:border-marron hover:bg-marron hover:text-marfil'
                }`}
              >
                Visita
              </Link>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                className={`p-2 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado lg:hidden ${
                  overHero ? 'text-blanco' : 'text-marron'
                }`}
                aria-expanded={isMobileMenuOpen}
                aria-controls="menu-movil"
                aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                <span
                  className={`mb-[5px] block h-px w-6 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? 'translate-y-[3px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`block h-px w-6 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? '-translate-y-[3px] -rotate-45' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menú móvil: pantalla completa, editorial, sobrio */}
      <AnimatePresence initial={false}>
        {isMobileMenuOpen ? (
          <motion.div
            id="menu-movil"
            className="fixed inset-0 z-50 flex flex-col bg-negro text-marfil lg:hidden"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.35, ease: 'easeOut' }}
          >
            <div className="flex h-16 items-center justify-between px-5">
              <span className="font-heading text-lg font-semibold tracking-[0.18em] text-marfil">
                COCHARCAS
              </span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-marfil/80 transition-colors hover:text-marfil focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
                aria-label="Cerrar menú"
              >
                <span className="mb-[5px] block h-px w-6 translate-y-[3px] rotate-45 bg-current" />
                <span className="block h-px w-6 -translate-y-[3px] -rotate-45 bg-current" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center px-8" aria-label="Móvil">
              {navItems.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <motion.div
                    key={item.href}
                    initial={reduced ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduced ? 0 : 0.06 * index + 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={`group flex items-baseline justify-between border-b border-marfil/10 py-4 transition-colors duration-300 ${
                        active ? 'text-dorado-claro' : 'text-marfil hover:text-dorado-claro'
                      }`}
                    >
                      <span className="font-heading text-3xl font-medium">{item.label}</span>
                      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-marfil/40 group-hover:text-dorado-claro/70">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduced ? 0 : 0.5, duration: 0.5 }}
              className="px-8 pb-10"
            >
              <p className="text-[0.62rem] uppercase tracking-[0.28em] text-marfil/50">
                Cocharcas · Chincheros · Apurímac
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

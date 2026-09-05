'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

export interface NavItem {
  label: string;
  href: string;
}

interface HeaderShellProps {
  siteName: string;
  navItems: NavItem[];
  className?: string;
}

export function HeaderShell({ siteName, navItems, className = '' }: HeaderShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Scroll: contraer, reforzar fondo y añadir sombra suave
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Accesibilidad: cerrar el menú móvil con la tecla Escape
  React.useEffect(() => {
    if (!isMobileMenuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobileMenuOpen]);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <header
      className={`${className} sticky top-0 z-40 border-b border-blanco/10 bg-azul/95 backdrop-blur-md transition-[box-shadow] duration-300 ${
        scrolled ? 'shadow-[0_10px_30px_-12px_rgba(15,37,64,0.45)]' : ''
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-wrap items-center justify-between transition-all duration-300 ${scrolled ? 'py-2.5' : 'py-4'}`}>
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-dorado/60 bg-dorado/15">
              <span className="font-heading text-xs font-semibold tracking-wide text-dorado-claro">SC</span>
            </div>
            <Link
              href="/"
              className="max-w-[13rem] font-heading text-lg font-semibold leading-tight text-blanco transition-normal hover:text-dorado-claro sm:max-w-none sm:text-xl"
            >
              {siteName}
            </Link>
          </div>

          <nav className="hidden flex-1 items-center justify-center space-x-6 lg:flex" aria-label="Principal">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative py-1 text-sm font-medium transition-normal ${
                    active ? 'text-dorado-claro' : 'text-marfil/85 hover:text-blanco'
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 left-0 h-px w-full bg-dorado transition-transform duration-300 ${
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    } origin-left`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="rounded-md p-2 text-marfil/80 transition-normal hover:text-blanco focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado lg:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-controls="menu-movil"
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              <span className={`mb-1 block h-0.5 w-5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
              <span className={`mb-1 block h-0.5 w-5 bg-current transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
            </button>

            <Link
              href="/fe/solicitar-misa"
              className="group hidden items-center rounded-md border border-dorado/70 bg-dorado px-4 py-2 text-sm font-medium text-azul-oscuro transition-all duration-300 hover:bg-dorado-claro hover:shadow-[0_6px_16px_-6px_rgba(201,162,39,0.5)] sm:inline-flex"
            >
              Solicitar una Misa
              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isMobileMenuOpen ? (
          <motion.div
            id="menu-movil"
            className="overflow-hidden lg:hidden"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? { opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-4 mb-4 rounded-lg border border-blanco/10 bg-azul-oscuro/95 p-4 shadow-[0_16px_40px_-16px_rgba(15,37,64,0.6)] backdrop-blur-md">
              <nav className="space-y-1" aria-label="Móvil">
                {navItems.map((item, index) => {
                  const active = isActive(item.href);
                  return (
                    <motion.div
                      key={item.href}
                      initial={reduced ? false : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: reduced ? 0 : 0.03 * index, duration: 0.25 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-normal ${
                          active
                            ? 'bg-dorado/15 text-dorado-claro'
                            : 'text-marfil/85 hover:bg-blanco/5 hover:text-blanco'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
              <Link
                href="/fe/solicitar-misa"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-dorado px-4 py-3 text-sm font-medium text-azul-oscuro transition-normal hover:bg-dorado-claro"
              >
                Solicitar una Misa
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

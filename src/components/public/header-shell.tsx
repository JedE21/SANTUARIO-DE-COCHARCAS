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
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Accesibilidad: cerrar el menú móvil con la tecla Escape
  React.useEffect(() => {
    if (!isMobileMenuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <header className={`${className} sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-sm`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <span className="text-xs font-semibold text-primary">SNC</span>
            </div>
            <Link href="/" className="max-w-[14rem] font-heading text-lg font-semibold text-foreground sm:max-w-none sm:text-xl">
              {siteName}
            </Link>
          </div>

          <nav className="hidden flex-1 items-center justify-center space-x-5 lg:flex" aria-label="Principal">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`border-b-2 text-sm font-medium transition-normal ${
                    active
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:border-b-primary/50 hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="rounded-md p-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-controls="menu-movil"
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              <span className="sr-only">{isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
              <span className="mb-0.5 block h-0.5 w-5 bg-current" />
              <span className="mb-0.5 block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
            </button>

            <Link
              href="/fe/solicitar-misa"
              className="hidden items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-normal hover:bg-primary/90 sm:inline-flex"
            >
              Solicitar una Misa
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isMobileMenuOpen ? (
            <motion.div
              id="menu-movil"
              className="overflow-hidden pb-4 lg:hidden"
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reduced ? { opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="rounded-xl border border-border bg-background p-4 shadow-lg">
                <nav className="space-y-1" aria-label="Móvil">
                  {navItems.map((item) => {
                    const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={`block rounded-md px-3 py-2 text-sm font-medium transition-normal ${
                          active
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted/20 hover:text-foreground'
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                <Link
                  href="/fe/solicitar-misa"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-normal hover:bg-primary/90"
                >
                  Solicitar una Misa
                </Link>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}

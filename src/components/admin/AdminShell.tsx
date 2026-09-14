'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  CalendarDays,
  ChevronLeft,
  Church,
  GalleryThumbnails,
  Image as ImageIcon,
  Landmark,
  LayoutDashboard,
  Link2,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  PanelLeft,
  ScrollText,
  Settings,
  Sparkles,
  Tag,
} from 'lucide-react';
import { LogoutButton } from '@/components/admin/LogoutButton';

/**
 * Navegación declarativa del panel (serializable, definida en el shell).
 * La agrupación refleja la arquitectura de contenido del santuario.
 */
export const ADMIN_NAV_GROUPS = [
  {
    label: 'Inicio',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Contenido',
    items: [
      { href: '/admin/contenido/slides', label: 'Slides', icon: GalleryThumbnails },
      { href: '/admin/contenido/inicio', label: 'Inicio público', icon: Church },
      { href: '/admin/contenido/paginas', label: 'Páginas', icon: ScrollText },
      { href: '/admin/contenido/historia', label: 'Historia', icon: Landmark },
      { href: '/admin/contenido/noticias', label: 'Noticias', icon: Newspaper },
      { href: '/admin/contenido/eventos', label: 'Eventos', icon: CalendarDays },
      { href: '/admin/contenido/festividades', label: 'Festividades', icon: Sparkles },
      { href: '/admin/contenido/galeria', label: 'Galería', icon: ImageIcon },
      { href: '/admin/contenido/faq', label: 'FAQ', icon: ScrollText },
      { href: '/admin/contenido/avisos', label: 'Avisos', icon: Tag },
    ],
  },
  {
    label: 'Pastoral',
    items: [
      { href: '/admin/pastoral/misas', label: 'Misas', icon: Church },
      { href: '/admin/pastoral/sacramentos', label: 'Sacramentos', icon: ScrollText },
      { href: '/admin/pastoral/solicitudes', label: 'Solicitudes', icon: Mail },
    ],
  },
  {
    label: 'Multimedia',
    items: [
      { href: '/admin/multimedia/biblioteca', label: 'Biblioteca', icon: ImageIcon },
    ],
  },
  {
    label: 'Configuración',
    items: [
      { href: '/admin/configuracion/sitio', label: 'Sitio', icon: Settings },
      { href: '/admin/configuracion/contacto', label: 'Contacto', icon: Mail },
      { href: '/admin/configuracion/footer', label: 'Footer', icon: PanelLeft },
      { href: '/admin/configuracion/navegacion', label: 'Navegación', icon: Link2 },
      { href: '/admin/configuracion/seo', label: 'SEO', icon: Tag },
      { href: '/admin/configuracion/usuarios', label: 'Usuarios', icon: Activity },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { href: '/admin/auditoria/actividad', label: 'Auditoría', icon: Activity },
    ],
  },
] as const;

const STORAGE_KEY = 'admin-sidebar-collapsed';

interface AdminShellProps {
  email: string;
  role: string | null | undefined;
  children: React.ReactNode;
}

/**
 * Shell del panel: sidebar colapsable (persistida) + header fino.
 * En móvil la sidebar es un drawer sobre un velo oscuro.
 * La sesión/rol llegan verificados desde el layout del servidor.
 */
export function AdminShell({ email, role, children }: AdminShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Restaura preferencia de colapso (solo escritorio)
  React.useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === '1') setCollapsed(true);
  }, []);

  // Cierra el drawer al navegar
  React.useEffect(() => setDrawerOpen(false), [pathname]);

  // Bloquea el scroll cuando el drawer móvil está abierto
  React.useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      window.localStorage.setItem(STORAGE_KEY, prev ? '0' : '1');
      return !prev;
    });
  };

  const sectionName = React.useMemo(() => {
    for (const group of ADMIN_NAV_GROUPS) {
      for (const item of group.items) {
        if (pathname === item.href || pathname.startsWith(item.href + '/')) {
          return item.label;
        }
      }
    }
    return 'Panel';
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  /* ------------------------- Navegación ------------------------- */
  const renderNav = (compact: boolean) => (
    <nav className="flex-1 space-y-5 overflow-y-auto px-2.5 py-5" aria-label="Panel">
      {ADMIN_NAV_GROUPS.map((group) => (
        <div key={group.label}>
          {!compact ? (
            <p className="px-2.5 pb-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-blanco/35">
              {group.label}
            </p>
          ) : (
            <div className="mx-2.5 mb-1.5 h-px bg-blanco/10" aria-hidden="true" />
          )}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    title={compact ? item.label : undefined}
                    className={`group relative flex items-center rounded-md text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-claro ${
                      compact ? 'justify-center px-0 py-2.5' : 'gap-2.5 px-2.5 py-2'
                    } ${
                      active
                        ? 'bg-blanco/10 font-medium text-blanco'
                        : 'text-blanco/60 hover:bg-blanco/5 hover:text-blanco/90'
                    }`}
                  >
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 h-4 w-0.5 rounded-full bg-dorado-claro"
                      />
                    )}
                    <item.icon
                      className={`h-4 w-4 shrink-0 ${active ? 'text-dorado-claro' : ''}`}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    {!compact && <span className="truncate">{item.label}</span>}
                    {compact && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-md bg-negro px-2.5 py-1.5 text-xs font-medium text-blanco shadow-lg group-hover:block"
                      >
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  /* ------------------------- Identidad + usuario ------------------------- */
  const renderBrand = (compact: boolean) => (
    <div className={`border-b border-blanco/10 ${compact ? 'px-2 py-5 text-center' : 'px-5 py-5'}`}>
      {compact ? (
        <span className="font-heading text-lg font-semibold leading-none text-dorado-claro" aria-label="Santuario de Cocharcas — Panel">
          SC
        </span>
      ) : (
        <>
          <p className="font-heading text-base font-semibold leading-tight text-blanco">
            Santuario de
            <br />
            Cocharcas
          </p>
          <p className="mt-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-blanco/40">
            Panel de administración
          </p>
        </>
      )}
    </div>
  );

  const renderUser = (compact: boolean) => (
    <div className={`border-t border-blanco/10 ${compact ? 'px-2 py-4' : 'px-4 py-4'}`}>
      {compact ? (
        <div className="flex flex-col items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-blanco/10 text-xs font-semibold text-blanco"
            title={email}
          >
            {email.slice(0, 2).toUpperCase()}
          </span>
          <LogoutButton compact />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blanco/10 text-xs font-semibold text-blanco"
          >
            {email.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-blanco" title={email}>
              {email}
            </p>
            <p className="text-[0.62rem] text-blanco/40">{role ?? 'Usuario'}</p>
          </div>
        </div>
      )}
    </div>
  );

  /* ------------------------- Render ------------------------- */
  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* ── Sidebar escritorio (colapsable) ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden flex-col bg-negro text-blanco transition-[width] duration-300 lg:flex ${
          collapsed ? 'w-[4.5rem]' : 'w-64'
        }`}
      >
        {renderBrand(collapsed)}
        {renderNav(collapsed)}
        {renderUser(collapsed)}
        <div className="border-t border-blanco/10 px-2 py-2">
          <button
            type="button"
            onClick={toggleCollapsed}
            className="flex w-full items-center justify-center rounded-md py-2 text-blanco/50 transition-colors hover:bg-blanco/5 hover:text-blanco focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-claro"
            aria-label={collapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </aside>

      {/* ── Drawer móvil ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-negro/60 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-negro text-blanco shadow-xl">
            {renderBrand(false)}
            {renderNav(false)}
            {renderUser(false)}
            <div className="px-4 py-3">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}

      {/* ── Contenido principal ── */}
      <div
        className={`flex min-h-screen flex-col transition-[padding] duration-300 ${
          collapsed ? 'lg:pl-[4.5rem]' : 'lg:pl-64'
        }`}
      >
        {/* Header fino del panel */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-piedra/25 bg-blanco/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="rounded-md p-2 -ml-2 text-marron transition-colors hover:bg-marfil focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-oscuro lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Breadcrumb mínimo */}
          <div className="flex min-w-0 items-center gap-2 text-sm">
            <span className="hidden text-tierra sm:inline">Admin</span>
            <span aria-hidden="true" className="hidden text-piedra sm:inline">/</span>
            <span className="truncate font-medium text-marron">{sectionName}</span>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-xs text-muted-foreground md:block">{email}</span>
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-marfil text-[0.62rem] font-semibold text-marron ring-1 ring-piedra/40"
            >
              {email.slice(0, 2).toUpperCase()}
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[100rem] flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>

        <footer className="border-t border-piedra/20 px-4 py-5 text-center text-[0.68rem] text-muted-foreground sm:px-6 lg:px-8">
          Santuario de Nuestra Señora de Cocharcas · Panel administrativo
        </footer>
      </div>
    </div>
  );
}

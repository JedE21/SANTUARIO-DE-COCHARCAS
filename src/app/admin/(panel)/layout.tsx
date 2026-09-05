import Link from 'next/link';
import { LogoutButton } from '@/components/admin/LogoutButton';
import { requireAdminPage } from '@/lib/security/guards';

const navGroups = [
  {
    label: 'Principal',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard' },
    ],
  },
  {
    label: 'Contenido',
    items: [
      { href: '/admin/contenido/inicio', label: 'Inicio' },
      { href: '/admin/contenido/paginas', label: 'Páginas' },
      { href: '/admin/contenido/noticias', label: 'Noticias' },
      { href: '/admin/contenido/eventos', label: 'Eventos' },
      { href: '/admin/contenido/festividades', label: 'Festividades' },
      { href: '/admin/contenido/galeria', label: 'Galería' },
      { href: '/admin/contenido/faq', label: 'FAQ' },
      { href: '/admin/contenido/avisos', label: 'Avisos' },
    ],
  },
  {
    label: 'Pastoral',
    items: [
      { href: '/admin/pastoral/misas', label: 'Misas' },
      { href: '/admin/pastoral/sacramentos', label: 'Sacramentos' },
      { href: '/admin/pastoral/solicitudes', label: 'Solicitudes' },
    ],
  },
  {
    label: 'Multimedia',
    items: [
      { href: '/admin/multimedia/biblioteca', label: 'Biblioteca' },
    ],
  },
  {
    label: 'Configuración',
    items: [
      { href: '/admin/configuracion/sitio', label: 'Sitio' },
      { href: '/admin/configuracion/contacto', label: 'Contacto' },
      { href: '/admin/configuracion/navegacion', label: 'Navegación' },
      { href: '/admin/configuracion/seo', label: 'SEO' },
      { href: '/admin/configuracion/usuarios', label: 'Usuarios' },
    ],
  },
  {
    label: 'Auditoría',
    items: [
      { href: '/admin/auditoria/actividad', label: 'Actividad' },
    ],
  },
];

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  // Defensa en profundidad: ademas del middleware, el layout del panel
  // re-verifica la sesion firmada antes de renderizar cualquier contenido.
  const session = await requireAdminPage();

  return (
    <div className="flex min-h-screen bg-marfil">
      <aside className="w-64 shrink-0 border-r border-piedra/20 bg-carbone text-blanco">
        <div className="border-b border-blanco/10 p-6">
          <h1 className="text-xl font-bold text-dorado">Admin Santuario</h1>
          <p className="mt-1 text-xs text-blanco/60">Panel de administración</p>
        </div>
        <nav className="mt-4 space-y-5 overflow-y-auto px-3 pb-6">          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 text-xs font-semibold uppercase tracking-wide text-blanco/50">{group.label}</p>
              <ul className="mt-2 space-y-1">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-sm text-blanco/90 transition-normal hover:bg-blanco/10"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <LogoutButton />
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-piedra/20 bg-blanco px-6 py-4">
          <h1 className="text-xl font-semibold text-carbone">Panel de administración</h1>
          <p className="text-xs text-carbone/60">{session.email}</p>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

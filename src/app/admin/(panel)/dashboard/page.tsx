import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { getNewsList, getEventsList, getGalleryItems, getMassSchedules } from '@/lib/queries';
import { getPendingRequestsCount, getRecentPendingRequests, getAuditLogsAdmin } from '@/lib/queries-admin';
import { requestStatusLabel } from '@/lib/constants/request-status';

export const dynamic = 'force-dynamic';

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }).replace(/\./g, '');
}

function formatTime(value: string | null | undefined): string {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}

/** Saludo según la hora local del servidor. */
function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

const ACTION_LABELS: Record<string, string> = {
  'auth.login': 'Inicio de sesión',
  'auth.login_failed': 'Login fallido',
  'auth.login_denied': 'Login sin permisos',
  'auth.logout': 'Cierre de sesión',
  insert: 'Creó',
  update: 'Actualizó',
  delete: 'Eliminó',
  update_status: 'Cambió estado de',
  create_user: 'Creó usuario',
  set_role: 'Cambió rol de',
  set_active: 'Activó cuenta',
};

const quickActions = [
  { href: '/admin/contenido/noticias', label: 'Nueva noticia' },
  { href: '/admin/contenido/eventos', label: 'Nuevo evento' },
  { href: '/admin/multimedia/biblioteca', label: 'Subir fotografía' },
  { href: '/admin/pastoral/misas', label: 'Actualizar horarios' },
  { href: '/admin/configuracion/sitio', label: 'Información del Santuario' },
];

export default async function AdminDashboard() {
  const [news, events, gallery, schedules, pendingRequests, recentPending, activity] = await Promise.all([
    getNewsList(100),
    getEventsList(),
    getGalleryItems(),
    getMassSchedules(),
    getPendingRequestsCount(),
    getRecentPendingRequests(5),
    getAuditLogsAdmin(6),
  ]);

  const published = news.filter((n) => n.status === 'published').length;

  const stats = [
    { label: 'Contenido publicado', value: published, href: '/admin/contenido/noticias' },
    { label: 'Noticias', value: news.length, href: '/admin/contenido/noticias' },
    { label: 'Eventos', value: events.length, href: '/admin/contenido/eventos' },
    { label: 'Solicitudes pendientes', value: pendingRequests, href: '/admin/pastoral/solicitudes', highlight: pendingRequests > 0 },
  ];

  return (
    <div className="space-y-10">
      {/* ── Saludo ── */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-marron sm:text-2xl">
          {greeting()}, Administrador
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Gestiona y supervisa el contenido del Santuario.
        </p>
      </div>

      {/* ── Indicadores (datos reales de Supabase) ── */}
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-piedra/30 bg-piedra/30 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`group bg-blanco p-5 transition-colors hover:bg-marfil/60 sm:p-6 ${stat.highlight ? 'ring-1 ring-inset ring-dorado/60' : ''}`}
          >
            <dt className="flex items-center justify-between text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-tierra">
              {stat.label}
              <ArrowUpRight
                className="h-3.5 w-3.5 text-piedra transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-dorado-oscuro"
                aria-hidden="true"
              />
            </dt>
            <dd
              className={`mt-3 font-heading text-4xl font-medium tabular-nums ${stat.highlight ? 'text-dorado-oscuro' : 'text-marron'}`}
            >
              {stat.value}
            </dd>
          </Link>
        ))}
      </dl>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* ── Solicitudes pendientes ── */}
        <section className="rounded-lg border border-piedra/30 bg-blanco p-6">
          <div className="mb-2 flex items-center justify-between gap-4">
            <h2 className="font-heading text-lg font-medium text-marron">Solicitudes pendientes</h2>
            <Link
              href="/admin/pastoral/solicitudes"
              className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-tierra transition-colors hover:text-dorado-oscuro"
            >
              Ver todas
            </Link>
          </div>
          {recentPending.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hay solicitudes pendientes. Todo al día.
            </p>
          ) : (
            <ul className="divide-y divide-piedra/15">
              {recentPending.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-marron">
                      {r.request_number ?? '—'}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        {r.kind === 'mass' ? 'Misa' : 'Sacramento'}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.requester_name} · {formatDate(r.requested_date)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[0.68rem] font-semibold text-amber-900">
                    {requestStatusLabel(r.status)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ── Actividad reciente (auditoría real) ── */}
        <section className="rounded-lg border border-piedra/30 bg-blanco p-6">
          <div className="mb-2 flex items-center justify-between gap-4">
            <h2 className="font-heading text-lg font-medium text-marron">Actividad reciente</h2>
            <Link
              href="/admin/auditoria/actividad"
              className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-tierra transition-colors hover:text-dorado-oscuro"
            >
              Ver todo
            </Link>
          </div>
          {activity.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aún no hay actividad registrada.
            </p>
          ) : (
            <ul className="divide-y divide-piedra/15">
              {activity.map((log) => (
                <li key={log.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-marron">
                      <span className="font-medium">{ACTION_LABELS[log.action] ?? log.action}</span>{' '}
                      <span className="text-muted-foreground">{log.entity_type}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {typeof log.metadata?.actor === 'string' ? String(log.metadata.actor) : 'sistema'}
                    </p>
                  </div>
                  <span className="shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                    {formatDate(log.created_at)}
                    {formatTime(log.created_at) ? ` · ${formatTime(log.created_at)}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* ── Acciones rápidas ── */}
      <section className="rounded-lg border border-piedra/30 bg-blanco p-6">
        <h2 className="font-heading text-lg font-medium text-marron">Acciones rápidas</h2>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
          {quickActions.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between gap-2 rounded-md border border-piedra/40 px-4 py-3 text-sm font-medium text-marron transition-colors hover:border-dorado hover:bg-marfil focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-oscuro"
            >
              {item.label}
              <ArrowRight
                className="h-3.5 w-3.5 shrink-0 text-piedra transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-dorado-oscuro"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

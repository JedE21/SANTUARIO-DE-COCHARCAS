import Link from 'next/link';
import { getNewsList, getEventsList, getGalleryItems, getMassSchedules } from '@/lib/queries';
import { getPendingRequestsCount, getRecentPendingRequests, getAuditLogsAdmin } from '@/lib/queries-admin';
import { requestStatusLabel } from '@/lib/constants/request-status';

export const dynamic = 'force-dynamic';

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
}

export default async function AdminDashboard() {
  const [news, events, gallery, schedules, pendingRequests, recentPending, activity] = await Promise.all([
    getNewsList(100),
    getEventsList(),
    getGalleryItems(),
    getMassSchedules(),
    getPendingRequestsCount(),
    getRecentPendingRequests(5),
    getAuditLogsAdmin(8),
  ]);

  const cards = [
    { label: 'Noticias', value: news.length, href: '/admin/contenido/noticias' },
    { label: 'Eventos', value: events.length, href: '/admin/contenido/eventos' },
    { label: 'Fotografías', value: gallery.length, href: '/admin/contenido/galeria' },
    { label: 'Horarios de misa', value: schedules.length, href: '/admin/pastoral/misas' },
    { label: 'Solicitudes pendientes', value: pendingRequests, href: '/admin/pastoral/solicitudes', highlight: pendingRequests > 0 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-carbone">Bienvenido al panel</h2>
        <p className="mt-1 text-sm text-carbone/60">
          Administra el contenido del Santuario de Nuestra Señora de Cocharcas.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`rounded-lg bg-blanco p-6 shadow-md transition-shadow hover:shadow-lg ${card.highlight ? 'ring-2 ring-dorado/60' : ''}`}
          >
            <div className="text-sm font-medium text-carbone/50">{card.label}</div>
            <div className="mt-2 text-3xl font-bold text-dorado">{card.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-blanco p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-carbone">Solicitudes pendientes</h3>
            <Link href="/admin/pastoral/solicitudes" className="text-sm font-medium text-primary hover:underline">
              Ver todas →
            </Link>
          </div>
          {recentPending.length === 0 ? (
            <p className="py-6 text-center text-sm text-carbone/60">No hay solicitudes pendientes. ¡Excelente trabajo pastoral!</p>
          ) : (
            <ul className="divide-y divide-piedra/10">
              {recentPending.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-carbone">
                      {r.request_number ?? '—'} <span className="text-xs text-carbone/50">({r.kind === 'mass' ? 'Misa' : 'Sacramento'})</span>
                    </p>
                    <p className="text-xs text-carbone/60">{r.requester_name} · {formatDate(r.requested_date)}</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
                    {requestStatusLabel(r.status)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg bg-blanco p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-carbone">Actividad reciente</h3>
            <Link href="/admin/auditoria/actividad" className="text-sm font-medium text-primary hover:underline">
              Ver todo →
            </Link>
          </div>
          {activity.length === 0 ? (
            <p className="py-6 text-center text-sm text-carbone/60">Aún no hay actividad registrada.</p>
          ) : (
            <ul className="divide-y divide-piedra/10">
              {activity.map((log) => (
                <li key={log.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-carbone">
                      <span className="font-medium">{log.action}</span> · {log.entity_type}
                    </p>
                    <p className="text-xs text-carbone/50">
                      {typeof log.metadata?.actor === 'string' ? String(log.metadata.actor) : 'sistema'}
                    </p>
                  </div>
                  <span className="text-xs text-carbone/50">{formatDate(log.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-blanco p-6 shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-carbone">Accesos rápidos</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: '/admin/contenido/noticias', label: 'Publicar noticia' },
            { href: '/admin/multimedia/biblioteca', label: 'Subir fotografía' },
            { href: '/admin/pastoral/solicitudes', label: 'Gestionar solicitudes' },
            { href: '/admin/configuracion/sitio', label: 'Configurar sitio' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md border border-piedra/20 px-4 py-3 text-sm font-medium text-carbone transition-normal hover:border-dorado hover:bg-marfil"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

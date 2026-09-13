import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getAuditLogsAdmin } from '@/lib/queries-admin';

export const dynamic = 'force-dynamic';

const ACTION_LABELS: Record<string, string> = {
  'auth.login': 'Inicio de sesión',
  'auth.login_failed': 'Login fallido',
  'auth.login_denied': 'Login sin permisos',
  'auth.login_blocked': 'Acceso bloqueado',
  'auth.logout': 'Cierre de sesión',
  insert: 'Creación',
  update: 'Actualización',
  delete: 'Eliminación',
  update_status: 'Cambio de estado',
  create_user: 'Creación de usuario',
  set_role: 'Cambio de rol',
  set_active: 'Activación de cuenta',
};

/** Severidad visual discreta por tipo de acción. */
const ACTION_SEVERITY: Record<string, 'success' | 'warning' | 'danger'> = {
  insert: 'success',
  update: 'success',
  update_status: 'success',
  delete: 'danger',
  'auth.login_failed': 'warning',
  'auth.login_denied': 'warning',
  'auth.login_blocked': 'danger',
};

const BADGE_STYLES: Record<string, string> = {
  success: 'border-green-200 bg-green-50 text-green-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  danger: 'border-red-200 bg-red-50 text-red-800',
};

const BADGE_LABELS: Record<string, string> = {
  success: 'Éxito',
  warning: 'Advertencia',
  danger: 'Error',
};

function formatDateTime(value: string | null): { date: string; time: string } {
  if (!value) return { date: '—', time: '' };
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return { date: value, time: '' };
  return {
    date: d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\./g, '').toUpperCase(),
    time: d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
  };
}

export default async function AdminAuditoriaPage() {
  const logs = await getAuditLogsAdmin(100);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Auditoría del sistema"
        description="Últimas 100 acciones administrativas registradas (inicios de sesión, cambios de contenido y gestión de solicitudes)."
      />
      {logs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-piedra/50 bg-blanco p-10 text-center text-sm text-muted-foreground">
          Aún no hay actividad registrada. Las acciones del panel aparecerán aquí automáticamente.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-piedra/30 bg-blanco">
          <table className="min-w-full divide-y divide-piedra/20 text-sm">
            <thead className="bg-marfil/60">
              <tr>
                {['Fecha', 'Hora', 'Acción', 'Módulo', 'Usuario', 'Resultado', 'Detalle'].map((label) => (
                  <th
                    key={label}
                    className="whitespace-nowrap px-4 py-3 text-left text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-tierra"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-piedra/15">
              {logs.map((log) => {
                const { date, time } = formatDateTime(log.created_at);
                const severity = ACTION_SEVERITY[log.action] ?? 'success';
                const actor = typeof log.metadata?.actor === 'string' ? String(log.metadata.actor) : '—';
                const detail =
                  Object.entries(log.metadata ?? {})
                    .filter(([k]) => !['actor', 'role'].includes(k))
                    .map(([k, v]) => `${k}: ${String(v)}`)
                    .join(' · ') || '—';
                return (
                  <tr key={log.id} className="transition-colors hover:bg-marfil/40">
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-marron/85">{date}</td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-marron/70">{time}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-marron">
                      {ACTION_LABELS[log.action] ?? log.action}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-marron/80">{log.entity_type}</td>
                    <td className="max-w-[12rem] truncate px-4 py-3 text-marron/80" title={actor}>
                      {actor}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex whitespace-nowrap items-center rounded-full border px-2.5 py-0.5 text-[0.68rem] font-semibold ${BADGE_STYLES[severity]}`}
                      >
                        {BADGE_LABELS[severity]}
                      </span>
                    </td>
                    <td className="max-w-[16rem] truncate px-4 py-3 text-xs text-muted-foreground" title={detail}>
                      {detail}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

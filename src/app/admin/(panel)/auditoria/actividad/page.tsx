import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getAuditLogsAdmin } from '@/lib/queries-admin';

export const dynamic = 'force-dynamic';

const ACTION_LABELS: Record<string, string> = {
  'auth.login': 'Inicio de sesión',
  'auth.login_failed': 'Login fallido',
  'auth.login_denied': 'Login sin permisos',
  'auth.logout': 'Cierre de sesión',
  insert: 'Creación',
  update: 'Actualización',
  delete: 'Eliminación',
  update_status: 'Cambio de estado',
  create_user: 'Creación de usuario',
  set_role: 'Cambio de rol',
  set_active: 'Activación de cuenta',
};

function formatDateTime(value: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default async function AdminAuditoriaPage() {
  const logs = await getAuditLogsAdmin(100);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Actividad del sistema"
        description="Últimas 100 acciones administrativas registradas (inicios de sesión, cambios de contenido y gestión de solicitudes)."
      />
      {logs.length === 0 ? (
        <div className="rounded-lg border border-piedra/20 bg-blanco p-8 text-center text-sm text-carbone/60">
          Aún no hay actividad registrada. Las acciones del panel aparecerán aquí automáticamente.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-piedra/20 bg-blanco shadow-sm">
          <table className="min-w-full divide-y divide-piedra/10 text-sm">
            <thead className="bg-marfil">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-carbone">Fecha</th>
                <th className="px-4 py-3 text-left font-semibold text-carbone">Acción</th>
                <th className="px-4 py-3 text-left font-semibold text-carbone">Entidad</th>
                <th className="px-4 py-3 text-left font-semibold text-carbone">Actor</th>
                <th className="px-4 py-3 text-left font-semibold text-carbone">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-piedra/10">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-marfil/50">
                  <td className="px-4 py-3 whitespace-nowrap text-carbone/80">{formatDateTime(log.created_at)}</td>
                  <td className="px-4 py-3 text-carbone/80">{ACTION_LABELS[log.action] ?? log.action}</td>
                  <td className="px-4 py-3 text-carbone/80">{log.entity_type}</td>
                  <td className="px-4 py-3 text-carbone/80">
                    {typeof log.metadata?.actor === 'string' ? String(log.metadata.actor) : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-carbone/60">
                    {Object.entries(log.metadata ?? {})
                      .filter(([k]) => !['actor', 'role'].includes(k))
                      .map(([k, v]) => `${k}: ${String(v)}`)
                      .join(' · ') || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

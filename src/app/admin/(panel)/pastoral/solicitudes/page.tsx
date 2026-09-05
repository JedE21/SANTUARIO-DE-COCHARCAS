import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { SolicitudesManager, type UnifiedRequest } from '@/components/admin/SolicitudesManager';
import { getAllMassRequestsAdmin, getAllSacramentRequestsAdmin } from '@/lib/queries-admin';
import { getSacraments } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function AdminSolicitudesPage() {
  const [massRequests, sacramentRequests, sacraments] = await Promise.all([
    getAllMassRequestsAdmin(),
    getAllSacramentRequestsAdmin(),
    getSacraments(),
  ]);

  const sacramentNames = new Map(sacraments.map((s) => [s.id, s.name]));

  const requests: UnifiedRequest[] = [
    ...massRequests.map((row) => ({
      id: row.id,
      kind: 'mass' as const,
      request_number: row.request_number ?? null,
      requester_name: row.requester_name,
      requester_email: row.requester_email,
      phone: row.phone,
      requested_date: row.requested_date,
      preferred_time: row.preferred_time,
      intention_type: row.intention_type,
      intention: row.intention,
      notes: row.notes,
      status: row.status,
      admin_notes: row.admin_notes,
      created_at: row.created_at,
    })),
    ...sacramentRequests.map((row) => ({
      id: row.id,
      kind: 'sacrament' as const,
      request_number: row.request_number ?? null,
      requester_name: row.requester_name,
      requester_email: row.requester_email,
      phone: row.phone,
      requested_date: row.requested_date,
      sacrament_name: row.sacrament_id ? sacramentNames.get(row.sacrament_id) ?? 'Sacramento' : null,
      notes: row.notes,
      status: row.status,
      admin_notes: row.admin_notes,
      created_at: row.created_at,
    })),
  ].sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''));

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Solicitudes pastorales"
        description="Gestiona misas y sacramentos: revisa, acepta, rechaza o marca como atendidas. Las notas internas no son visibles para el solicitante."
      />
      <SolicitudesManager requests={requests} />
    </div>
  );
}

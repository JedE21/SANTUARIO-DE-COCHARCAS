import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminCrud } from '@/components/admin/AdminCrud';
import { getAllMassSchedulesAdmin } from '@/lib/queries-admin';

export const dynamic = 'force-dynamic';

export default async function AdminMisasPage() {
  const schedules = await getAllMassSchedulesAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Horarios de misa" description="Administra los horarios de celebración eucarística." />
      <AdminCrud
        table="mass_schedules"
        rows={schedules}
        entityLabel="horario"
        emptyMessage="No hay horarios configurados."
        columns={[
          { key: 'day_of_week', label: 'Día' },
          { key: 'time', label: 'Hora' },
          { key: 'place', label: 'Lugar' },
          { key: 'active', label: 'Activo', type: 'boolean' },
        ]}
        fields={[
          { name: 'day_of_week', label: 'Día', required: true },
          { name: 'time', label: 'Hora (HH:MM)', type: 'time', required: true },
          { name: 'place', label: 'Lugar' },
          { name: 'description', label: 'Descripción', type: 'textarea' },
          {
            name: 'active',
            label: 'Activo',
            type: 'select',
            options: [
              { value: 'true', label: 'Sí' },
              { value: 'false', label: 'No' },
            ],
          },
        ]}
      />
    </div>
  );
}

import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminSaveForm } from '@/components/admin/AdminSaveForm';
import { getAllMassSchedulesAdmin } from '@/lib/queries-admin';

export default async function AdminMisasPage() {
  const schedules = await getAllMassSchedulesAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Horarios de misa" description="Administra los horarios de celebración eucarística." />
      <AdminTable
        rows={schedules}
        columns={[
          { key: 'day_of_week', label: 'Día' },
          { key: 'time', label: 'Hora' },
          { key: 'place', label: 'Lugar' },
          {
            key: 'active',
            label: 'Activo',
            render: (row) => (row.active ? 'Sí' : 'No'),
          },
        ]}
      />
      <AdminSaveForm
        table="mass_schedules"
        submitLabel="Agregar horario"
        fields={[
          { name: 'day_of_week', label: 'Día', required: true },
          { name: 'time', label: 'Hora (HH:MM)', required: true },
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
            defaultValue: 'true',
          },
        ]}
      />
    </div>
  );
}

import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminCrud } from '@/components/admin/AdminCrud';
import { getAllEventsAdmin } from '@/lib/queries-admin';

export const dynamic = 'force-dynamic';

export default async function AdminEventosPage() {
  const events = await getAllEventsAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Eventos" description="Crea, edita y gestiona los eventos del santuario." />
      <AdminCrud
        table="events"
        rows={events}
        emptyMessage="No hay eventos registrados."
        columns={[
          { key: 'title', label: 'Título' },
          { key: 'location', label: 'Lugar' },
          { key: 'status', label: 'Estado' },
          {
            key: 'start_date',
            label: 'Fecha',
            render: (row) => (row.start_date ? new Date(`${row.start_date}T00:00:00`).toLocaleDateString('es-PE') : '—'),
          },
        ]}
        fields={[
          { name: 'title', label: 'Título', required: true },
          { name: 'slug', label: 'Slug', required: true },
          { name: 'description', label: 'Descripción', type: 'textarea', required: true },
          { name: 'image_url', label: 'Imagen (URL)', type: 'url' },
          { name: 'location', label: 'Lugar' },
          { name: 'start_date', label: 'Fecha de inicio', type: 'date', required: true },
          { name: 'end_date', label: 'Fecha de fin', type: 'date' },
          {
            name: 'status',
            label: 'Estado',
            type: 'select',
            options: [
              { value: 'draft', label: 'Borrador' },
              { value: 'published', label: 'Publicado' },
              { value: 'archived', label: 'Archivado' },
            ],
          },
        ]}
      />
    </div>
  );
}

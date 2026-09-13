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
        entityLabel="evento"
        emptyMessage="No hay eventos registrados."
        columns={[
          { key: 'title', label: 'Evento' },
          { key: 'start_date', label: 'Fecha', type: 'date' },
          { key: 'status', label: 'Estado', type: 'status' },
          { key: 'location', label: 'Lugar' },
        ]}
        fields={[
          { name: 'title', label: 'Título', required: true },
          { name: 'slug', label: 'Slug', required: true },
          { name: 'description', label: 'Descripción', type: 'textarea', required: true, group: 'content', fullWidth: true },
          { name: 'image_url', label: 'Imagen (URL)', type: 'url', group: 'content', fullWidth: true },
          { name: 'location', label: 'Lugar', group: 'content' },
          { name: 'start_date', label: 'Fecha de inicio', type: 'date', required: true, group: 'publication' },
          { name: 'end_date', label: 'Fecha de fin', type: 'date', group: 'publication' },
          {
            name: 'status',
            label: 'Estado',
            type: 'select',
            group: 'publication',
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

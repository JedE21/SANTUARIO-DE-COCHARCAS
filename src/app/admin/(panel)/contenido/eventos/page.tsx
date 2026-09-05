import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminSaveForm } from '@/components/admin/AdminSaveForm';
import { getAllEventsAdmin } from '@/lib/queries-admin';

export default async function AdminEventosPage() {
  const events = await getAllEventsAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Eventos" description="Administra la agenda de eventos y actividades." />
      <AdminTable
        rows={events}
        columns={[
          { key: 'title', label: 'Título' },
          { key: 'location', label: 'Lugar' },
          { key: 'status', label: 'Estado' },
          {
            key: 'start_date',
            label: 'Fecha',
            render: (row) => new Date(row.start_date).toLocaleDateString('es-PE'),
          },
        ]}
      />
      <AdminSaveForm
        table="events"
        submitLabel="Crear evento"
        fields={[
          { name: 'title', label: 'Título', required: true },
          { name: 'slug', label: 'Slug', required: true },
          { name: 'description', label: 'Descripción', type: 'textarea', required: true },
          { name: 'location', label: 'Lugar' },
          { name: 'start_date', label: 'Fecha de inicio', type: 'date', required: true },
          { name: 'end_date', label: 'Fecha de fin', type: 'date' },
          { name: 'image_url', label: 'Imagen (URL)', type: 'url' },
          {
            name: 'status',
            label: 'Estado',
            type: 'select',
            defaultValue: 'draft',
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

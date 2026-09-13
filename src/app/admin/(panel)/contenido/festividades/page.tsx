import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminCrud } from '@/components/admin/AdminCrud';
import { getAllFestivitiesAdmin } from '@/lib/queries-admin';

export const dynamic = 'force-dynamic';

export default async function AdminFestividadesPage() {
  const festivities = await getAllFestivitiesAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Festividades" description="Gestiona las celebraciones y su programa." />
      <AdminCrud
        table="festivities"
        rows={festivities}
        entityLabel="festividad"
        emptyMessage="No hay festividades registradas."
        columns={[
          { key: 'name', label: 'Festividad' },
          { key: 'start_date', label: 'Inicio', type: 'date' },
          { key: 'status', label: 'Estado', type: 'status' },
          { key: 'slug', label: 'Slug' },
        ]}
        fields={[
          { name: 'name', label: 'Nombre', required: true },
          { name: 'slug', label: 'Slug', required: true },
          { name: 'description', label: 'Descripción', type: 'textarea', group: 'content', fullWidth: true },
          { name: 'program', label: 'Programa', type: 'textarea', rows: 6, group: 'content', fullWidth: true },
          { name: 'cover_image_url', label: 'Imagen (URL)', type: 'url', group: 'content', fullWidth: true },
          { name: 'start_date', label: 'Fecha de inicio', type: 'date', group: 'publication' },
          { name: 'end_date', label: 'Fecha de fin', type: 'date', group: 'publication' },
          {
            name: 'status',
            label: 'Estado',
            type: 'select',
            group: 'publication',
            options: [
              { value: 'draft', label: 'Borrador' },
              { value: 'published', label: 'Publicada' },
              { value: 'archived', label: 'Archivada' },
            ],
          },
        ]}
      />
    </div>
  );
}

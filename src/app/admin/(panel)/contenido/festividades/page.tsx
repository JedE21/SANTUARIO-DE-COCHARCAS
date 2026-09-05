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
        emptyMessage="No hay festividades registradas."
        columns={[
          { key: 'name', label: 'Nombre' },
          { key: 'slug', label: 'Slug' },
          { key: 'status', label: 'Estado' },
          { key: 'start_date', label: 'Inicio', type: 'date' },
        ]}
        fields={[
          { name: 'name', label: 'Nombre', required: true },
          { name: 'slug', label: 'Slug', required: true },
          { name: 'description', label: 'Descripción', type: 'textarea' },
          { name: 'program', label: 'Programa', type: 'textarea', rows: 6 },
          { name: 'cover_image_url', label: 'Imagen (URL)', type: 'url' },
          { name: 'start_date', label: 'Fecha de inicio', type: 'date' },
          { name: 'end_date', label: 'Fecha de fin', type: 'date' },
          {
            name: 'status',
            label: 'Estado',
            type: 'select',
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

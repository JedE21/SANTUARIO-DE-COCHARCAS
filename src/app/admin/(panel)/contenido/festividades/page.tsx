import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminSaveForm } from '@/components/admin/AdminSaveForm';
import { getAllFestivitiesAdmin } from '@/lib/queries-admin';

export default async function AdminFestividadesPage() {
  const festivities = await getAllFestivitiesAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Festividades" description="Gestiona las celebraciones y festividades del santuario." />
      <AdminTable
        rows={festivities}
        columns={[
          { key: 'name', label: 'Nombre' },
          { key: 'slug', label: 'Slug' },
          { key: 'status', label: 'Estado' },
        ]}
      />
      <AdminSaveForm
        table="festivities"
        submitLabel="Crear festividad"
        fields={[
          { name: 'name', label: 'Nombre', required: true },
          { name: 'slug', label: 'Slug', required: true },
          { name: 'description', label: 'Descripción', type: 'textarea' },
          { name: 'program', label: 'Programa', type: 'textarea', rows: 6 },
          { name: 'start_date', label: 'Fecha de inicio', type: 'date' },
          { name: 'end_date', label: 'Fecha de fin', type: 'date' },
          { name: 'cover_image_url', label: 'Imagen (URL)', type: 'url' },
          {
            name: 'status',
            label: 'Estado',
            type: 'select',
            defaultValue: 'draft',
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

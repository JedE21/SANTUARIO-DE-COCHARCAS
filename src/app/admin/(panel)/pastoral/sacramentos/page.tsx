import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminSaveForm } from '@/components/admin/AdminSaveForm';
import { getAllSacramentsAdmin } from '@/lib/queries-admin';

export default async function AdminSacramentosPage() {
  const sacraments = await getAllSacramentsAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Sacramentos" description="Configura los sacramentos disponibles y sus requisitos." />
      <AdminTable
        rows={sacraments}
        columns={[
          { key: 'name', label: 'Sacramento' },
          { key: 'slug', label: 'Slug' },
          {
            key: 'active',
            label: 'Activo',
            render: (row) => (row.active ? 'Sí' : 'No'),
          },
        ]}
      />
      <AdminSaveForm
        table="sacraments"
        submitLabel="Agregar sacramento"
        fields={[
          { name: 'name', label: 'Nombre', required: true },
          { name: 'slug', label: 'Slug', required: true },
          { name: 'description', label: 'Descripción', type: 'textarea' },
          { name: 'requirements', label: 'Requisitos', type: 'textarea', rows: 6 },
          { name: 'image_url', label: 'Imagen (URL)', type: 'url' },
          { name: 'position', label: 'Orden', type: 'number' },
          {
            name: 'active',
            label: 'Disponible para solicitudes',
            type: 'select',
            options: [
              { value: 'true', label: 'Sí, disponible' },
              { value: 'false', label: 'No disponible temporalmente' },
            ],
            defaultValue: 'true',
          },
        ]}
      />
    </div>
  );
}

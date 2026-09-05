import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminCrud } from '@/components/admin/AdminCrud';
import { getAllSacramentsAdmin } from '@/lib/queries-admin';

export const dynamic = 'force-dynamic';

export default async function AdminSacramentosPage() {
  const sacraments = await getAllSacramentsAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Sacramentos"
        description="Configura los sacramentos disponibles, sus requisitos y su visibilidad en el formulario público."
      />
      <AdminCrud
        table="sacraments"
        rows={sacraments}
        emptyMessage="No hay sacramentos configurados."
        columns={[
          { key: 'name', label: 'Sacramento' },
          { key: 'slug', label: 'Slug' },
          { key: 'position', label: 'Orden' },
          { key: 'active', label: 'Disponible', type: 'boolean' },
        ]}
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
          },
        ]}
      />
    </div>
  );
}

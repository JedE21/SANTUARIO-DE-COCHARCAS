import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminCrud } from '@/components/admin/AdminCrud';
import { getAllHomeSectionsAdmin } from '@/lib/queries-admin';

export const dynamic = 'force-dynamic';

export default async function AdminInicioPage() {
  const sections = await getAllHomeSectionsAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Página de inicio"
        description="Administra las secciones visibles en la página principal: edita textos, orden y visibilidad."
      />
      <AdminCrud
        table="home_sections"
        rows={sections}
        emptyMessage="No hay secciones configuradas."
        columns={[
          { key: 'position', label: 'Orden' },
          { key: 'key', label: 'Clave' },
          { key: 'title', label: 'Título' },
          { key: 'visible', label: 'Visible', render: (row) => (row.visible ? 'Sí' : 'No') },
        ]}
        fields={[
          { name: 'key', label: 'Clave interna (identificador)', required: true },
          { name: 'title', label: 'Título', required: true },
          { name: 'description', label: 'Descripción', type: 'textarea' },
          { name: 'content', label: 'Contenido', type: 'textarea', rows: 6 },
          { name: 'image_url', label: 'Imagen (URL)', type: 'url' },
          { name: 'position', label: 'Orden', type: 'number' },
          {
            name: 'visible',
            label: 'Visibilidad',
            type: 'select',
            options: [
              { value: 'true', label: 'Visible' },
              { value: 'false', label: 'Oculta' },
            ],
          },
        ]}
      />
    </div>
  );
}

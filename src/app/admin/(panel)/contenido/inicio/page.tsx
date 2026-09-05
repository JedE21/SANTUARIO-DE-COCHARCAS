import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminSaveForm } from '@/components/admin/AdminSaveForm';
import { getAllHomeSectionsAdmin } from '@/lib/queries-admin';

export default async function AdminInicioPage() {
  const sections = await getAllHomeSectionsAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Página de inicio"
        description="Administra las secciones visibles en la página principal."
      />
      <AdminTable
        rows={sections}
        emptyMessage="No hay secciones configuradas."
        columns={[
          { key: 'position', label: 'Orden' },
          { key: 'key', label: 'Clave' },
          { key: 'title', label: 'Título' },
          {
            key: 'visible',
            label: 'Visible',
            render: (row) => (row.visible ? 'Sí' : 'No'),
          },
        ]}
      />
      {sections[0] ? (
        <AdminSaveForm
          table="home_sections"
          hiddenFields={{ id: sections[0].id }}
          fields={[
            { name: 'title', label: 'Título', defaultValue: sections[0].title, required: true },
            { name: 'description', label: 'Descripción', type: 'textarea', defaultValue: sections[0].description || '' },
            { name: 'content', label: 'Contenido', type: 'textarea', defaultValue: sections[0].content || '', rows: 6 },
            {
              name: 'visible',
              label: 'Visibilidad',
              type: 'select',
              defaultValue: sections[0].visible ? 'true' : 'false',
              options: [
                { value: 'true', label: 'Visible' },
                { value: 'false', label: 'Oculta' },
              ],
            },
          ]}
        />
      ) : null}
    </div>
  );
}

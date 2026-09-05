import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminCrud } from '@/components/admin/AdminCrud';
import { getAllNavigationAdmin } from '@/lib/queries-admin';

export const dynamic = 'force-dynamic';

export default async function AdminNavegacionPage() {
  const navigation = await getAllNavigationAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Navegación" description="Ordena y gestiona el menú principal del sitio." />
      <AdminCrud
        table="navigation_items"
        rows={navigation}
        emptyMessage="No hay elementos de navegación."
        columns={[
          { key: 'position', label: 'Orden' },
          { key: 'label', label: 'Etiqueta' },
          { key: 'href', label: 'Enlace' },
          { key: 'visible', label: 'Visible', render: (row) => (row.visible ? 'Sí' : 'No') },
        ]}
        fields={[
          { name: 'label', label: 'Etiqueta', required: true },
          { name: 'href', label: 'Enlace (ruta)', required: true },
          { name: 'position', label: 'Orden', type: 'number' },
          {
            name: 'visible',
            label: 'Visible',
            type: 'select',
            options: [
              { value: 'true', label: 'Sí' },
              { value: 'false', label: 'No' },
            ],
          },
        ]}
      />
    </div>
  );
}

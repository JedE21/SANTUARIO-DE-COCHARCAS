import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminSaveForm } from '@/components/admin/AdminSaveForm';
import { getAllNavigationAdmin } from '@/lib/queries-admin';

export default async function AdminNavegacionPage() {
  const navigation = await getAllNavigationAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Navegación" description="Administra los enlaces del menú principal." />
      <AdminTable
        rows={navigation}
        columns={[
          { key: 'label', label: 'Etiqueta' },
          { key: 'href', label: 'Enlace' },
          { key: 'position', label: 'Orden' },
          {
            key: 'visible',
            label: 'Visible',
            render: (row) => (row.visible ? 'Sí' : 'No'),
          },
        ]}
      />
      <AdminSaveForm
        table="navigation_items"
        submitLabel="Agregar enlace"
        fields={[
          { name: 'label', label: 'Etiqueta', required: true },
          { name: 'href', label: 'Enlace', required: true },
          { name: 'position', label: 'Orden', type: 'number', defaultValue: String(navigation.length + 1) },
        ]}
      />
    </div>
  );
}

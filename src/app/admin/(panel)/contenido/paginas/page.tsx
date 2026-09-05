import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminSaveForm } from '@/components/admin/AdminSaveForm';
import { getAllPagesAdmin } from '@/lib/queries-admin';

export default async function AdminPaginasPage() {
  const pages = await getAllPagesAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Páginas" description="Gestiona las páginas institucionales del sitio." />
      <AdminTable
        rows={pages}
        columns={[
          { key: 'title', label: 'Título' },
          { key: 'slug', label: 'Slug' },
          { key: 'status', label: 'Estado' },
        ]}
      />
      <AdminSaveForm
        table="pages"
        submitLabel="Crear página"
        fields={[
          { name: 'title', label: 'Título', required: true },
          { name: 'slug', label: 'Slug (URL)', required: true },
          { name: 'description', label: 'Descripción', type: 'textarea' },
          { name: 'content', label: 'Contenido', type: 'textarea', rows: 8 },
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

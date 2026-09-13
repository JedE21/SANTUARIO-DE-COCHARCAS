import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminCrud } from '@/components/admin/AdminCrud';
import { getAllPagesAdmin } from '@/lib/queries-admin';

export const dynamic = 'force-dynamic';

export default async function AdminPaginasPage() {
  const pages = await getAllPagesAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Páginas" description="Edita el contenido de las páginas institucionales." />
      <AdminCrud
        table="pages"
        rows={pages}
        entityLabel="página"
        emptyMessage="No hay páginas registradas."
        columns={[
          { key: 'title', label: 'Página' },
          { key: 'slug', label: 'Slug' },
          { key: 'status', label: 'Estado', type: 'status' },
        ]}
        fields={[
          { name: 'slug', label: 'Slug', required: true },
          { name: 'title', label: 'Título', required: true },
          { name: 'description', label: 'Descripción', type: 'textarea', group: 'content', fullWidth: true },
          { name: 'content', label: 'Contenido', type: 'textarea', rows: 8, group: 'content', fullWidth: true },
          { name: 'image_url', label: 'Imagen (URL)', type: 'url', group: 'content', fullWidth: true },
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
          { name: 'seo_title', label: 'SEO: título', group: 'seo' },
          { name: 'seo_description', label: 'SEO: descripción', type: 'textarea', group: 'seo', fullWidth: true },
        ]}
      />
    </div>
  );
}

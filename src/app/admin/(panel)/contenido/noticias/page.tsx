import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminCrud } from '@/components/admin/AdminCrud';
import { getAllNewsAdmin } from '@/lib/queries-admin';

export const dynamic = 'force-dynamic';

export default async function AdminNoticiasPage() {
  const news = await getAllNewsAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Noticias" description="Crea, edita, publica o elimina noticias del santuario." />
      <AdminCrud
        table="news"
        rows={news}
        emptyMessage="No hay noticias todavía."
        columns={[
          { key: 'title', label: 'Título' },
          { key: 'slug', label: 'Slug' },
          { key: 'status', label: 'Estado' },
          {
            key: 'published_at',
            label: 'Publicación',
            render: (row) =>
              row.published_at ? new Date(row.published_at).toLocaleDateString('es-PE') : '—',
          },
        ]}
        fields={[
          { name: 'title', label: 'Título', required: true },
          { name: 'slug', label: 'Slug', required: true },
          { name: 'excerpt', label: 'Resumen', type: 'textarea' },
          { name: 'content', label: 'Contenido', type: 'textarea', rows: 8, required: true },
          { name: 'cover_image_url', label: 'Imagen principal (URL)', type: 'url' },
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
          { name: 'seo_title', label: 'SEO: título' },
          { name: 'seo_description', label: 'SEO: descripción', type: 'textarea' },
        ]}
      />
    </div>
  );
}

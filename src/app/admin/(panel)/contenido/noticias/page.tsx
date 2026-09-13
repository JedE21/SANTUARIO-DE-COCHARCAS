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
        entityLabel="noticia"
        emptyMessage="Todavía no hay noticias."
        columns={[
          { key: 'title', label: 'Noticia' },
          { key: 'status', label: 'Estado', type: 'status' },
          { key: 'published_at', label: 'Publicación', type: 'date' },
          { key: 'slug', label: 'Slug' },
        ]}
        fields={[
          { name: 'title', label: 'Título', required: true },
          { name: 'slug', label: 'Slug', required: true },
          { name: 'excerpt', label: 'Resumen', type: 'textarea', group: 'content', fullWidth: true },
          { name: 'content', label: 'Contenido', type: 'textarea', rows: 8, required: true, group: 'content', fullWidth: true },
          { name: 'cover_image_url', label: 'Imagen principal (URL)', type: 'url', group: 'content', fullWidth: true },
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

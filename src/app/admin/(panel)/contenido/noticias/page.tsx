import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminSaveForm } from '@/components/admin/AdminSaveForm';
import { getAllNewsAdmin } from '@/lib/queries-admin';

export default async function AdminNoticiasPage() {
  const news = await getAllNewsAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Noticias" description="Crea, edita y publica noticias del santuario." />
      <AdminTable
        rows={news}
        columns={[
          { key: 'title', label: 'Título' },
          { key: 'slug', label: 'Slug' },
          { key: 'status', label: 'Estado' },
          {
            key: 'published_at',
            label: 'Publicación',
            render: (row) =>
              row.published_at ? new Date(row.published_at).toLocaleDateString('es-PE') : '——',
          },
        ]}
      />
      <AdminSaveForm
        table="news"
        submitLabel="Crear noticia"
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

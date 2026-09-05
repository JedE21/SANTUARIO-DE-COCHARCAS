import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminCrud } from '@/components/admin/AdminCrud';
import { getAllAnnouncementsAdmin } from '@/lib/queries-admin';

export const dynamic = 'force-dynamic';

export default async function AdminAvisosPage() {
  const announcements = await getAllAnnouncementsAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Avisos" description="Publica avisos visibles en la barra superior del sitio." />
      <AdminCrud
        table="announcements"
        rows={announcements}
        emptyMessage="No hay avisos publicados."
        columns={[
          { key: 'title', label: 'Título' },
          { key: 'status', label: 'Estado' },
          { key: 'published_at', label: 'Publicación', type: 'date' },
        ]}
        fields={[
          { name: 'title', label: 'Título', required: true },
          { name: 'content', label: 'Contenido', type: 'textarea' },
          { name: 'link_url', label: 'Enlace (opcional)', type: 'url' },
          {
            name: 'status',
            label: 'Estado',
            type: 'select',
            options: [
              { value: 'draft', label: 'Borrador' },
              { value: 'published', label: 'Publicado' },
              { value: 'archived', label: 'Archivado' },
            ],
          },
        ]}
      />
    </div>
  );
}

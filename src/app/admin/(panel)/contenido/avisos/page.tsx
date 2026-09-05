import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminSaveForm } from '@/components/admin/AdminSaveForm';
import { getAllAnnouncementsAdmin } from '@/lib/queries-admin';

export default async function AdminAvisosPage() {
  const announcements = await getAllAnnouncementsAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Avisos" description="Publica avisos visibles en la barra superior del sitio." />
      <AdminTable
        rows={announcements}
        columns={[
          { key: 'title', label: 'Título' },
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
        table="announcements"
        submitLabel="Crear aviso"
        fields={[
          { name: 'title', label: 'Título', required: true },
          { name: 'content', label: 'Contenido', type: 'textarea' },
          { name: 'link_url', label: 'Enlace (opcional)', type: 'url' },
          {
            name: 'status',
            label: 'Estado',
            type: 'select',
            defaultValue: 'draft',
            options: [
              { value: 'draft', label: 'Borrador' },
              { value: 'published', label: 'Publicado' },
            ],
          },
        ]}
      />
    </div>
  );
}

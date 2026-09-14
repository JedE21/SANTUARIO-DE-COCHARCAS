import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminCrud } from '@/components/admin/AdminCrud';
import { getHistoriaContentAdmin, getHistoriaTimelineAdmin } from '@/lib/queries-admin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Historia · Panel',
  robots: { index: false, follow: false },
};

export default async function AdminHistoriaPage() {
  const [content, timeline] = await Promise.all([getHistoriaContentAdmin(), getHistoriaTimelineAdmin()]);

  return (
    <div className="space-y-12">
      <section className="space-y-8">
        <AdminPageHeader
          title="Historia del santuario"
          description="Contenido de la página pública /santuario/historia: la historia de la Virgen de Cocharcas, su línea de tiempo y el archivo histórico."
        />
        <AdminCrud
          table="historia_content"
          rows={content ? [content] : []}
          entityLabel="contenido de Historia"
          emptyMessage="Aún no hay contenido de Historia; crea el registro inicial."
          columns={[
            { key: 'hero_title', label: 'Título del hero' },
            { key: 'origins_title', label: 'Orígenes' },
            { key: 'archive_title', label: 'Archivo' },
            { key: 'status', label: 'Estado', type: 'status' },
          ]}
          fields={[
            { name: 'hero_title', label: 'Título del hero (sin carrusel)', group: 'content' },
            { name: 'hero_description', label: 'Descripción del hero', type: 'textarea', rows: 2, group: 'content' },
            {
              name: 'origins_title',
              label: 'Título de orígenes',
              group: 'content',
            },
            {
              name: 'origins_text',
              label: 'Historia de la Virgen de Cocharcas (texto principal)',
              type: 'textarea',
              rows: 8,
              fullWidth: true,
              group: 'content',
            },
            {
              name: 'origins_quote',
              label: 'Cita destacada (opcional)',
              type: 'textarea',
              rows: 2,
              group: 'content',
            },
            {
              name: 'origins_image_url',
              label: 'Imagen de orígenes (URL)',
              type: 'url',
              group: 'content',
            },
            {
              name: 'origins_image_alt',
              label: 'Texto alternativo de la imagen',
              group: 'content',
            },
            { name: 'periods_title', label: 'Título de periodos históricos', group: 'content' },
            {
              name: 'periods_description',
              label: 'Descripción de periodos históricos',
              type: 'textarea',
              rows: 2,
              group: 'content',
            },
            { name: 'archive_title', label: 'Título del archivo histórico', group: 'content' },
            {
              name: 'archive_text',
              label: 'Texto del archivo histórico (párrafos separados por línea en blanco)',
              type: 'textarea',
              rows: 6,
              fullWidth: true,
              group: 'content',
            },
            { name: 'archive_image_url', label: 'Imagen del archivo (URL)', type: 'url', group: 'content' },
            { name: 'archive_image_alt', label: 'Texto alternativo del archivo', group: 'content' },
            {
              name: 'status',
              label: 'Estado',
              type: 'select',
              group: 'publication',
              options: [
                { value: 'published', label: 'Publicado' },
                { value: 'draft', label: 'Borrador' },
                { value: 'archived', label: 'Archivado' },
              ],
            },
            { name: 'seo_title', label: 'SEO: título', group: 'seo' },
            { name: 'seo_description', label: 'SEO: descripción', type: 'textarea', rows: 2, group: 'seo' },
          ]}
        />
      </section>

      <section className="space-y-8">
        <AdminPageHeader
          title="Línea de tiempo"
          description="Hitos históricos que aparecen en la página Historia. Ordénalos con el campo Orden; los inactivos no se muestran."
        />
        <AdminCrud
          table="historia_timeline"
          rows={timeline}
          entityLabel="hito histórico"
          emptyMessage="No hay hitos históricos registrados."
          columns={[
            { key: 'year', label: 'Año' },
            { key: 'title', label: 'Título' },
            { key: 'position', label: 'Orden' },
            { key: 'is_active', label: 'Activo', type: 'boolean' },
          ]}
          fields={[
            { name: 'year', label: 'Año (ej. 1598)', required: true },
            { name: 'title', label: 'Título del hito', required: true },
            { name: 'description', label: 'Descripción', type: 'textarea', rows: 3 },
            { name: 'image_url', label: 'Imagen (URL, opcional)', type: 'url' },
            { name: 'image_alt', label: 'Texto alternativo de la imagen' },
            { name: 'position', label: 'Orden', type: 'number' },
            {
              name: 'is_active',
              label: 'Activo',
              type: 'select',
              options: [
                { value: 'true', label: 'Sí' },
                { value: 'false', label: 'No' },
              ],
            },
          ]}
        />
      </section>

      <section className="space-y-8">
        <AdminPageHeader
          title="Carrusel de la sección Historia"
          description="Las imágenes del carrusel superior se administran en Slides, eligiendo la sección «Historia»."
        />
      </section>
    </div>
  );
}

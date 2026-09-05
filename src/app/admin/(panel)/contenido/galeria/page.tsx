import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminCrud } from '@/components/admin/AdminCrud';
import { getAllGalleryAlbumsAdmin, getAllGalleryItemsAdmin } from '@/lib/queries-admin';

export const dynamic = 'force-dynamic';

export default async function AdminGaleriaPage() {
  const [albums, items] = await Promise.all([getAllGalleryAlbumsAdmin(), getAllGalleryItemsAdmin()]);

  return (
    <div className="space-y-12">
      <section className="space-y-8">
        <AdminPageHeader title="Álbumes de la galería" description="Organiza las colecciones de fotografías." />
        <AdminCrud
          table="gallery_albums"
          rows={albums}
          emptyMessage="No hay álbumes creados."
          columns={[
            { key: 'title', label: 'Álbum' },
            { key: 'slug', label: 'Slug' },
            { key: 'position', label: 'Orden' },
            { key: 'active', label: 'Activo', type: 'boolean' },
          ]}
          fields={[
            { name: 'title', label: 'Nombre del álbum', required: true },
            { name: 'slug', label: 'Slug', required: true },
            { name: 'description', label: 'Descripción', type: 'textarea' },
            { name: 'cover_image_url', label: 'Imagen de portada (URL)', type: 'url' },
            { name: 'position', label: 'Orden', type: 'number' },
            {
              name: 'active',
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
        <AdminPageHeader title="Fotografías" description="Imágenes individuales asignadas a un álbum." />
        <AdminCrud
          table="gallery_items"
          rows={items}
          emptyMessage="No hay imágenes en la galería."
          columns={[
            { key: 'title', label: 'Título' },
            { key: 'alt_text', label: 'Alt' },
            { key: 'position', label: 'Orden' },
            { key: 'visible', label: 'Visible', type: 'boolean' },
          ]}
          fields={[
            { name: 'title', label: 'Título' },
            { name: 'image_url', label: 'URL de imagen', type: 'url', required: true },
            { name: 'alt_text', label: 'Texto alternativo (alt)', required: true },
            { name: 'description', label: 'Descripción', type: 'textarea' },
            { name: 'album_id', label: 'ID del álbum (ver lista de arriba)' },
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
      </section>
    </div>
  );
}

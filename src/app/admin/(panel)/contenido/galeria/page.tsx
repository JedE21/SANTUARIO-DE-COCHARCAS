import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminSaveForm } from '@/components/admin/AdminSaveForm';
import { getGalleryAlbums, getGalleryItems } from '@/lib/queries';

export default async function AdminGaleriaPage() {
  const [albums, items] = await Promise.all([getGalleryAlbums(), getGalleryItems()]);

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Galería" description="Administra álbumes e imágenes del santuario." />
      <AdminTable
        rows={albums}
        emptyMessage="No hay álbumes creados."
        columns={[
          { key: 'title', label: 'Álbum' },
          { key: 'slug', label: 'Slug' },
          {
            key: 'active',
            label: 'Activo',
            render: (row) => (row.active ? 'Sí' : 'No'),
          },
        ]}
      />
      <AdminTable
        rows={items}
        emptyMessage="No hay imágenes en la galería."
        columns={[
          { key: 'title', label: 'Título' },
          { key: 'alt_text', label: 'Alt text' },
          {
            key: 'visible',
            label: 'Visible',
            render: (row) => (row.visible ? 'Sí' : 'No'),
          },
        ]}
      />
      <AdminSaveForm
        table="gallery_items"
        submitLabel="Agregar imagen"
        fields={[
          { name: 'title', label: 'Título' },
          { name: 'image_url', label: 'URL de imagen', type: 'url', required: true },
          { name: 'alt_text', label: 'Texto alternativo (alt)', required: true },
          { name: 'description', label: 'Descripción', type: 'textarea' },
          { name: 'album_id', label: 'ID del álbum' },
        ]}
      />
    </div>
  );
}

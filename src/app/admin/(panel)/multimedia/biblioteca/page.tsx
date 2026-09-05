import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { MediaLibrary } from '@/components/admin/MediaLibrary';
import { getAllMediaAdmin } from '@/lib/queries-admin';

export const dynamic = 'force-dynamic';

export default async function AdminBibliotecaPage() {
  const items = await getAllMediaAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Biblioteca multimedia"
        description="Sube y administra las fotografías del santuario. Las imágenes se almacenan en el bucket «gallery» de Supabase Storage."
      />
      <MediaLibrary items={items} />
    </div>
  );
}

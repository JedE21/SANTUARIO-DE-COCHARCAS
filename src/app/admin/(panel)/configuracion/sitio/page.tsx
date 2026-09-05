import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminSaveForm } from '@/components/admin/AdminSaveForm';
import { getSiteSettings } from '@/lib/queries';

export default async function AdminSitioPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Configuración del sitio" description="Información institucional general del santuario." />
      <AdminSaveForm
        table="site_settings"
        hiddenFields={{ id: settings.id }}
        fields={[
          { name: 'site_name', label: 'Nombre del sitio', defaultValue: settings.site_name || '', required: true },
          { name: 'site_description', label: 'Descripción', type: 'textarea', defaultValue: settings.site_description || '' },
          { name: 'responsible_name', label: 'Responsable', defaultValue: settings.responsible_name || '' },
          { name: 'responsible_title', label: 'Cargo del responsable', defaultValue: settings.responsible_title || '' },
          {
            name: 'responsible_bio',
            label: 'Biografía del responsable',
            type: 'textarea',
            defaultValue: settings.responsible_bio || '',
            rows: 5,
          },
          { name: 'logo_url', label: 'Logo (URL)', type: 'url', defaultValue: settings.logo_url || '' },
        ]}
      />
    </div>
  );
}

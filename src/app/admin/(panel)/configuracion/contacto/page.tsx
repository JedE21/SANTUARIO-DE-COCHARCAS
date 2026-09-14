import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminSaveForm } from '@/components/admin/AdminSaveForm';
import { getSiteSettings } from '@/lib/queries';

export default async function AdminContactoPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Contacto" description="Datos de contacto y ubicación del santuario." />
      <AdminSaveForm
        table="site_settings"
        hiddenFields={{ id: settings.id }}
        fields={[
          { name: 'address', label: 'Dirección', defaultValue: settings.address || '', required: true },
          { name: 'phone', label: 'Teléfono', defaultValue: settings.phone || '' },
          { name: 'whatsapp', label: 'WhatsApp', defaultValue: settings.whatsapp || '' },
          { name: 'email', label: 'Correo electrónico', type: 'email', defaultValue: settings.email || '' },
          { name: 'latitude', label: 'Latitud', defaultValue: settings.latitude || '' },
          { name: 'longitude', label: 'Longitud', defaultValue: settings.longitude || '' },
          { name: 'facebook_url', label: 'Facebook', type: 'url', defaultValue: settings.facebook_url || '' },
          { name: 'instagram_url', label: 'Instagram', type: 'url', defaultValue: settings.instagram_url || '' },
          { name: 'whatsapp', label: 'WhatsApp (teléfono con código de país)', defaultValue: settings.whatsapp || '', placeholder: '+51 999 999 999' },
          { name: 'tiktok_url', label: 'TikTok', type: 'url', defaultValue: settings.tiktok_url || '' },
          { name: 'youtube_url', label: 'YouTube', type: 'url', defaultValue: settings.youtube_url || '' },
        ]}
      />
    </div>
  );
}

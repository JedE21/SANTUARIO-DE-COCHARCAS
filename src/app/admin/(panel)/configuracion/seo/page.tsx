import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminSaveForm } from '@/components/admin/AdminSaveForm';
import { getFooterSettings } from '@/lib/queries';

export default async function AdminSeoPage() {
  const footer = await getFooterSettings();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="SEO y pie de página" description="Textos del footer y configuración básica de SEO." />
      <AdminSaveForm
        table="footer_settings"
        hiddenFields={{ id: footer.id }}
        fields={[
          { name: 'about_text', label: 'Texto institucional', type: 'textarea', defaultValue: footer.about_text || '' },
          { name: 'copyright_text', label: 'Copyright', defaultValue: footer.copyright_text || '' },
          { name: 'developer_text', label: 'Firma del desarrollador', defaultValue: footer.developer_text || '' },
          {
            name: 'newsletter_text',
            label: 'Texto del newsletter',
            type: 'textarea',
            defaultValue: footer.newsletter_text || '',
          },
        ]}
      />
    </div>
  );
}

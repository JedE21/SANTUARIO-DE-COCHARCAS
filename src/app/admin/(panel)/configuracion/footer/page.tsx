import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminSaveForm } from '@/components/admin/AdminSaveForm';
import { getFooterSettings, getSiteSettings } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Footer · Panel',
  robots: { index: false, follow: false },
};

export default async function AdminFooterPage() {
  const [footer, settings] = await Promise.all([getFooterSettings(), getSiteSettings()]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Footer del sitio"
        description="Textos y opciones del pie de página. Los datos de contacto, redes sociales y ubicación se toman automáticamente de la sección Contacto."
      />

      <AdminSaveForm
        table="footer_settings"
        hiddenFields={{ id: footer.id }}
        fields={[
          { name: 'about_text', label: 'Texto institucional (columna El Santuario)', type: 'textarea', rows: 3, defaultValue: footer.about_text || '' },
          { name: 'newsletter_text', label: 'Texto del newsletter (columna Comunidad)', type: 'textarea', rows: 2, defaultValue: footer.newsletter_text || '' },
          { name: 'copyright_text', label: 'Copyright', defaultValue: footer.copyright_text || '' },
          { name: 'developer_text', label: 'Firma del desarrollador', defaultValue: footer.developer_text || '' },
          { name: 'signature_text', label: 'Frase distintiva (p. ej. Cocharquino de corazón)', defaultValue: footer.signature_text || '' },
          { name: 'photos_credit_text', label: 'Crédito de fotografías (opcional)', defaultValue: footer.photos_credit_text || '' },
          {
            name: 'show_newsletter',
            label: 'Mostrar formulario de newsletter',
            type: 'select',
            options: [
              { value: 'true', label: 'Sí' },
              { value: 'false', label: 'No' },
            ],
            defaultValue: footer.show_newsletter === false ? 'false' : 'true',
          },
          {
            name: 'show_contact_data',
            label: 'Mostrar datos de contacto (desde la sección Contacto)',
            type: 'select',
            options: [
              { value: 'true', label: 'Sí' },
              { value: 'false', label: 'No' },
            ],
            defaultValue: footer.show_contact_data === false ? 'false' : 'true',
          },
        ]}
      />

      <AdminPageHeader
        title="Datos de contacto del footer"
        description="Estos valores provienen de Configuración → Contacto; edítalos allí para que se actualicen en el footer y en todo el sitio."
      />

      <div className="grid gap-4 rounded-lg border border-piedra/25 bg-blanco p-5 sm:grid-cols-2 sm:p-6">
        {[
          { label: 'Dirección', value: settings.address },
          { label: 'Teléfono', value: settings.phone },
          { label: 'Correo', value: settings.email },
          { label: 'Facebook', value: settings.facebook_url },
          { label: 'Instagram', value: settings.instagram_url },
          { label: 'WhatsApp', value: settings.whatsapp },
          { label: 'TikTok', value: settings.tiktok_url },
          { label: 'YouTube', value: settings.youtube_url },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-tierra">{item.label}</p>
            <p className="mt-1 text-sm text-marron/85">{item.value || <span className="text-muted-foreground">No definido</span>}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

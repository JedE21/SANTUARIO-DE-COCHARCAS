import Link from 'next/link';
import type { ReactNode } from 'react';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { getSiteSettings, getFooterSettings, getNavigationItems } from '@/lib/queries';

/**
 * Iconos de marca en SVG inline (monocromos, heredan currentColor) para no
 * añadir una dependencia extra al proyecto.
 */
const socialIcons: Record<string, ReactNode> = {
  Facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.3-.04-1.3-.13-2.45-.13-2.4 0-4.05 1.47-4.05 4.17v2.26H7.5V13h2.7v8h3.3Z" />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="h-4 w-4">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  WhatsApp: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M12.05 2.5c-5.24 0-9.5 4.24-9.5 9.47 0 1.67.44 3.3 1.28 4.74L2.5 21.5l4.94-1.29a9.52 9.52 0 0 0 4.61 1.18h.01c5.23 0 9.49-4.24 9.49-9.47a9.4 9.4 0 0 0-2.78-6.7 9.44 9.44 0 0 0-6.72-2.72Zm0 17.13h-.01a7.9 7.9 0 0 1-4.02-1.1l-.29-.17-2.93.77.78-2.86-.19-.29a7.83 7.83 0 0 1-1.2-4.18c0-4.36 3.55-7.9 7.92-7.9a7.85 7.85 0 0 1 5.58 2.31 7.8 7.8 0 0 1 2.31 5.59c0 4.36-3.55 7.9-7.95 7.9Zm4.34-5.92c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06a6.4 6.4 0 0 1-1.89-1.16 7.07 7.07 0 0 1-1.3-1.62c-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.12 3.64.58.25 1.02.4 1.37.51.58.18 1.1.16 1.52.1.46-.07 1.4-.57 1.6-1.13.2-.55.2-1.03.14-1.13-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M16.6 3c.36 1.94 1.6 3.36 3.9 3.5v2.98c-1.42.14-2.68-.3-3.9-1.1v5.5c0 6.98-7.62 9.16-10.68 4.16-1.97-3.23-.76-8.82 5.54-9.05v3.14c-.48.08-1 .2-1.46.36-1.4.48-2.2 1.38-1.98 2.94.43 2.98 5.86 3.86 5.4-1.96V3h2.18Z" />
    </svg>
  ),
};

/**
 * Footer institucional: sobrio, editorial, fondo negro suave.
 * Todos los textos provienen de footer_settings (editable en
 * Configuración → Footer) y los datos de contacto/redes de
 * site_settings (editable en Configuración → Contacto).
 */
export const Footer = async ({ className = '' }: { className?: string }) => {
  const [settings, footer, navigation] = await Promise.all([
    getSiteSettings(),
    getFooterSettings(),
    getNavigationItems(),
  ]);
  const { site_name, address, phone, email, facebook_url, instagram_url, youtube_url, whatsapp, tiktok_url } = settings;
  const showContact = footer.show_contact_data !== false;

  // WhatsApp admite teléfono (+51...) o URL completa (wa.me / whatsapp.com).
  const whatsappHref = (() => {
    if (!whatsapp) return null;
    if (/^https?:\/\//i.test(whatsapp)) return whatsapp;
    const digits = whatsapp.replace(/[^0-9]/g, '');
    return digits.length >= 8 ? `https://wa.me/${digits}` : null;
  })();

  const socialLinks = (
    [
      { name: 'Facebook', href: facebook_url },
      { name: 'Instagram', href: instagram_url },
      { name: 'WhatsApp', href: whatsappHref },
      { name: 'TikTok', href: tiktok_url },
      { name: 'YouTube', href: youtube_url },
    ] as { name: string; href: string | null | undefined }[]
  ).filter((l): l is { name: string; href: string } => Boolean(l.href));

  return (
    <footer className={`${className} bg-negro text-marfil`}>
      {/* Apertura editorial */}
      <div className="border-b border-marfil/10">
        <div className="mx-auto max-w-[100rem] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <p className="eyebrow text-dorado-claro">Santuario de Nuestra Señora de Cocharcas</p>
          <p className="mt-6 max-w-3xl font-heading text-3xl font-medium leading-tight text-marfil sm:text-4xl lg:text-5xl">
            Fe, historia y tradición en el corazón de los Andes.
          </p>
        </div>
      </div>

      {/* Columnas */}
      <div className="mx-auto max-w-[100rem] px-5 py-14 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-marfil/45">
              El Santuario
            </p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-marfil/70">
              {footer.about_text || 'Santuario mariano, memoria histórica y vida de fe en el corazón de Apurímac.'}
            </p>
            {socialLinks.length > 0 ? (
              <div className="mt-7 flex gap-3">
                {socialLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                    title={link.name}
                    className="flex h-9 w-9 items-center justify-center border border-marfil/20 text-marfil/70 transition-all duration-300 hover:border-dorado-claro hover:text-dorado-claro"
                  >
                    {socialIcons[link.name] ?? link.name.charAt(0)}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-marfil/45">
              Navegación
            </p>
            <nav className="mt-5 space-y-2.5" aria-label="Pie de página">
              {navigation.slice(0, 8).map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="block text-sm text-marfil/70 transition-colors duration-300 hover:text-dorado-claro"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-marfil/45">
              Contacto
            </p>
            {showContact ? (
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-marfil/70">
                <p>
                  Cocharcas, Chincheros
                  <br />
                  Apurímac, Perú
                </p>
                {address ? <p className="text-marfil/55">{address}</p> : null}
                {phone ? <p>{phone}</p> : null}
                {email ? <p>{email}</p> : null}
              </div>
            ) : (
              <p className="mt-5 text-sm leading-relaxed text-marfil/55">
                Cocharcas, Chincheros, Apurímac, Perú.
              </p>
            )}
          </div>

          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-marfil/45">
              Comunidad
            </p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-marfil/70">
              {footer.newsletter_text || 'Recibe noticias y avisos de la comunidad.'}
            </p>
            {footer.show_newsletter !== false ? (
              <div className="mt-6 [&_input]:border-marfil/20 [&_input]:bg-transparent [&_input]:text-marfil [&_button]:bg-dorado [&_button]:text-negro [&_button]:hover:bg-dorado-claro">
                <NewsletterForm />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Créditos */}
      <div className="border-t border-marfil/10">
        <div className="mx-auto flex max-w-[100rem] flex-col items-center gap-3 px-5 py-8 text-center sm:px-8 lg:px-12">
          <p className="text-xs text-marfil/60">
            {footer.copyright_text || `© 2026 ${site_name} · Todos los derechos reservados`}
          </p>
          <p className="text-xs text-marfil/45">
            Desarrollado por: {footer.developer_text || 'Ing. de Sistemas José J. Echegaray Díaz'}
          </p>
          {footer.signature_text ? (
            <p className="font-heading text-sm italic text-marfil/55">{footer.signature_text}</p>
          ) : null}
          {footer.photos_credit_text ? (
            <p className="max-w-xl text-[0.6rem] leading-relaxed text-marfil/35">{footer.photos_credit_text}</p>
          ) : null}
        </div>
      </div>
    </footer>
  );
};

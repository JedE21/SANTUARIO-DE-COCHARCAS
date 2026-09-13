import Link from 'next/link';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { getSiteSettings, getFooterSettings, getNavigationItems } from '@/lib/queries';

/**
 * Footer institucional: sobrio, editorial, fondo negro suave.
 * Conserva el crédito del desarrollador y "Cocharquino de corazón.".
 */
export const Footer = async ({ className = '' }: { className?: string }) => {
  const [settings, footer, navigation] = await Promise.all([
    getSiteSettings(),
    getFooterSettings(),
    getNavigationItems(),
  ]);
  const { site_name, address, phone, email, facebook_url, instagram_url, youtube_url } = settings;

  const socialLinks = [
    { name: 'Facebook', href: facebook_url },
    { name: 'Instagram', href: instagram_url },
    { name: 'YouTube', href: youtube_url },
  ].filter((l): l is { name: string; href: string } => Boolean(l.href));

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
                    className="flex h-9 w-9 items-center justify-center border border-marfil/20 text-[0.6rem] font-semibold uppercase tracking-wider text-marfil/70 transition-all duration-300 hover:border-dorado-claro hover:text-dorado-claro"
                  >
                    {link.name.charAt(0)}
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
          <p className="font-heading text-sm italic text-marfil/55">Cocharquino de corazón.</p>
          <p className="max-w-xl text-[0.6rem] leading-relaxed text-marfil/35">
            Fotografías: Wikimedia Commons, licencias Creative Commons BY-SA.
          </p>
        </div>
      </div>
    </footer>
  );
};

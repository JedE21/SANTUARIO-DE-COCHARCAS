import Link from 'next/link';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { getSiteSettings, getFooterSettings, getNavigationItems } from '@/lib/queries';

export const Footer = async ({ className = '' }: { className?: string }) => {
  const [{ site_name, address, phone, email }, footer, navigation] = await Promise.all([
    getSiteSettings(),
    getFooterSettings(),
    getNavigationItems(),
  ]);

  const socialLinks = [
    { name: 'Facebook', href: '#' },
    { name: 'Instagram', href: '#' },
    { name: 'YouTube', href: '#' },
    { name: 'WhatsApp', href: '#' },
  ];

  return (
    <footer className={`${className} bg-carbone text-marfil`}>
      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{site_name}</h3>
            <p className="text-sm text-marfil/80">{footer.about_text || address}</p>
            <div className="flex items-center space-x-3 text-sm text-marfil/80">
              <span aria-hidden="true">Í</span>
              <span>{phone}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-marfil/80">
              <span aria-hidden="true">✉</span>
              <span>{email}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Navegación</h3>
            <nav className="space-y-2">
              {navigation.slice(0, 8).map((item) => (
                <Link key={item.id} href={item.href} className="block hover:text-white/80 transition-normal">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contacto</h3>
            <p className="text-sm text-marfil/80">Dirección: {address}</p>
            <p className="text-sm text-marfil/80">Teléfono: {phone}</p>
            <p className="text-sm text-marfil/80">Correo: {email}</p>
            <div className="flex space-x-3 mt-3">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-marfil/10 hover:bg-marfil/20 transition-normal"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                >
                  <span className="text-marfil font-medium text-xs">{link.name.charAt(0)}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Newsletter</h3>
            <p className="text-sm text-marfil/80">
              {footer.newsletter_text || 'Mantente informado sobre nuestras actividades y eventos.'}
            </p>
            {footer.show_newsletter !== false && <NewsletterForm />}
          </div>
        </div>

        <div className="my-8 border-t border-marfil/20" />

        <div className="flex flex-col items-center text-center space-y-3 text-sm">
          <p className="text-marfil/80">{footer.copyright_text || `© 2026 ${site_name} · Todos los derechos reservados`}</p>
          <p className="text-marfil/80">{footer.developer_text || 'Desarrollado por Ing. de Sistemas José J. Echegaray Díaz'}</p>
          <p className="text-marfil/80 italic">Cocharquino de corazón.</p>
        </div>
      </div>
    </footer>
  );
};

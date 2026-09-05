import { getNavigationItems, getSiteSettings } from '@/lib/queries';
import { HeaderShell } from './header-shell';

interface HeaderProps {
  className?: string;
}

export async function Header({ className = '' }: HeaderProps) {
  const [settings, navigation] = await Promise.all([getSiteSettings(), getNavigationItems()]);
  const navItems = navigation.map((item) => ({ label: item.label, href: item.href }));

  return (
    <HeaderShell
      className={className}
      siteName={settings.site_name || 'Santuario de Nuestra Señora de Cocharcas'}
      navItems={navItems}
    />
  );
}

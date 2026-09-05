import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface NavigationProps {
  items: NavItem[];
  className?: string;
}

export const Navigation = ({ items, className = '' }: NavigationProps) => {
  return (
    <nav className={`${className} space-x-4`}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-normal ${
            item.isActive
              ? 'text-primary border-b-2 border-primary'
              : 'border-b-2 border-transparent hover:border-b-primary/50'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

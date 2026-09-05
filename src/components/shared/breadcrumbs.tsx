import * as React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  ariaLabel?: string;
}

export const Breadcrumbs = ({
  items,
  className = '',
  ariaLabel = 'Breadcrumb',
}: BreadcrumbsProps) => {
  return (
    <nav
      className={`${className} flex flex-wrap items-center gap-2 text-sm text-muted-foreground`}
      aria-label={ariaLabel}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              {isLast ? (
                <span className="text-foreground" aria-current="page">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className={`${item.isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'} transition-normal`}
                >
                  {item.label}
                </Link>
              )}
              {!isLast && (
                <span className="mx-2 rtl:rotate-180" aria-hidden="true">/</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
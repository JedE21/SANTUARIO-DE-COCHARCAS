import * as React from 'react';
import { AnnouncementBar } from './announcement-bar';
import { Header } from './header';
import { Footer } from './footer';

interface PublicLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PublicLayout = async ({ children, className = '' }: PublicLayoutProps) => {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Saltar al contenido
      </a>
      <AnnouncementBar />
      <Header className={className} />
      <div id="contenido" tabIndex={-1} className="focus:outline-none">
        {children}
      </div>
      <Footer />
    </>
  );
};

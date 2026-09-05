'use client';

import * as React from 'react';

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export const MobileMenu = ({
  open,
  onOpenChange,
  className = '',
}: MobileMenuProps) => {
  return (
    <div className={`${className} relative z-50`}>
      <button
        onClick={() => onOpenChange(!open)}
        className="p-2 rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Open mobile menu"
      >
        <span className="block h-0.5 w-5 bg-muted-foreground mb-0.5" />
        <span className="block h-0.5 w-5 bg-muted-foreground mb-0.5" />
        <span className="block h-0.5 w-5 bg-muted-foreground" />
      </button>

      <div
        className={`fixed inset-0 z-40 flex items-center justify-center bg-gray-900/50 ${
          open ? 'block' : 'hidden'
        }`}
      >
        <div className="relative w-full max-w-xs">
          <div className="rounded-lg bg-background p-4 shadow-lg">
            <p className="text-sm text-muted-foreground">Contenido del menú móvil</p>
          </div>
        </div>
      </div>
    </div>
  );
};

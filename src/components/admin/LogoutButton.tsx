'use client';

import * as React from 'react';
import { LogOut } from 'lucide-react';
import { signOut } from '@/lib/actions';

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const [loading, setLoading] = React.useState(false);
  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await signOut();
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-md border border-blanco/20 text-blanco/80 transition-normal hover:border-blanco/40 hover:bg-blanco/10 hover:text-blanco focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-claro disabled:opacity-50 ${
        compact ? 'p-2' : 'w-full px-4 py-2 text-sm'
      }`}
      aria-label="Cerrar sesión"
    >
      <LogOut className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {!compact && (loading ? 'Saliendo…' : 'Cerrar sesión')}
    </button>
  );
}

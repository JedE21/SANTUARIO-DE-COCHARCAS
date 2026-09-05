'use client';

import * as React from 'react';
import { signOut } from '@/lib/actions';

export function LogoutButton() {
  const [loading, setLoading] = React.useState(false);
  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await signOut();
      }}
      className="mt-6 w-full rounded-md border border-piedra/30 px-4 py-2 text-sm text-carbone hover:bg-piedra/10 transition-normal disabled:opacity-50"
    >
      {loading ? 'Saliendo...' : 'Cerrar sesión'}
    </button>
  );
}

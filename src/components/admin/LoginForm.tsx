'use client';

import * as React from 'react';
import { Button } from '@/components/public';
import { Input } from '@/components/ui/input';
import { signIn, type ActionResult } from '@/lib/actions';

export function LoginForm() {
  const [result, setResult] = React.useState<ActionResult | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setLoading(true);
    const res = await signIn(new FormData(ev.currentTarget));
    setResult(res);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-md p-6 bg-blanco rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-dorado">
        Iniciar Sesión
      </h2>
      {result?.error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{result.error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-carbone mb-2">
            Usuario
          </label>
          <Input type="email" name="email" required placeholder="correo@ejemplo.pe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-carbone mb-2">
            Contraseña
          </label>
          <Input type="password" name="password" required />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
        </Button>
        <p className="text-center text-sm text-carbone/60">
          © 2026 Santuario de Nuestra Señora de Cocharcas
        </p>
      </form>
    </div>
  );
}

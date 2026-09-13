'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/public';
import { Input } from '@/components/ui/input';
import { signIn, type ActionResult } from '@/lib/actions';

/**
 * Formulario de autenticación del panel.
 * La lógica (server action `signIn`) NO ha cambiado: solo presentación.
 */
export function LoginForm() {
  const [result, setResult] = React.useState<ActionResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  // Vista previa solo mientras se mantiene presionado el icono:
  // pointerdown muestra, soltar (dentro o fuera) vuelve a ocultar.
  React.useEffect(() => {
    if (!showPassword) return;
    const hide = () => setShowPassword(false);
    window.addEventListener('pointerup', hide);
    window.addEventListener('pointercancel', hide);
    return () => {
      window.removeEventListener('pointerup', hide);
      window.removeEventListener('pointercancel', hide);
    };
  }, [showPassword]);

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setLoading(true);
    const res = await signIn(new FormData(ev.currentTarget));
    setResult(res);
    setLoading(false);
  }

  return (
    <div className="w-full rounded-lg border border-blanco/10 bg-blanco/[0.04] p-7 shadow-lg backdrop-blur-sm sm:p-8">
      {/* Identidad */}
      <div className="text-center">
        <p className="font-heading text-lg font-semibold tracking-[0.14em] text-dorado-claro">
          SANTUARIO
        </p>
        <p className="mt-3 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-blanco/50">
          Panel de Administración
        </p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-blanco/15 bg-blanco/[0.04] px-3.5 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-blanco/60">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-dorado-claro" />
          Solo personal autorizado
        </p>
        <h1 className="mt-6 font-heading text-2xl font-medium text-blanco">
          Iniciar sesión
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-blanco/60">
          Gestiona el contenido del Santuario de Nuestra Señora de Cocharcas.
        </p>
      </div>

      <div className="my-7 h-px bg-blanco/10" aria-hidden="true" />

      {result?.error && (
        <p
          role="alert"
          className="mb-5 rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
        >
          {result.error}
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="admin-email" className="block text-xs font-semibold uppercase tracking-[0.14em] text-blanco/60">
            Correo electrónico
          </label>
          <Input
            id="admin-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="correo@ejemplo.pe"
            className="border-blanco/20 bg-blanco/[0.06] text-blanco placeholder:text-blanco/30 focus-visible:ring-dorado-claro"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="admin-password" className="block text-xs font-semibold uppercase tracking-[0.14em] text-blanco/60">
            Contraseña
          </label>
          <div className="relative">
            <Input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              autoComplete="current-password"
              className="border-blanco/20 bg-blanco/[0.06] pr-11 text-blanco focus-visible:ring-dorado-claro"
            />
            {/* Mantener presionado para previsualizar; soltar oculta de nuevo */}
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                setShowPassword(true);
              }}
              onPointerLeave={() => setShowPassword(false)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  setShowPassword(true);
                }
              }}
              onKeyUp={() => setShowPassword(false)}
              onBlur={() => setShowPassword(false)}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-blanco/40 transition-colors hover:text-blanco/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-claro"
              aria-label={showPassword ? 'Suelta para ocultar la contraseña' : 'Mantén presionado para ver la contraseña'}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <Eye className="h-4 w-4 text-dorado-claro" aria-hidden="true" />
              ) : (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-dorado text-negro hover:bg-dorado-claro focus-visible:ring-dorado-claro"
          disabled={loading}
        >
          {loading ? 'Ingresando…' : 'Iniciar sesión'}
        </Button>
      </form>

      <p className="mt-8 text-center text-[0.68rem] leading-relaxed text-blanco/40">
        Santuario de Nuestra Señora
        <br />
        de Cocharcas
      </p>
    </div>
  );
}

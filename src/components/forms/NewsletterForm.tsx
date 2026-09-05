'use client';

import * as React from 'react';
import { subscribeNewsletter, type ActionResult } from '@/lib/actions';

export function NewsletterForm() {
  const [result, setResult] = React.useState<ActionResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const inputId = React.useId();

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setLoading(true);
    const res = await subscribeNewsletter(new FormData(ev.currentTarget));
    setResult(res);
    setLoading(false);
    if (res.ok && !res.error) ev.currentTarget.reset();
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
        {/* Honeypot anti-bots: oculto para humanos, los bots lo rellenan */}
        <div className="hidden" aria-hidden="true">
          <label>
            No completar este campo
            <input name="_hp" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <label htmlFor={inputId} className="sr-only">
          Correo electrónico
        </label>
        <input
          id={inputId}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="Tu correo electrónico"
          className="flex-1 px-3 py-2 border border-marfil/20 rounded-md bg-marfil/10 text-marfil placeholder:text-marfil/60 focus:outline-none focus:ring-2 focus:ring-dorado-claro"
        />
        <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium rounded-md transition-normal">
          {loading ? 'Enviando...' : 'Suscribirse'}
        </button>
      </form>
      <div aria-live="polite">
        {result?.error && <p role="alert" className="mt-2 text-xs text-red-200">{result.error}</p>}
        {result?.ok && !result.error && <p className="mt-2 text-xs text-marfil/80">{result.message}</p>}
      </div>
    </div>
  );
}

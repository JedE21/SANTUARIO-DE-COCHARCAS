'use client';

import * as React from 'react';
import { Button, Card } from '@/components/public';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { submitContactMessage, type ActionResult } from '@/lib/actions';

export function ContactForm() {
  const [result, setResult] = React.useState<ActionResult | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setLoading(true);
    const res = await submitContactMessage(new FormData(ev.currentTarget));
    setResult(res);
    setLoading(false);
    if (res.ok && !res.error) ev.currentTarget.reset();
  }

  return (
    <Card className="p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Honeypot anti-bots: oculto para humanos, los bots lo rellenan */}
        <div className="hidden" aria-hidden="true">
          <label>
            No completar este campo
            <input name="_hp" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        {result?.error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{result.error}</p>}
        {result?.ok && !result.error && <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">{result.message}</p>}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Nombre *</span>
            <Input name="name" required placeholder="Nombres y apellidos" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Correo *</span>
            <Input name="email" type="email" required placeholder="correo@ejemplo.pe" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Teléfono</span>
            <Input name="phone" placeholder="+51 999 999 999" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Asunto</span>
            <Input name="subject" placeholder="Motivo del mensaje" />
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Mensaje *</span>
          <Textarea name="message" required placeholder="Escribe tu mensaje" />
        </label>
        <Button type="submit" disabled={loading} className="w-full">{loading ? 'Enviando...' : 'Enviar mensaje'}</Button>
      </form>
    </Card>
  );
}

'use client';

import * as React from 'react';
import { Button, Card } from '@/components/public';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Sacrament } from '@/types/database';
import { submitSacramentRequest, type ActionResult } from '@/lib/actions';

export function SacramentRequestForm({ sacraments }: { sacraments: Sacrament[] }) {
  const [result, setResult] = React.useState<ActionResult | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setLoading(true);
    const formData = new FormData(ev.currentTarget);
    const res = await submitSacramentRequest(formData);
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
        {result?.ok && !result.error && (
          <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
            <p>{result.message}</p>
            {result.data && typeof result.data === 'object' && 'tracking' in (result.data as object) ? (
              <p className="mt-1 font-semibold">Tu código: {(result.data as { tracking: string }).tracking}</p>
            ) : null}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Nombre del solicitante *</span>
            <Input name="requester_name" required placeholder="Nombres y apellidos" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Correo electrónico</span>
            <Input name="requester_email" type="email" placeholder="correo@ejemplo.pe" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Teléfono / WhatsApp</span>
            <Input name="phone" placeholder="+51 999 999 999" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Sacramento *</span>
            <Select name="sacrament_id">
              {sacraments.map((sacrament) => (
                <option key={sacrament.id} value={sacrament.id}>{sacrament.name}</option>
              ))}
            </Select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Fecha preferida *</span>
            <Input name="requested_date" type="date" required />
          </label>
        </div>

        <label className="block space-y-1">
          <span className="text-sm font-medium">Notas</span>
          <Textarea name="notes" placeholder="Información adicional para la preparación pastoral" />
        </label>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Enviando...' : 'Iniciar solicitud'}
        </Button>
        <p className="text-xs text-muted-foreground">
          La coordinación pastoral te contactará para completar la preparación.
        </p>
      </form>
    </Card>
  );
}

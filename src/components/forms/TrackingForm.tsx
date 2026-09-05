'use client';

import * as React from 'react';
import { Button, Card } from '@/components/public';
import { Input } from '@/components/ui/input';
import { trackRequest, type ActionResult } from '@/lib/actions';
import {
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS_STYLES,
  requestStatusLabel,
  type RequestStatus,
} from '@/lib/constants/request-status';

interface TrackedRow {
  request_number?: string;
  status?: string;
  requested_date?: string;
  preferred_time?: string | null;
  created_at?: string;
}

export function TrackingForm() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<ActionResult | null>(null);

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setLoading(true);
    const formData = new FormData(ev.currentTarget);
    const code = String(formData.get('code') ?? '').trim();
    setResult(await trackRequest(code));
    setLoading(false);
  }

  const data = result?.data && typeof result.data === 'object'
    ? (result.data as { kind?: string; row?: TrackedRow })
    : null;
  const row = data?.row;
  const status = (row?.status ?? 'pending') as RequestStatus;
  const style = REQUEST_STATUS_STYLES[status] ?? REQUEST_STATUS_STYLES.pending;

  return (
    <Card className="max-w-2xl p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Código de seguimiento</span>
          <Input name="code" required placeholder="Ej: MS-XXXXX-XXXXX-XXXXX" maxLength={45} autoComplete="off" />
        </label>
        <Button type="submit" disabled={loading}>{loading ? 'Consultando...' : 'Consultar estado'}</Button>
      </form>

      {result?.error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{result.error}</p>}
      {row && (
        <div className="mt-6 rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">{data?.kind === 'mass' ? 'Solicitud de misa' : 'Solicitud de sacramento'}</p>
          <p className="mt-1 text-lg font-semibold">{row.request_number || 'Solicitud'}</p>
          <p className="mt-2">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style}`}>
              {requestStatusLabel(row.status)}
            </span>
          </p>
          {row.requested_date ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Fecha solicitada: {new Date(`${row.requested_date}T00:00:00`).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}
              {row.preferred_time ? ` · ${String(row.preferred_time).slice(0, 5)}` : ''}
            </p>
          ) : null}
          <p className="mt-3 text-xs text-muted-foreground">
            Si necesitas actualizar tus datos, contáctanos por la página de contacto indicando tu código.
          </p>
        </div>
      )}
    </Card>
  );
}

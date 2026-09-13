'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { updateRequestStatus, adminGenericDelete, type ActionResult } from '@/lib/actions';
import {
  REQUEST_STATUSES,
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS_STYLES,
  type RequestStatus,
} from '@/lib/constants/request-status';

type RequestKind = 'mass' | 'sacrament';

export interface UnifiedRequest {
  id: string;
  kind: RequestKind;
  request_number: string | null;
  requester_name: string;
  requester_email: string | null | undefined;
  phone: string | null | undefined;
  requested_date: string;
  preferred_time?: string | null | undefined;
  intention_type?: string | null | undefined;
  intention?: string | null | undefined;
  sacrament_name?: string | null;
  notes: string | null | undefined;
  status: string | null | undefined;
  admin_notes: string | null | undefined;
  created_at: string | null | undefined;
}

function normalizeStatus(status: string | null | undefined): RequestStatus {
  return (REQUEST_STATUSES as string[]).includes(status ?? '') ? (status as RequestStatus) : 'pending';
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${REQUEST_STATUS_STYLES[status]}`}
    >
      {REQUEST_STATUS_LABELS[status]}
    </span>
  );
}

function DetailRow({ request, onSaved }: { request: UnifiedRequest; onSaved: () => void }) {
  const [status, setStatus] = React.useState<RequestStatus>(normalizeStatus(request.status));
  const [notes, setNotes] = React.useState(request.admin_notes ?? '');
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [result, setResult] = React.useState<ActionResult | null>(null);

  async function onSave() {
    setSaving(true);
    setResult(null);
    const res = await updateRequestStatus(request.kind, request.id, status, notes);
    setResult(res);
    setSaving(false);
    if (res.ok) onSaved();
  }

  function onDelete() {
    setConfirmOpen(true);
  }

  async function performDelete() {
    setDeleting(true);
    setResult(null);
    const fd = new FormData();
    fd.set('_table', request.kind === 'mass' ? 'mass_requests' : 'sacrament_requests');
    fd.set('id', request.id);
    const res = await adminGenericDelete(fd);
    setDeleting(false);
    setConfirmOpen(false);
    if (res.ok) {
      onSaved();
    } else {
      setResult(res);
    }
  }

  return (
    <tr>
      <td colSpan={5} className="border-t border-piedra/10 bg-marfil/40 px-6 py-4">
        <div className="grid gap-4 md:grid-cols-2">
          <dl className="space-y-1.5 text-sm">
            <div className="flex gap-2"><dt className="w-28 shrink-0 font-medium text-carbone/60">Solicitante:</dt><dd className="text-carbone">{request.requester_name}</dd></div>
            {request.requester_email ? <div className="flex gap-2"><dt className="w-28 shrink-0 font-medium text-carbone/60">Correo:</dt><dd className="text-carbone">{request.requester_email}</dd></div> : null}
            {request.phone ? <div className="flex gap-2"><dt className="w-28 shrink-0 font-medium text-carbone/60">Teléfono:</dt><dd className="text-carbone">{request.phone}</dd></div> : null}
            <div className="flex gap-2"><dt className="w-28 shrink-0 font-medium text-carbone/60">Fecha deseada:</dt><dd className="text-carbone">{formatDate(request.requested_date)}{request.preferred_time ? ` · ${String(request.preferred_time).slice(0, 5)}` : ''}</dd></div>
            {request.intention_type ? <div className="flex gap-2"><dt className="w-28 shrink-0 font-medium text-carbone/60">Intención:</dt><dd className="text-carbone">{request.intention_type}</dd></div> : null}
            {request.sacrament_name ? <div className="flex gap-2"><dt className="w-28 shrink-0 font-medium text-carbone/60">Sacramento:</dt><dd className="text-carbone">{request.sacrament_name}</dd></div> : null}
            {request.intention ? <div className="flex gap-2"><dt className="w-28 shrink-0 font-medium text-carbone/60">Detalle:</dt><dd className="whitespace-pre-wrap text-carbone">{request.intention}</dd></div> : null}
            {request.notes ? <div className="flex gap-2"><dt className="w-28 shrink-0 font-medium text-carbone/60">Observ. solicitante:</dt><dd className="whitespace-pre-wrap text-carbone">{request.notes}</dd></div> : null}
          </dl>

          <div className="space-y-3 rounded-lg border border-piedra/20 bg-blanco p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="font-medium text-carbone">Estado</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as RequestStatus)}
                  className="w-full rounded-md border border-piedra/30 px-3 py-2 text-sm focus:border-dorado focus:outline-none focus:ring-1 focus:ring-dorado"
                >
                  {REQUEST_STATUSES.map((s) => (
                    <option key={s} value={s}>{REQUEST_STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block space-y-1 text-sm">
              <span className="font-medium text-carbone">Notas internas (no visibles al solicitante)</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                maxLength={1000}
                placeholder="Acuerdos, indicaciones para el solicitante…"
                className="w-full rounded-md border border-piedra/30 px-3 py-2 text-sm focus:border-dorado focus:outline-none focus:ring-1 focus:ring-dorado"
              />
            </label>
            <div className="flex items-center gap-3">
              <Button type="button" size="sm" onClick={onSave} disabled={saving || deleting}>
                {saving ? 'Guardando…' : 'Guardar cambios'}
              </Button>
              <button
                type="button"
                onClick={onDelete}
                disabled={saving || deleting}
                className="rounded-md border border-destructive/25 px-3 py-2 text-xs font-medium text-destructive transition-normal hover:bg-destructive/5 disabled:opacity-50"
              >
                Eliminar solicitud
              </button>
              {result?.error && <span className="text-xs text-red-700">{result.error}</span>}
              {result?.ok && !result.error && <span className="text-xs text-green-700">{result.message}</span>}
            </div>
          </div>
        </div>
      </td>
      <ConfirmDialog
        open={confirmOpen}
        title={`¿Eliminar la solicitud ${request.request_number ?? ''}?`}
        busy={deleting}
        onConfirm={performDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </tr>
  );
}

export function SolicitudesManager({ requests }: { requests: UnifiedRequest[] }) {
  const [typeFilter, setTypeFilter] = React.useState<'all' | RequestKind>('all');
  const [statusFilter, setStatusFilter] = React.useState<'all' | RequestStatus>('all');
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const filtered = React.useMemo(
    () =>
      requests.filter((r) => {
        if (typeFilter !== 'all' && r.kind !== typeFilter) return false;
        if (statusFilter !== 'all' && normalizeStatus(r.status) !== statusFilter) return false;
        return true;
      }),
    [requests, typeFilter, statusFilter],
  );

  const counts = React.useMemo(() => {
    const c: Record<string, number> = { all: requests.length };
    for (const r of requests) {
      const s = normalizeStatus(r.status);
      c[s] = (c[s] ?? 0) + 1;
    }
    return c;
  }, [requests]);

  // Recarga suave tras guardar (los datos cambian en la BD)
  const reload = () => window.location.reload();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex overflow-hidden rounded-md border border-piedra/40">
          {(['all', 'mass', 'sacrament'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={`px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-oscuro ${typeFilter === t ? 'bg-marron text-blanco' : 'bg-blanco text-marron hover:bg-marfil'}`}
            >
              {t === 'all' ? 'Todas' : t === 'mass' ? 'Misas' : 'Sacramentos'}
            </button>
          ))}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | RequestStatus)}
          aria-label="Filtrar por estado"
          className="rounded-md border border-piedra/40 bg-blanco px-3 py-1.5 text-sm text-marron focus:border-dorado focus:outline-none focus:ring-1 focus:ring-dorado"
        >
          <option value="all">Todos los estados ({counts.all ?? 0})</option>
          {REQUEST_STATUSES.map((s) => (
            <option key={s} value={s}>
              {REQUEST_STATUS_LABELS[s]} ({counts[s] ?? 0})
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-piedra/50 bg-blanco p-10 text-center text-sm text-muted-foreground">
          No hay solicitudes con esos filtros.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-piedra/30 bg-blanco">
          <table className="min-w-full divide-y divide-piedra/20 text-sm">
            <thead className="bg-marfil/60">
              <tr>
                {['N° / Tipo', 'Solicitante', 'Fecha deseada', 'Estado', 'Acción'].map((label) => (
                  <th key={label} className="px-4 py-3 text-left text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-tierra">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-piedra/10">
              {filtered.map((req) => {
                const isOpen = expanded === req.id;
                return (
                  <React.Fragment key={req.id}>
                    <tr className="hover:bg-marfil/50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-carbone">{req.request_number ?? '—'}</p>
                        <p className="text-xs text-carbone/50">{req.kind === 'mass' ? 'Misa' : 'Sacramento'}</p>
                      </td>
                      <td className="px-4 py-3 text-carbone/80">{req.requester_name}</td>
                      <td className="px-4 py-3 text-carbone/80">{formatDate(req.requested_date)}</td>
                      <td className="px-4 py-3"><StatusBadge status={normalizeStatus(req.status)} /></td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setExpanded(isOpen ? null : req.id)}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {isOpen ? 'Cerrar' : 'Gestionar'}
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <DetailRow
                        request={req}
                        onSaved={() => {
                          setExpanded(null);
                          reload();
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

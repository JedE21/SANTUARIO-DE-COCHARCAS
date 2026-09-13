'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal de confirmación para acciones destructivas (reemplaza window.confirm).
 * Accesible: foco atrapado básico, cierre con Escape y rol de diálogo.
 */
export function ConfirmDialog({
  open,
  title,
  description = 'Esta acción no se puede deshacer.',
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label="Cerrar diálogo"
        onClick={onCancel}
        className="absolute inset-0 bg-negro/50 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-sm rounded-lg border border-piedra/30 bg-blanco p-6 shadow-xl">
        <div className="flex items-start gap-3.5">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-marfil text-dorado-oscuro ring-1 ring-piedra/40"
          >
            <AlertTriangle className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-heading text-lg font-medium text-marron">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-md border border-piedra/40 px-4 py-2 text-sm font-medium text-marron transition-colors hover:bg-marfil focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-oscuro disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {busy ? 'Eliminando…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

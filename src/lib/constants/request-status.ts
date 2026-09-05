/**
 * Estados del flujo de solicitudes pastorales (PROMPT 13).
 * Fuente unica: se comparte entre acciones, panel y pagina publica de
 * seguimiento — no duplicar estas definiciones.
 */

export type RequestStatus =
  | 'pending'
  | 'reviewing'
  | 'confirmed'
  | 'rejected'
  | 'completed'
  | 'cancelled';

export const REQUEST_STATUSES: RequestStatus[] = [
  'pending',
  'reviewing',
  'confirmed',
  'rejected',
  'completed',
  'cancelled',
];

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  pending: 'Recibida',
  reviewing: 'En revisión',
  confirmed: 'Aceptada',
  rejected: 'Rechazada',
  completed: 'Atendida',
  cancelled: 'Cancelada',
};

/** Clases Tailwind para badges (paleta patrimonial del proyecto). */
export const REQUEST_STATUS_STYLES: Record<RequestStatus, string> = {
  pending: 'bg-amber-100 text-amber-900 border-amber-200',
  reviewing: 'bg-blue-100 text-blue-900 border-blue-200',
  confirmed: 'bg-green-100 text-green-900 border-green-200',
  rejected: 'bg-red-100 text-red-900 border-red-200',
  completed: 'bg-dorado/20 text-carbone border-dorado/40',
  cancelled: 'bg-piedra/20 text-carbone/70 border-piedra/30',
};

export function requestStatusLabel(status: string | null | undefined): string {
  return REQUEST_STATUS_LABELS[(status as RequestStatus) ?? 'pending'] ?? 'Recibida';
}

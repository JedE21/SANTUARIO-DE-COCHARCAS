/**
 * Rate limiting en memoria (ventana deslizante por clave).
 *
 * Es una protección "best effort" por instancia de proceso: suficiente para
 * frenar fuerza bruta simple contra login, seguimiento de solicitudes y
 * formularios públicos. En despliegues multi-instancia, cada instancia aplica
 * su propio límite; para un límite global se puede migrar a Upstash/Redis sin
 * cambiar la API de este módulo.
 */

interface BucketEntry {
  hits: number[];
}

const buckets = new Map<string, BucketEntry>();
let lastSweep = Date.now();
const SWEEP_INTERVAL_MS = 60_000;

function sweep(maxWindowMs: number) {
  const now = Date.now();
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, entry] of buckets) {
    entry.hits = entry.hits.filter((hit) => now - hit < maxWindowMs);
    if (entry.hits.length === 0) buckets.delete(key);
  }
}

/**
 * Devuelve true si la acción está PERMITIDA; false si excede el límite.
 */
export function allowAction(key: string, limit: number, windowMs: number): boolean {
  sweep(Math.max(windowMs, SWEEP_INTERVAL_MS));
  const now = Date.now();
  const entry = buckets.get(key) ?? { hits: [] };
  entry.hits = entry.hits.filter((hit) => now - hit < windowMs);
  if (entry.hits.length >= limit) {
    buckets.set(key, entry);
    return false;
  }
  entry.hits.push(now);
  buckets.set(key, entry);
  return true;
}

export const RATE_LIMITS = {
  login: { limit: 5, windowMs: 5 * 60 * 1000 },
  tracking: { limit: 10, windowMs: 5 * 60 * 1000 },
  publicForm: { limit: 5, windowMs: 10 * 60 * 1000 },
  newsletter: { limit: 3, windowMs: 10 * 60 * 1000 },
  adminWrite: { limit: 60, windowMs: 60 * 1000 },
} as const;

/**
 * Control de intentos fallidos de inicio de sesión del panel.
 *
 * Dos políticas distintas (requisito institucional):
 *  - Correo NO registrado (acceso no autorizado): 3 intentos → bloqueo.
 *  - Correo registrado con contraseña incorrecta: 5 intentos → bloqueo
 *    hasta que se comunique con el administrador.
 *
 * IMPORTANTE: el bloqueo es POR DISPOSITIVO. La clave de conteo es
 * `deviceId:email`, donde deviceId vive en una cookie httpOnly del
 * navegador que intenta ingresar. Así, un ataque (o un error) desde un
 * dispositivo no bloquea al personal autorizado que usa otros equipos.
 *
 * La defensa global contra fuerza bruta distribuida sigue siendo el
 * rate-limit por IP (rate-limit.ts); este módulo añade el límite local
 * por dispositivo que pide la política institucional.
 *
 * Al igual que rate-limit.ts, es una protección en memoria por instancia
 * (best effort). Para un límite global multi-instancia se puede migrar a
 * Upstash/Redis sin cambiar la API de este módulo.
 */

const UNAUTHORIZED_MAX_ATTEMPTS = 3; // correo sin cuenta autorizada
const WRONG_PASSWORD_MAX_ATTEMPTS = 5; // correo registrado, contraseña errada

/** Ventana de conteo: 30 minutos desde el primer intento fallido. */
const ATTEMPT_WINDOW_MS = 30 * 60 * 1000;

/** Bloqueo por exceso de intentos: 30 minutos. */
const LOCKOUT_MS = 30 * 60 * 1000;

interface AttemptEntry {
  unauthorized: number;
  wrongPassword: number;
  firstAttemptAt: number;
  lockedUntil: number | null;
}

const attempts = new Map<string, AttemptEntry>();
let lastSweep = Date.now();
const SWEEP_INTERVAL_MS = 60_000;

function sweep() {
  const now = Date.now();
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, entry] of attempts) {
    const expired = now - entry.firstAttemptAt > ATTEMPT_WINDOW_MS;
    const lockLifted = entry.lockedUntil !== null && now >= entry.lockedUntil;
    if (expired || (lockLifted && entry.lockedUntil !== null)) {
      // Al expirar la ventana o el bloqueo se reinicia el contador.
      if (expired && lockLifted) attempts.delete(key);
      else if (expired) attempts.delete(key);
      else if (lockLifted) {
        entry.lockedUntil = null;
        entry.unauthorized = 0;
        entry.wrongPassword = 0;
        entry.firstAttemptAt = now;
      }
    }
  }
}

function entryFor(key: string): AttemptEntry {
  const now = Date.now();
  let entry = attempts.get(key);
  if (!entry || now - entry.firstAttemptAt > ATTEMPT_WINDOW_MS) {
    entry = { unauthorized: 0, wrongPassword: 0, firstAttemptAt: now, lockedUntil: null };
    attempts.set(key, entry);
  }
  return entry;
}

export interface AttemptState {
  blocked: boolean;
  /** Mensaje para mostrar cuando está bloqueado. */
  blockMessage?: string;
  /** Intentos restantes antes del bloqueo, si no está bloqueado. */
  remaining?: number;
}

/**
 * Consulta si una clave dispositivo+correo está bloqueada, sin registrar
 * un nuevo intento.
 *
 * @param key Clave compuesta `${deviceId}:${email}` (ver composeAttemptKey).
 */
export function isBlocked(key: string): AttemptState {
  sweep();
  const entry = attempts.get(key);
  if (!entry) return { blocked: false };

  const now = Date.now();
  if (entry.lockedUntil !== null && now < entry.lockedUntil) {
    const mins = Math.max(1, Math.ceil((entry.lockedUntil - now) / 60_000));
    return {
      blocked: true,
      blockMessage:
        `Acceso bloqueado por intentos fallidos. Inténtalo de nuevo en ${mins} min ` +
        'o comunica con el administrador.',
    };
  }
  if (entry.lockedUntil !== null && now >= entry.lockedUntil) {
    // Bloqueo expirado: se limpia perezosamente aquí para lecturas sucesivas.
    attempts.delete(key);
    return { blocked: false };
  }
  return { blocked: false };
}

/**
 * Registra un intento fallido para la clave dispositivo+correo y devuelve
 * el estado resultante.
 *
 * @param key  Clave compuesta `${deviceId}:${email}` (ver composeAttemptKey).
 * @param kind 'unauthorized' (correo sin cuenta autorizada) o
 *             'wrong_password' (correo registrado, contraseña errada).
 */
export function recordFailedAttempt(key: string, kind: 'unauthorized' | 'wrong_password'): AttemptState {
  sweep();
  const entry = entryFor(key);
  const now = Date.now();

  if (kind === 'unauthorized') entry.unauthorized += 1;
  else entry.wrongPassword += 1;

  const max =
    kind === 'unauthorized' ? UNAUTHORIZED_MAX_ATTEMPTS : WRONG_PASSWORD_MAX_ATTEMPTS;
  const used = kind === 'unauthorized' ? entry.unauthorized : entry.wrongPassword;

  if (used >= max) {
    entry.lockedUntil = now + LOCKOUT_MS;
    attempts.set(key, entry);
    return {
      blocked: true,
      blockMessage:
        'Acceso bloqueado: se superó el número de intentos permitidos. ' +
        'Comunica con el administrador del panel para restablecer tu acceso.',
    };
  }

  attempts.set(key, entry);
  return { blocked: false, remaining: max - used };
}

/** Limpia el conteo de una clave dispositivo+correo tras un login exitoso. */
export function clearAttempts(key: string): void {
  attempts.delete(key);
}

/**
 * Clave de conteo: dispositivo + correo (en minúsculas).
 * El bloqueo así queda limitado al dispositivo que falla, no a la cuenta.
 */
export function composeAttemptKey(deviceId: string, email: string): string {
  return `${deviceId}:${email.trim().toLowerCase()}`;
}

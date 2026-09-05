/**
 * Sesión administrativa firmada con HMAC-SHA256.
 *
 * Reemplaza a la antigua cookie `admin_authenticated=true`, que era
 * falsificable por cualquier visitante. El token es `payload.firma` donde
 * la firma solo puede producirse con el secreto del servidor.
 *
 * Usa Web Crypto API, disponible tanto en el middleware (Edge) como en el
 * runtime de Node.js, así la misma verificación protege ambas capas.
 */

export const ADMIN_SESSION_COOKIE = 'admin_session';
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 horas

export interface AdminSessionPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
}

const encoder = new TextEncoder();

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/**
 * Secreto de firma. Se prefiere ADMIN_SESSION_SECRET (dedicado); se acepta
 * la service role key como respaldo porque nunca sale del servidor.
 * Si no hay secreto, la sesión es imposible → el sistema falla cerrado.
 */
function getSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  return secret && secret.length >= 16 ? secret : null;
}

export function hasSessionSecret(): boolean {
  return getSessionSecret() !== null;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

async function sign(data: string, key: CryptoKey): Promise<string> {
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return bytesToBase64Url(new Uint8Array(signature));
}

export async function createSessionToken(payload: Omit<AdminSessionPayload, 'exp'>): Promise<string | null> {
  const secret = getSessionSecret();
  if (!secret) return null;
  const body: AdminSessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS,
  };
  const encoded = bytesToBase64Url(encoder.encode(JSON.stringify(body)));
  const signature = await sign(encoded, await importKey(secret));
  return `${encoded}.${signature}`;
}

/** Comparación en tiempo constante para firmas de igual longitud. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifySessionToken(token: string | undefined | null): Promise<AdminSessionPayload | null> {
  if (!token) return null;
  const secret = getSessionSecret();
  if (!secret) return null;

  const dotIndex = token.lastIndexOf('.');
  if (dotIndex <= 0) return null;
  const encoded = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);
  if (!encoded || !signature) return null;

  try {
    const expected = await sign(encoded, await importKey(secret));
    if (!timingSafeEqual(signature, expected)) return null;

    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encoded))) as AdminSessionPayload;
    if (!payload || typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now()) return null;
    if (typeof payload.sub !== 'string' || typeof payload.role !== 'string') return null;
    return payload;
  } catch {
    return null;
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/security/session';

/**
 * Proteccion de /admin.
 *
 * La sesion es un token firmado con HMAC-SHA256 (ADMIN_SESSION_SECRET):
 * falsificar la cookie requiere conocer el secreto del servidor.
 * La misma verificacion se repite en cada server action administrativa
 * (defensa en profundidad: el middleware no es la unica linea).
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdmin = pathname.startsWith('/admin');
  const isLogin = pathname === '/admin/login' || pathname === '/admin/login/';
  if (!isAdmin) return NextResponse.next();

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (isLogin) {
    if (session) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
};

/** @type {import('next').NextConfig} */

// CSP compatible con Next.js (RSC usa scripts inline) y Supabase.
// 'unsafe-inline' en scripts/styles es el compromiso necesario para el
// App Router sin nonces; el resto de directivas siguen endureciendo.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https: data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-src 'self' https://www.google.com https://maps.google.com https://www.openstreetmap.org",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "media-src 'self' https://*.supabase.co",
].join('; ');

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Límite de body para server actions: la biblioteca multimedia sube
  // imágenes de hasta 10 MB (MEDIA_MAX_BYTES en actions.ts).
  experimental: {
    serverActions: { bodySizeLimit: '12mb' },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Imágenes administradas en Supabase Storage
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ]
      }
    ];
  }
};

module.exports = nextConfig;

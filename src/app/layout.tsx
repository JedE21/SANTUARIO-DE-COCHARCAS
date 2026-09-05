import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { defaultOgImages, siteDescription, siteKeywords, siteName, siteUrl } from '@/lib/seo';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-title',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: siteKeywords,
  authors: [{ name: 'Ing. de Sistemas José J. Echegaray Díaz' }],
  creator: 'Ing. de Sistemas José J. Echegaray Díaz',
  publisher: siteName,
  category: 'religion',
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: '/',
    siteName,
    title: siteName,
    description: siteDescription,
    images: defaultOgImages(),
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: defaultOgImages().map((img) => img.url),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#F7F3EA',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-background font-body text-foreground antialiased">{children}</body>
    </html>
  );
}

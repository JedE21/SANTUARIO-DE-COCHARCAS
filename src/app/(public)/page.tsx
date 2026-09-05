import Image from 'next/image';
import type { Metadata } from 'next';
import { CalendarDays, ImageIcon, Newspaper } from 'lucide-react';
import { Section, Container, SectionHeading, Link, Button, Card, Badge, EmptyState } from '@/components/public';
import { FadeIn, Stagger, StaggerItem, Parallax } from '@/components/motion';
import { MassSchedule } from '@/components/shared/mass-schedule';
import { JsonLd } from '@/components/shared/json-ld';
import { absoluteUrl, defaultOgImages, ogImagePath, siteDescription, siteName, siteUrl } from '@/lib/seo';
import {
  getNewsList,
  getEventsList,
  getGalleryItems,
  getHomeSections,
  getMassSchedules,
  getSiteSettings,
} from '@/lib/queries';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
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
};

const featuredLinks = [
  { title: 'El Santuario', href: '/santuario', description: 'Historia, arquitectura y patrimonio del templo.' },
  { title: 'Vida de Fe', href: '/fe', description: 'Misas, sacramentos y solicitudes pastorales.' },
  { title: 'Festividades', href: '/festividades', description: 'Celebraciones que reúnen a la comunidad.' },
  { title: 'Visita', href: '/visita', description: 'Cómo llegar, horarios y recomendaciones.' },
];

function formatDate(value?: string | null) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

function sectionByKey(sections: Awaited<ReturnType<typeof getHomeSections>>, key: string) {
  return sections.find((s) => s.key === key);
}

export default async function Home() {
  const [news, events, gallery, sections, schedules, settings] = await Promise.all([
    getNewsList(3),
    getEventsList(),
    getGalleryItems(),
    getHomeSections(),
    getMassSchedules(),
    getSiteSettings(),
  ]);

  const hero = sectionByKey(sections, 'hero');
  const intro = sectionByKey(sections, 'introduccion');
  const visita = sectionByKey(sections, 'visita');
  const upcomingEvents = events.slice(0, 3);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': ['Church', 'TouristAttraction'],
      '@id': `${siteUrl}/#santuario`,
      name: siteName,
      description: siteDescription,
      url: siteUrl,
      image: absoluteUrl(ogImagePath),
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Plaza de Armas s/n, Cocharcas',
        addressLocality: 'Cocharcas',
        addressRegion: 'Apurímac',
        addressCountry: 'PE',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteUrl}/#sitio`,
      name: siteName,
      url: siteUrl,
      inLanguage: 'es-PE',
      publisher: { '@id': `${siteUrl}/#santuario` },
    },
  ];

  return (
    <main>
      <JsonLd data={jsonLd} />
      <section className="relative overflow-hidden bg-gradient-to-br from-carbone via-verde-andes to-dorado text-white">
        <Parallax className="pointer-events-none absolute inset-0" offset={28}>
          <div className="absolute -inset-y-12 inset-x-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.10),transparent_30%)]" />
        </Parallax>
        <Container className="relative py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <FadeIn>
              <Badge className="mb-6 border-white/20 bg-white/10 text-white">
                {settings.site_name || 'Santuario de Nuestra Señora de Cocharcas'}
              </Badge>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                {hero?.title || 'Fe, historia y tradición en el corazón de los Andes'}
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85 sm:text-xl">
                {hero?.description ||
                  'Un espacio vivo de peregrinación, memoria y encuentro comunitario en Cocharcas, Apurímac.'}
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Button asChild>
                  <Link href="/santuario">Conocer el Santuario</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/visita">Planifica tu visita</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      <Section className="bg-background">
        <Container>
          <SectionHeading
            title={intro?.title || 'Explora el santuario'}
            description={
              intro?.description || 'Accede a los contenidos principales del sitio desde una sola vista.'
            }
          />
          <Stagger className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredLinks.map((item, index) => (
              <Card key={item.href} className="h-full p-6">
                <div className="space-y-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <span className="text-sm font-semibold">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Link href={item.href} className="inline-flex items-center text-sm font-medium text-primary">
                    Ver más
                    <span className="ml-2" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </div>
              </Card>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section className="bg-marfil">
        <Container>
          <SectionHeading
            title="Horarios de celebración"
            description="Una referencia rápida a la vida litúrgica del santuario."
          />
          <div className="mt-10">
            <MassSchedule items={schedules} title="" />
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <FadeIn>
              <div className="space-y-4">
                <SectionHeading
                  title={visita?.title || 'Una casa abierta para todos'}
                  description={
                    visita?.description ||
                    'Si estás organizando una visita, una celebración o una intención especial, aquí tienes acceso directo a lo esencial.'
                  }
                  textAlign="left"
                />
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild>
                    <Link href="/fe/solicitar-misa">Solicitar una misa</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/fe/sacramentos">Ver sacramentos</Link>
                  </Button>
                </div>
              </div>
            </FadeIn>

            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Puntos de contacto</h3>
                <p className="text-sm text-muted-foreground">{settings.address || '[POR CONFIRMAR]'}</p>
                <p className="text-sm text-muted-foreground">
                  Teléfono: {settings.phone || '[POR CONFIRMAR]'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Correo: {settings.email || '[POR CONFIRMAR]'}
                </p>
                {settings.responsible_name ? (
                  <p className="text-sm text-muted-foreground">
                    Responsable: {settings.responsible_name}
                    {settings.responsible_title ? ` — ${settings.responsible_title}` : ''}
                  </p>
                ) : null}
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <Section className="bg-marfil">
        <Container>
          <SectionHeading title="Noticias recientes" description="Novedades pastorales y de la comunidad." />
          {news.length === 0 ? (
            <EmptyState
              className="mt-10"
              icon={<Newspaper className="h-6 w-6" />}
              title="Aún no hay noticias publicadas"
              description="Las novedades pastorales y de la comunidad aparecerán en esta sección."
            />
          ) : (
            <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
              {news.map((item) => (
                <StaggerItem key={item.id} className="h-full">
                  <Card className="group h-full overflow-hidden">
                    <Link href={`/noticias/${item.slug}`} className="block">
                      <div className="relative aspect-video w-full overflow-hidden bg-muted/20">
                        <Image
                          src={item.cover_image_url || '/images/cocharcas-news.svg'}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <p className="text-xs uppercase tracking-wide text-primary">{formatDate(item.published_at)}</p>
                        <h3 className="mt-2 text-xl font-semibold group-hover:text-primary">{item.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {item.excerpt || item.content}
                        </p>
                      </div>
                    </Link>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <SectionHeading title="Próximos eventos" description="Agenda litúrgica y comunitaria." />
          {upcomingEvents.length === 0 ? (
            <EmptyState
              className="mt-10"
              icon={<CalendarDays className="h-6 w-6" />}
              title="No hay eventos programados por el momento"
              description="Cuando se anuncien celebraciones y actividades, las encontrarás aquí."
            />
          ) : (
            <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
              {upcomingEvents.map((event) => (
                <StaggerItem key={event.id} className="h-full">
                  <Card className="group h-full overflow-hidden">
                    <Link href={`/eventos/${event.slug}`} className="block">
                      <div className="relative aspect-video w-full overflow-hidden bg-muted/20">
                        <Image
                          src={event.image_url || '/images/cocharcas-event.svg'}
                          alt={event.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <Badge variant="outline">{formatDate(event.start_date)}</Badge>
                        <h3 className="mt-3 text-xl font-semibold group-hover:text-primary">{event.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
                      </div>
                    </Link>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </Container>
      </Section>

      <Section className="bg-marfil">
        <Container>
          <SectionHeading title="Galería" description="Fotografías del santuario y su comunidad." />
          {gallery.length === 0 ? (
            <EmptyState
              className="mt-10"
              icon={<ImageIcon className="h-6 w-6" />}
              title="La galería estará disponible próximamente"
              description="Pronto compartiremos fotografías del templo, las festividades y la comunidad."
            />
          ) : (
            <Stagger className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {gallery.slice(0, 6).map((item) => (
                <StaggerItem key={item.id}>
                  <Link
                    href="/galeria"
                    className="group relative block aspect-square overflow-hidden rounded-md bg-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Image
                      src={item.image_url}
                      alt={item.alt_text || item.title || ''}
                      fill
                      sizes="(max-width: 640px) 33vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </Container>
      </Section>
    </main>
  );
}

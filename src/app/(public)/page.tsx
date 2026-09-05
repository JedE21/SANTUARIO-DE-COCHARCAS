import Image from 'next/image';
import type { Metadata } from 'next';
import { CalendarDays, ImageIcon, Newspaper } from 'lucide-react';
import { Section, Container, SectionHeading, Link, Button, Card, Badge, EmptyState } from '@/components/public';
import { FadeIn, Stagger, StaggerItem, Reveal } from '@/components/motion';
import { HeroCocharcas } from '@/components/public/hero-cocharcas';
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
      <HeroCocharcas
        badge={settings.site_name || 'Santuario de Nuestra Señora de Cocharcas'}
        title={hero?.title || 'Fe, historia y tradición en el corazón de los Andes'}
        description={
          hero?.description ||
          'Un espacio vivo de peregrinación, memoria y encuentro comunitario en Cocharcas, Apurímac.'
        }
        imageUrl={hero?.image_url}
      />

      <Section className="bg-background">
        <Container>
          <Reveal>
            <SectionHeading
              title={intro?.title || 'Explora el santuario'}
              description={
                intro?.description || 'Accede a los contenidos principales del sitio desde una sola vista.'
              }
            />
          </Reveal>
          <Stagger className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredLinks.map((item, index) => (
              <Card key={item.href} className="h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="space-y-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-dorado/40 bg-dorado/10 text-dorado-oscuro">
                    <span className="text-sm font-semibold">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-azul">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Link href={item.href} className="link-editorial inline-flex items-center text-sm font-medium text-primary">
                    Ver más
                    <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
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
          <Reveal>
            <SectionHeading
              title="Horarios de celebración"
              description="Una referencia rápida a la vida litúrgica del santuario."
            />
          </Reveal>
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
          <Reveal>
            <SectionHeading title="Noticias recientes" description="Novedades pastorales y de la comunidad." />
          </Reveal>
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
                  <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <Link href={`/noticias/${item.slug}`} className="block">
                      <div className="relative aspect-video w-full overflow-hidden bg-muted/20">
                        <Image
                          src={item.cover_image_url || '/images/cocharcas-news.svg'}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="p-6">
                        <p className="text-xs uppercase tracking-wide text-carmesi">{formatDate(item.published_at)}</p>
                        <h3 className="mt-2 text-xl font-semibold transition-normal group-hover:text-azul">{item.title}</h3>
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
          <Reveal>
            <SectionHeading title="Próximos eventos" description="Agenda litúrgica y comunitaria." />
          </Reveal>
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
                  <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <Link href={`/eventos/${event.slug}`} className="block">
                      <div className="relative aspect-video w-full overflow-hidden bg-muted/20">
                        <Image
                          src={event.image_url || '/images/cocharcas-event.svg'}
                          alt={event.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="p-6">
                        <Badge variant="outline">{formatDate(event.start_date)}</Badge>
                        <h3 className="mt-3 text-xl font-semibold transition-normal group-hover:text-azul">{event.title}</h3>
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
          <Reveal>
            <SectionHeading title="Galería" description="Fotografías del santuario y su comunidad." />
          </Reveal>
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

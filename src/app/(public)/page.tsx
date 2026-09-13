import Image from 'next/image';
import type { Metadata } from 'next';
import {
  ArrowRight,
  CalendarDays,
  Church,
  Cross,
  Footprints,
  Camera,
  Newspaper,
  PenLine,
} from 'lucide-react';
import { Section, Container, Link, EmptyState } from '@/components/public';
import { FadeIn, Reveal } from '@/components/motion';
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
  getFestivitiesList,
  getSlidesBySection,
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

/* ------------------------------------------------------------------ */
/*  Utilidades de formato                                              */
/* ------------------------------------------------------------------ */

function formatDate(value?: string | null) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateCaps(value?: string | null) {
  if (!value) return '';
  return new Date(value)
    .toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace(/\./g, '')
    .toUpperCase();
}

function eventDay(value: string) {
  return new Date(value).getDate().toString().padStart(2, '0');
}

function eventMonth(value: string) {
  return new Date(value).toLocaleDateString('es-PE', { month: 'short' }).replace(/\./g, '').toUpperCase();
}

function eventTime(value: string) {
  return new Date(value).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/* ------------------------------------------------------------------ */
/*  Contenido estático editorial (institucional, no dinámico)          */
/* ------------------------------------------------------------------ */

const datosDestacados = [
  { valor: 'Siglo XVI', etiqueta: 'Origen de la devoción' },
  { valor: 'Apurímac', etiqueta: 'Chincheros · Cocharcas' },
  { valor: 'Peregrinación', etiqueta: 'Fe que atraviesa generaciones' },
  { valor: 'Patrimonio', etiqueta: 'Historia viva del Perú' },
];

const vidaDeFe = [
  {
    icon: Church,
    titulo: 'Misas',
    detalle: 'Celebración eucarística diaria y dominical.',
    href: '/fe/misas',
    accion: 'Ver horarios',
  },
  {
    icon: Cross,
    titulo: 'Sacramentos',
    detalle: 'Bautismo, confirmación, matrimonio y más.',
    href: '/fe/sacramentos',
    accion: 'Conocer',
  },
  {
    icon: PenLine,
    titulo: 'Solicitudes pastorales',
    detalle: 'Intenciones de misa y acompañamiento.',
    href: '/solicitudes',
    accion: 'Solicitar',
  },
  {
    icon: Footprints,
    titulo: 'Peregrinación',
    detalle: 'Caminos de fe hacia la Virgen de Cocharcas.',
    href: '/visita',
    accion: 'Preparar visita',
  },
];

/* ------------------------------------------------------------------ */

export default async function Home() {
  const [news, events, gallery, sections, schedules, settings, festivities, homeSlides] = await Promise.all([
    getNewsList(3),
    getEventsList(),
    getGalleryItems(),
    getHomeSections(),
    getMassSchedules(),
    getSiteSettings(),
    getFestivitiesList(),
    getSlidesBySection('home'),
  ]);

  const sectionByKey = (key: string) => sections.find((s) => s.key === key);
  const hero = sectionByKey('hero');
  const intro = sectionByKey('introduccion');
  const visita = sectionByKey('visita');

  const upcomingEvents = events
    .filter((e) => new Date(e.start_date).getTime() >= Date.now() - 24 * 60 * 60 * 1000)
    .slice(0, 4);
  const eventosAgenda = upcomingEvents.length > 0 ? upcomingEvents : events.slice(0, 4);

  const mainFeast = festivities[0] ?? null;
  const galleryItems = gallery.slice(0, 5);

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

      {/* ── 1 · HERO CINEMATOGRÁFICO (slider) ──────────────────────── */}
      <HeroCocharcas
        badge="Chincheros · Apurímac · Perú"
        title={hero?.title || 'Santuario de Nuestra Señora de Cocharcas'}
        description={hero?.description || 'Fe, historia y tradición en el corazón de los Andes.'}
        imageUrl={hero?.image_url}
        slides={homeSlides.map((s) => ({ src: s.image_url, alt: s.title || 'Imagen del santuario' }))}
      />

      {/* ── 2 · EL SANTUARIO (editorial asimétrico) ─────────────────── */}
      <Section className="bg-marfil">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
            <FadeIn className="lg:col-span-5">
              <p className="eyebrow text-tierra">El Santuario</p>
              <h2 className="display-section mt-6 text-marron">
                Un lugar de fe, historia y memoria
              </h2>
              <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                {intro?.content ||
                  'El Santuario de Nuestra Señora de Cocharcas es uno de los espacios de peregrinación y devoción mariana más importantes de Apurímac.'}
              </p>
              <Link
                href="/santuario"
                className="group mt-10 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-marron transition-colors duration-300 hover:text-dorado-oscuro"
              >
                <span className="border-b border-marron/30 pb-1.5 transition-colors duration-300 group-hover:border-dorado">
                  Conocer el Santuario
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </FadeIn>

            <FadeIn delay={0.12} className="lg:col-span-7">
              <div className="group relative">
                <div
                  aria-hidden="true"
                  className="absolute -left-4 -top-4 hidden h-full w-full border border-tierra/25 lg:block"
                />
                <div className="relative aspect-[4/3] overflow-hidden bg-piedra/40 lg:aspect-[16/11]">
                  <Image
                    src="/images/santuario/santuario-plaza.jpg"
                    alt="Fachada principal del Santuario de Nuestra Señora de Cocharcas, Chincheros, Apurímac"
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="img-zoom object-cover"
                  />
                </div>
                <p className="mt-4 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-tierra">
                  Templo de piedra y cal · Cocharcas, Chincheros — Apurímac
                </p>
              </div>
            </FadeIn>
          </div>
        </Container>
      </Section>

      {/* ── 3 · DATOS DESTACADOS (editorial, sin tarjetas) ──────────── */}
      <section className="border-y border-tierra/15 bg-blanco">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {datosDestacados.map((dato, i) => (
              <Reveal
                key={dato.valor}
                delay={i * 0.08}
                className={`px-6 py-12 text-center sm:py-14 lg:py-16 ${
                  i > 0 ? 'border-l border-tierra/15' : ''
                } ${i > 1 ? 'max-lg:border-t max-lg:border-tierra/15' : ''} ${
                  i === 2 ? 'max-lg:border-l-0' : ''
                }`}
              >
                <p className="font-heading text-2xl font-medium text-marron sm:text-3xl">{dato.valor}</p>
                <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-tierra">
                  {dato.etiqueta}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 4 · VIDA DE FE ──────────────────────────────────────────── */}
      <Section className="bg-blanco">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <FadeIn className="lg:col-span-5">
              <p className="eyebrow text-tierra">Vida de Fe</p>
              <h2 className="display-section mt-6 text-marron">Una casa abierta para la oración</h2>
              <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                {visita?.description ||
                  'Misas, sacramentos y acompañamiento pastoral para los fieles y peregrinos del santuario.'}
              </p>
              <div className="mt-9 flex flex-col gap-4">
                <Link
                  href="/fe/solicitar-misa"
                  className="group inline-flex w-fit items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-marron transition-colors duration-300 hover:text-dorado-oscuro"
                >
                  <span className="border-b border-marron/30 pb-1.5 transition-colors duration-300 group-hover:border-dorado">
                    Solicitar una misa
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link
                  href="/solicitudes/sacramentos"
                  className="group inline-flex w-fit items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-marron transition-colors duration-300 hover:text-dorado-oscuro"
                >
                  <span className="border-b border-marron/30 pb-1.5 transition-colors duration-300 group-hover:border-dorado">
                    Solicitar un sacramento
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </FadeIn>

            <div className="lg:col-span-7">
              <FadeIn delay={0.1}>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-tierra">
                  Horarios de celebración
                </p>
                <MassSchedule items={schedules} title="" className="mt-6" />
              </FadeIn>

              <div className="mt-12 grid gap-px border border-tierra/15 bg-tierra/15 sm:grid-cols-2">
                {vidaDeFe.map((item, i) => (
                  <Reveal key={item.titulo} delay={0.06 * i} className="bg-blanco">
                    <Link
                      href={item.href}
                      className="group flex h-full flex-col gap-3 px-7 py-8 transition-colors duration-300 hover:bg-marfil"
                    >
                      <item.icon className="h-5 w-5 text-dorado-oscuro" strokeWidth={1.5} aria-hidden="true" />
                      <h3 className="font-heading text-xl font-medium text-marron">{item.titulo}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.detalle}</p>
                      <span className="mt-auto inline-flex items-center gap-2 pt-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-tierra transition-colors duration-300 group-hover:text-dorado-oscuro">
                        {item.accion}
                        <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 5 · FESTIVIDADES (banda visual protagonista) ────────────── */}
      <section className="relative overflow-hidden bg-negro text-marfil">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src="/images/santuario/pintura-detalle.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-45"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(23,22,21,0.88) 0%, rgba(23,22,21,0.62) 45%, rgba(23,22,21,0.35) 100%)',
            }}
          />
        </div>

        <Container className="relative">
          <div className="section max-w-3xl py-28 lg:py-36">
            <FadeIn>
              <p className="eyebrow text-dorado-claro">Festividad Patronal</p>
              <h2 className="display-section mt-6 text-marfil">La fe que reúne a generaciones</h2>
              {mainFeast ? (
                <p className="mt-6 font-heading text-lg italic text-marfil/85 sm:text-xl">
                  {mainFeast.name}
                  {mainFeast.start_date ? ` · ${formatDate(mainFeast.start_date)}` : ''}
                </p>
              ) : null}
              <p className="mt-6 max-w-xl text-base leading-relaxed text-marfil/75 sm:text-lg">
                Cada año, miles de peregrinos caminan hasta Cocharcas para honrar a la Virgen:
                eucaristía solemne, procesión, danzas y tradición viva del pueblo cocharquino.
              </p>
              <Link
                href="/festividades"
                className="group mt-10 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-dorado-claro transition-colors duration-300 hover:text-blanco"
              >
                <span className="border-b border-dorado-claro/40 pb-1.5 transition-colors duration-300 group-hover:border-blanco/60">
                  Conocer las festividades
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* ── 6 · NOTICIAS (lista editorial) ──────────────────────────── */}
      <Section className="bg-marfil">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            <FadeIn className="lg:col-span-4">
              <p className="eyebrow text-tierra">Noticias</p>
              <h2 className="display-section mt-6 text-marron">Vida de la comunidad</h2>
              <Link
                href="/noticias"
                className="group mt-9 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-marron transition-colors duration-300 hover:text-dorado-oscuro"
              >
                <span className="border-b border-marron/30 pb-1.5 transition-colors duration-300 group-hover:border-dorado">
                  Todas las noticias
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </FadeIn>

            <div className="lg:col-span-8">
              {news.length === 0 ? (
                <EmptyState
                  icon={<Newspaper className="h-6 w-6" />}
                  title="Aún no hay noticias publicadas"
                  description="Las novedades pastorales y de la comunidad aparecerán en esta sección."
                />
              ) : (
                <ol className="border-t border-tierra/20">
                  {news.map((item, i) => (
                    <Reveal key={item.id} delay={i * 0.07}>
                      <li className="border-b border-tierra/20">
                        <Link
                          href={`/noticias/${item.slug}`}
                          className="group grid gap-3 py-8 transition-colors duration-300 sm:grid-cols-[3rem_1fr_auto] sm:items-baseline sm:gap-8 sm:py-9"
                        >
                          <span className="font-heading text-lg tabular-nums text-tierra/70">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span>
                            <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-tierra">
                              {formatDateCaps(item.published_at)}
                            </span>
                            <span className="mt-2 block font-heading text-2xl font-medium leading-snug text-marron transition-colors duration-300 group-hover:text-dorado-oscuro sm:text-3xl">
                              {item.title}
                            </span>
                            {item.excerpt ? (
                              <span className="mt-2 line-clamp-2 block max-w-xl text-sm leading-relaxed text-muted-foreground">
                                {item.excerpt}
                              </span>
                            ) : null}
                          </span>
                          <ArrowRight
                            className="hidden h-4 w-4 text-tierra/60 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-dorado-oscuro sm:block"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    </Reveal>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 7 · EVENTOS (agenda elegante) ───────────────────────────── */}
      <Section className="bg-blanco">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            <FadeIn className="lg:col-span-4">
              <p className="eyebrow text-tierra">Eventos</p>
              <h2 className="display-section mt-6 text-marron">Agenda del santuario</h2>
              <Link
                href="/eventos"
                className="group mt-9 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-marron transition-colors duration-300 hover:text-dorado-oscuro"
              >
                <span className="border-b border-marron/30 pb-1.5 transition-colors duration-300 group-hover:border-dorado">
                  Ver agenda completa
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </FadeIn>

            <div className="lg:col-span-8">
              {eventosAgenda.length === 0 ? (
                <EmptyState
                  icon={<CalendarDays className="h-6 w-6" />}
                  title="No hay eventos programados por el momento"
                  description="Cuando se anuncien celebraciones y actividades, las encontrarás aquí."
                />
              ) : (
                <ol className="border-t border-tierra/20">
                  {eventosAgenda.map((event, i) => (
                    <Reveal key={event.id} delay={i * 0.07}>
                      <li className="border-b border-tierra/20">
                        <Link
                          href={`/eventos/${event.slug}`}
                          className="group flex items-center gap-6 py-7 transition-colors duration-300 sm:gap-10"
                        >
                          <span className="w-16 shrink-0 text-center sm:w-20">
                            <span className="block font-heading text-4xl font-medium leading-none text-marron sm:text-5xl">
                              {eventDay(event.start_date)}
                            </span>
                            <span className="mt-2 block text-[0.6rem] font-semibold uppercase tracking-[0.26em] text-tierra">
                              {eventMonth(event.start_date)}
                            </span>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-heading text-xl font-medium leading-snug text-marron transition-colors duration-300 group-hover:text-dorado-oscuro sm:text-2xl">
                              {event.title}
                            </span>
                            <span className="mt-2 block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                              {[event.location, `${eventTime(event.start_date)} h`].filter(Boolean).join(' · ')}
                            </span>
                          </span>
                          <ArrowRight
                            className="h-4 w-4 shrink-0 text-tierra/60 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-dorado-oscuro"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    </Reveal>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 8 · GALERÍA (mosaico editorial) ─────────────────────────── */}
      <Section className="bg-marfil">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <FadeIn>
              <p className="eyebrow text-tierra">Galería</p>
              <h2 className="display-section mt-6 text-marron">El santuario en imágenes</h2>
            </FadeIn>
            <FadeIn delay={0.08}>
              <Link
                href="/galeria"
                className="group inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-marron transition-colors duration-300 hover:text-dorado-oscuro"
              >
                <span className="border-b border-marron/30 pb-1.5 transition-colors duration-300 group-hover:border-dorado">
                  Ver galería completa
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </FadeIn>
          </div>

          {galleryItems.length === 0 ? (
            <EmptyState
              className="mt-12"
              icon={<Camera className="h-6 w-6" />}
              title="La galería estará disponible próximamente"
              description="Pronto compartiremos fotografías del templo, las festividades y la comunidad."
            />
          ) : (
            <div className="mt-12 grid auto-rows-[150px] grid-cols-2 gap-2 sm:auto-rows-[190px] lg:auto-rows-[230px] lg:grid-cols-4">
              {galleryItems.map((item, i) => (
                <Reveal
                  key={item.id}
                  delay={i * 0.06}
                  className={i === 0 ? 'col-span-2 row-span-2' : ''}
                >
                  <Link
                    href="/galeria"
                    className="group relative block h-full w-full overflow-hidden bg-piedra/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-oscuro focus-visible:ring-offset-2"
                    aria-label={`Ver en la galería: ${item.alt_text || item.title || 'fotografía del santuario'}`}
                  >
                    <Image
                      src={item.image_url}
                      alt={item.alt_text || item.title || 'Fotografía del santuario'}
                      fill
                      sizes={i === 0 ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 50vw, 25vw'}
                      className="img-zoom object-cover"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-negro/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                    {item.title ? (
                      <span className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-marfil opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        {item.title}
                      </span>
                    ) : null}
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* ── 9 · VEN A COCHARCAS (cierre solemne) ────────────────────── */}
      <section className="bg-marron text-marfil">
        <Container>
          <div className="section-xl grid gap-14 lg:grid-cols-2 lg:gap-24">
            <FadeIn>
              <p className="eyebrow text-dorado-claro">Visita</p>
              <h2 className="display-section mt-6 text-marfil">Ven a Cocharcas</h2>
              <p className="mt-7 max-w-md text-base leading-relaxed text-marfil/75 sm:text-lg">
                En el corazón de Apurímac te espera un santuario de piedra, una Virgen de
                devoción inmemorial y un pueblo que recibe al peregrino como familia.
              </p>
              <div className="mt-10 flex flex-wrap gap-8">
                <Link
                  href="/visita"
                  className="group inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-dorado-claro transition-colors duration-300 hover:text-blanco"
                >
                  <span className="border-b border-dorado-claro/40 pb-1.5 transition-colors duration-300 group-hover:border-blanco/60">
                    Planifica tu visita
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link
                  href="/contacto"
                  className="group inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-marfil/80 transition-colors duration-300 hover:text-blanco"
                >
                  <span className="border-b border-marfil/30 pb-1.5 transition-colors duration-300 group-hover:border-blanco/60">
                    Escríbenos
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="border-t border-marfil/15">
                {[
                  { label: 'Dirección', valor: settings.address || 'Cocharcas, Chincheros, Apurímac, Perú' },
                  ...(settings.phone ? [{ label: 'Teléfono', valor: settings.phone }] : []),
                  ...(settings.email ? [{ label: 'Correo', valor: settings.email }] : []),
                  ...(settings.responsible_name
                    ? [
                        {
                          label: 'Responsable Parroquial',
                          valor: `${settings.responsible_name}${settings.responsible_title ? ` — ${settings.responsible_title}` : ''}`,
                        },
                      ]
                    : []),
                ].map((fila) => (
                  <div
                    key={fila.label}
                    className="grid gap-1 border-b border-marfil/15 py-5 sm:grid-cols-[10rem_1fr] sm:items-baseline sm:gap-6"
                  >
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-marfil/50">
                      {fila.label}
                    </p>
                    <p className="font-heading text-lg text-marfil/90">{fila.valor}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>
    </main>
  );
}

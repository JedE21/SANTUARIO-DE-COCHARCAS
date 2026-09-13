import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Container, Section, Link as PublicLink } from '@/components/public';
import { PageHero } from '@/components/public/page-hero';
import { SectionSlider } from '@/components/public/section-slider';
import { FadeIn, Reveal } from '@/components/motion';
import { MassSchedule } from '@/components/shared/mass-schedule';
import { getMassSchedules, getSiteSettings, getSlidesBySection } from '@/lib/queries';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Planifica tu visita',
  description:
    'Ubicación, cómo llegar y qué visitar en el Santuario de Nuestra Señora de Cocharcas, Chincheros, Apurímac.',
  path: '/visita',
});

const recomendaciones = [
  {
    titulo: 'Cómo llegar',
    detalle:
      'Cocharcas se ubica en la provincia de Chincheros, Apurímac. Se llega por vía terrestre desde Andahuaylas o Chincheros; consulta rutas actuales antes de partir.',
  },
  {
    titulo: 'Qué llevar',
    detalle:
      'Abrigo para las noches andinas, calzado cómodo para caminar y disposición para el encuentro con la comunidad.',
  },
  {
    titulo: 'Respeto al templo',
    detalle:
      'El santuario es casa de oración: conserva silencio dentro del templo y sigue las indicaciones de la pastoral durante las celebraciones.',
  },
];

export default async function VisitaPage() {
  const [settings, schedules, slides] = await Promise.all([getSiteSettings(), getMassSchedules(), getSlidesBySection('visita')]);

  // Coordenadas del Santuario (Google Maps, placemark oficial):
  // https://maps.app.goo.gl/G2mivnwKcj87NP1r9
  const SANCTUARY_LAT = '-13.6100237';
  const SANCTUARY_LNG = '-73.7400976';
  const lat = settings.latitude || SANCTUARY_LAT;
  const lng = settings.longitude || SANCTUARY_LNG;
  const mapSrc = `https://maps.google.com/maps?q=${lat}%2C${lng}&z=16&hl=es&output=embed`;

  const filas = [
    { label: 'Dirección', valor: settings.address || 'Cocharcas, Chincheros, Apurímac, Perú' },
    ...(settings.phone ? [{ label: 'Teléfono', valor: settings.phone }] : []),
    ...(settings.email ? [{ label: 'Correo', valor: settings.email }] : []),
  ];

  return (
    <main>
      {/* Carrusel de fotografías de la sección: protagonista en lugar de la banda marrón */}
      {slides.length > 0 ? (
        <SectionSlider slides={slides} label="Planifica tu visita" priority fullScreen />
      ) : (
        <PageHero
          eyebrow="Visita"
          title="Ven a Cocharcas"
          description="Información esencial para peregrinos y visitantes del santuario."
        />
      )}
      <h1 className="sr-only">Planifica tu visita al Santuario de Cocharcas</h1>

      <Section className="bg-marfil">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <FadeIn className="lg:col-span-5">
              <p className="eyebrow text-tierra">Ubicación</p>
              <h2 className="display-section mt-5 text-marron">Un pueblo que recibe al peregrino</h2>
              <div className="mt-8 border-t border-tierra/20">
                {filas.map((fila) => (
                  <div
                    key={fila.label}
                    className="grid gap-1 border-b border-tierra/20 py-4 sm:grid-cols-[8rem_1fr] sm:items-baseline sm:gap-6"
                  >
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-tierra">
                      {fila.label}
                    </p>
                    <p className="font-heading text-lg text-marron">{fila.valor}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
                Coordenadas de referencia · Cocharcas, Chincheros, Apurímac
              </p>
            </FadeIn>

            {/* Mapa contenido, integrado con elegancia */}
            <FadeIn delay={0.1} className="lg:col-span-7">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -left-4 -top-4 hidden h-full w-full border border-tierra/25 lg:block"
                />
                <div className="relative aspect-[16/11] overflow-hidden bg-piedra/40">
                  <iframe
                    src={mapSrc}
                    title="Mapa de ubicación del Santuario de Cocharcas — Google Maps"
                    className="h-full w-full border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <p className="mt-4 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-tierra">
                  Google Maps · Cocharcas, Apurímac
                </p>
              </div>
            </FadeIn>
          </div>
        </Container>
      </Section>

      <Section className="bg-blanco">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <FadeIn className="lg:col-span-5">
              <p className="eyebrow text-tierra">Horarios</p>
              <h2 className="display-section mt-5 text-marron">Celebraciones en el templo</h2>
              <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
                Horarios administrados por la coordinación pastoral del santuario.
              </p>
              <div className="mt-10">
                <MassSchedule items={schedules} title="" />
              </div>
            </FadeIn>

            <div className="lg:col-span-7">
              <FadeIn>
                <p className="eyebrow text-tierra">Recomendaciones</p>
                <h2 className="display-section mt-5 text-marron">Antes de partir</h2>
              </FadeIn>
              <div className="mt-10 border-t border-tierra/20">
                {recomendaciones.map((rec, i) => (
                  <Reveal key={rec.titulo} delay={i * 0.07}>
                    <div className="grid gap-2 border-b border-tierra/20 py-7 sm:grid-cols-[10rem_1fr] sm:gap-8">
                      <h3 className="font-heading text-xl font-medium text-marron">{rec.titulo}</h3>
                      <p className="leading-relaxed text-muted-foreground">{rec.detalle}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-marron text-marfil">
        <Container className="text-center">
          <FadeIn>
            <p className="eyebrow text-dorado-claro">Pastoral</p>
            <h2 className="display-section mx-auto mt-5 max-w-2xl text-marfil">
              ¿Necesitas orientación antes de tu visita?
            </h2>
            <div className="mt-10 flex flex-wrap justify-center gap-10">
              <PublicLink
                href="/solicitudes"
                className="group inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-dorado-claro transition-colors duration-300 hover:text-blanco"
              >
                <span className="border-b border-dorado-claro/40 pb-1.5 transition-colors duration-300 group-hover:border-blanco/60">
                  Solicitudes pastorales
                </span>
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </PublicLink>
              <PublicLink
                href="/contacto"
                className="group inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-marfil/80 transition-colors duration-300 hover:text-blanco"
              >
                <span className="border-b border-marfil/30 pb-1.5 transition-colors duration-300 group-hover:border-blanco/60">
                  Escríbenos
                </span>
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </PublicLink>
            </div>
          </FadeIn>
        </Container>
      </Section>
    </main>
  );
}

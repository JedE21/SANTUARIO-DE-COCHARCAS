import * as React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { PageHeader } from '@/components/shared/page-header';
import { HistoricalTimeline } from '@/components/shared/historical-timeline';
import { MassSchedule } from '@/components/shared/mass-schedule';
import { Section, Container, SectionHeading, Button, Card, Image, Link } from '@/components/public';
import { FadeIn } from '@/components/motion';
import { pageMetadata } from '@/lib/seo';

// Types for data (we'll fetch from Supabase later, but for now we'll use placeholder or empty)
type SiteSettings = {
  site_name: string;
  site_description: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  latitude: string;
  longitude: string;
  logo_url: string | null;
  favicon_url: string | null;
  responsible_name: string;
  responsible_title: string;
  responsible_bio: string;
  responsible_photo_url: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  footer_text: string;
};

type MassScheduleItem = {
  day_of_week: string;
  time: string;
  place?: string;
  description?: string;
};

// Fetch site settings (we'll reuse the same logic as in Home, but for simplicity we'll just use fallback)
async function fetchSiteSettings(): Promise<SiteSettings | null> {
  // In a real implementation, we would fetch from Supabase
  // For now, we'll return null to use fallback
  return null;
}

// Fetch mass schedules (placeholder)
async function fetchMassSchedules(): Promise<MassScheduleItem[]> {
  // In a real implementation, we would fetch from mass_schedules table where active = true
  // For now, we'll return empty array to show empty state
  return [];
}

export const metadata: Metadata = pageMetadata({
  title: 'El Santuario',
  description: 'Descubre la historia, arquitectura y patrimonio del Santuario de Nuestra Señora de Cocharcas.',
  path: '/santuario',
});

export default async function SantuarioPage() {
  const [settingsData, massSchedulesData] = await Promise.all([
    fetchSiteSettings(),
    fetchMassSchedules(),
  ]);

  const settings = settingsData ?? {
    site_name: 'Santuario de Nuestra Señora de Cocharcas',
    site_description: 'Santuario de Nuestra Señora de Cocharcas - Cocharcas, Chincheros, Apurímac, Perú',
    address: 'Cocharcas, Chincheros, Apurímac, Perú',
    phone: '+51 XXX XXX XXX',
    whatsapp: '+51 XXX XXX XXX',
    email: 'info@santuariococharcas.pe',
    latitude: '',
    longitude: '',
    logo_url: null,
    favicon_url: null,
    responsible_name: 'Pbro. Alfredo Prado',
    responsible_title: 'Responsable Parroquial',
    responsible_bio: 'Información sobre el responsable',
    responsible_photo_url: null,
    facebook_url: null,
    twitter_url: null,
    instagram_url: null,
    youtube_url: null,
    footer_text: ''
  };

  // Historical timeline data (placeholder - in reality this would come from a CMS or Supabase)
  const historicalTimelineData = [
    {
      year: '1598',
      title: 'Llegada de la imagen de la Virgen de Cocharcas',
      description: 'Según la tradición, el indígena Francisco Tito Yupanqui trajo una réplica de la Virgen de Copacabana a estas tierras después de un arduo viaje a pie.',
    },
    {
      year: '1600',
      title: 'Construcción de la primera capilla',
      description: 'Los fieles construyeron una primera capilla de adobe y paja para venerar la imagen traída.',
    }
    // We would add more items, but we'll keep it short for now
  ];

  return (
    <main>
      <section className="pb-20">
        <Container>
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'El Santuario', href: '/santuario', isActive: true }
            ]}
          />

          {/* Page Header */}
          <PageHeader
            title="El Santuario"
            description="Un lugar de fe, historia y tradición en el corazón de los Andes."
            eyebrow="EL SANTUARIO"
          />

          {/* Main content */}
          <div className="space-y-12">
            {/* Introduction */}
            <FadeIn delay={0} duration={0.5}>
              <Section className="bg-marfil">
                <Container>
                  <SectionHeading
                    title="Sobre el Santuario"
                    description="Un centro de devoción mariana que atrae a peregrinos de todo el país."
                  />
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="relative h-96 w-full overflow-hidden rounded-lg">
                      <Image
                        src="/images/cocharcas-hero.svg"
                        alt="Vista exterior del Santuario de Cocharcas"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        priority
                      />
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        El Santuario de Nuestra Señora de Cocharcas es un importante centro de fe y tradición
                        ubicado en el distrito de Cocharcas, provincia de Chincheros, región Apurímac.
                        Este templo representa un valioso patrimonio religioso y cultural de la región andina.
                      </p>
                      <p className="text-muted-foreground mt-4">
                        Aquí se venera la imagen de la Virgen de Cocharcas, réplica de la Virgen de Copacabana,
                        que ha sido objeto de devoción desde finales del siglo XVI.
                      </p>
                      <Link
                        href="/santuario/historia"
                        className="mt-6 inline-flex items-center rounded-md bg-dorado-oscuro px-4 py-2 text-sm font-medium text-blanco transition-normal hover:bg-dorado-oscuro/90"
                      >
                        Conocer nuestra historia
                        <span className="ml-2" aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </Container>
              </Section>
            </FadeIn>

            {/* Historical Timeline */}
            <FadeIn delay={0.2} duration={0.5}>
              <Section>
                <Container>
                  <SectionHeading
                    title="Historia del Santuario"
                    description="Un legado que perdura a través de los siglos."
                  />
                  <HistoricalTimeline items={historicalTimelineData} />
                </Container>
              </Section>
            </FadeIn>

            {/* Mass Schedules */}
            <FadeIn delay={0.4} duration={0.5}>
              <Section className="bg-marfil">
                <Container>
                  <SectionHeading
                    title="Horarios de Celebración"
                    description="Los horarios de misa y servicios religiosos."
                  />
                  <MassSchedule items={massSchedulesData} />
                </Container>
              </Section>
            </FadeIn>

            {/* Our Lady */}
            <FadeIn delay={0.6} duration={0.5}>
              <Section>
                <Container>
                  <SectionHeading
                    title="Nuestra Señora de Cocharcas"
                    description="La Virgen que protege y guía a su pueblo."
                  />
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="relative h-96 w-full overflow-hidden rounded-lg">
                      <Image
                        src="/images/cocharcas-avatar.svg"
                        alt="Imagen de Nuestra Señora de Cocharcas"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        La imagen de Nuestra Señora de Cocharcas es una réplica exacta de la Virgen de Copacabana,
                        traída a estas tierras en el año 1598. Desde entonces, ha sido centro de innumerables
                        milagros y gracias concedidas a sus devotos.
                      </p>
                      <p className="text-muted-foreground mt-4">
                        Cada año, miles de fieles llegan al santuario para participar en las
                        festividades en honor a la Virgen, especialmente durante el mes de septiembre.
                      </p>
                      <Link
                        href="/santuario/nuestra-senora"
                        className="mt-6 inline-flex items-center rounded-md bg-dorado-oscuro px-4 py-2 text-sm font-medium text-blanco transition-normal hover:bg-dorado-oscuro/90"
                      >
                        Conocer más
                        <span className="ml-2" aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </Container>
              </Section>
            </FadeIn>

            {/* Architecture and Heritage */}
            <FadeIn delay={0.8} duration={0.5}>
              <Section className="bg-marfil">
                <Container>
                  <SectionHeading
                    title="Arquitectura y Patrimonio"
                    description="Un tesoro arquitectónico que combina estilos coloniales y andinos."
                  />
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Architecture: Image + Text */}
                    <div className="relative h-96 w-full overflow-hidden rounded-lg">
                      <Image
                        src="/images/cocharcas-hero.svg"
                        alt="Detalles arquitectónicos del Santuario"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        La arquitectura del santuario presenta una fusión de estilos coloniales barrocos
                        con influencias andinas autóctonas. Su fachada de piedra tallada, los retablos
                        dorados y los techos de madera trabajada reflejan siglos de devoción y arte.
                      </p>
                      <p className="text-muted-foreground mt-4">
                        Entre sus elementos más destacados se encuentran el altar mayor, los laterales
                        sacristía y el coro, cada uno con su propia riqueza artística e histórica.
                      </p>
                      <Link
                        href="/santuario/arquitectura"
                        className="mt-6 inline-flex items-center rounded-md bg-dorado-oscuro px-4 py-2 text-sm font-medium text-blanco transition-normal hover:bg-dorado-oscuro/90"
                      >
                        Explorar la arquitectura
                        <span className="ml-2" aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>

                  <div className="mt-8">
                    {/* Heritage: Text + Image */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-muted-foreground">
                          El santuario posee un rico patrimonio histórico y artístico que incluye
                          documentos del siglo XVII, pinturas religiosas, orfebrería litúrgica y
                          una biblioteca eclesiástica de gran valor para investigadores.
                        </p>
                        <p className="text-muted-foreground mt-4">
                          Estos tesoros no solo tienen valor religioso, sino también histórico y cultural,
                          pues testimonían la vida de la comunidad cocharquina a lo largo de los siglos.
                        </p>
                        <Link
                          href="/santuario/patrimonio"
                          className="mt-6 inline-flex items-center rounded-md bg-dorado-oscuro px-4 py-2 text-sm font-medium text-blanco transition-normal hover:bg-dorado-oscuro/90"
                        >
                          Descubrir el patrimonio
                          <span className="ml-2" aria-hidden="true">→</span>
                        </Link>
                      </div>
                      <div className="relative h-96 w-full overflow-hidden rounded-lg">
                        <Image
                          src="/images/cocharcas-gallery.svg"
                          alt="Elementos patrimoniales del Santuario"
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </Container>
              </Section>
            </FadeIn>

            {/* Call to Action */}
            <FadeIn delay={1.0} duration={0.5}>
              <Section className="bg-dorado-oscuro">
                <Container className="text-center py-12">
                  <h2 className="text-3xl font-bold text-blanco mb-4">
                    Ven a visitar el Santuario
                  </h2>
                  <p className="text-xl text-blanco/90 mb-6 max-w-2xl mx-auto">
                    Descubre la fe, historia y tradición que han mantenido vivo este santuario
                    por más de cuatro siglos.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                      href="/visita"
                      className="flex items-center rounded-md bg-blanco px-6 py-3 text-sm font-medium text-dorado-oscuro transition-normal hover:bg-marfil"
                    >
                      Planifica tu visita
                      <span className="ml-2" aria-hidden="true">→</span>
                    </Link>
                    <Link
                      href="/fe/solicitar-misa"
                      className="flex items-center rounded-md border border-blanco bg-transparent px-6 py-3 text-sm font-medium text-blanco transition-normal hover:bg-blanco/10"
                    >
                      Solicitar una misa
                      <span className="ml-2" aria-hidden="true">→</span>
                    </Link>
                  </div>
                </Container>
              </Section>
            </FadeIn>
          </div>
        </Container>
      </section>
    </main>
  );
}

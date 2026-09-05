import * as React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { Section, Container, SectionHeading, Link } from '@/components/public';
import { FadeIn } from '@/components/motion';
import { pageMetadata } from '@/lib/seo';

// Types
type ArchiveInfo = {
  title: string;
  description: string;
  historicalPeriod: string;
  documentTypes: string[];
  content: string;
  preservation: string;
  accessInfo: string;
  imageUrl: string | null;
  imageAlt: string;
};

export const metadata: Metadata = pageMetadata({
  title: 'Archivo histórico',
  description: 'Conoce el archivo histórico del Santuario de Nuestra Señora de Cocharcas.',
  path: '/santuario/archivo-historico',
});

export default async function ArchivoHistoricoPage() {
  return (
    <main>
      <section className="pb-20">
        <Container>
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'El Santuario', href: '/santuario' },
              { label: 'Archivo Histórico', href: '/santuario/archivo-historico', isActive: true }
            ]}
          />

          {/* Page Header - Contemplative style */}
          <section className="relative">
            <div className="absolute inset-0">
              <div className="bg-gradient-to-b from-black/30 to-black/50"></div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[50vh] px-4 sm:px-6 lg:px-8">
              <FadeIn delay={0} duration={0.5}>
                <p className="text-xs font-medium text-dorado-claro tracking-wider mb-2">
                  ARCHIVO HISTÓRICO
                </p>
              </FadeIn>

              <FadeIn delay={0.2} duration={0.5}>
                <h1 className="text-4xl font-bold text-blanco sm:text-5xl mb-2 leading-tight">
                  Archivo Histórico
                </h1>
              </FadeIn>

              <FadeIn delay={0.4} duration={0.5}>
                <p className="text-xl text-blanco/90 max-w-2xl mb-6 sm:text-2xl">
                  Documentos que preservan nuestra memoria histórica
                </p>
              </FadeIn>
            </div>
          </section>

          {/* Main content */}
          <div className="space-y-12">
            {/* Introduction */}
            <FadeIn delay={0} duration={0.5}>
              <Section>
                <Container>
                  <SectionHeading
                    title="Sobre el Archivo Histórico"
                    description="Un tesoro documental que atraviesa los siglos"
                  />
                  <p className="text-muted-foreground">
                    El archivo histórico del Santuario de Nuestra Señora de Cocharcas constituye un valioso
                    patrimonio documental que preserva la memoria escrita de la comunidad desde sus
                    inicios. Los documentos que allí se conservan permiten reconstruir aspectos
                    importantes de la historia religiosa, social, económica y cultural de la región.
                  </p>
                  <p className="text-muted-foreground mt-4">
                    Entre sus fondos se encuentran registros parroquiales, correspondencia eclesiástica,
                    documentos legales y administrativos, libros de cuentas y otros materiales que
                    datan desde el siglo XVII en adelante.
                  </p>
                </Container>
              </Section>
            </FadeIn>

            {/* Historical Period */}
            <FadeIn delay={0.2} duration={0.5}>
              <Section className="bg-marfil">
                <Container>
                  <SectionHeading
                    title="Periodo Histórico Abarcado"
                    description="Desde los inicios hasta la actualidad"
                  />
                  <p className="text-muted-foreground">
                    El archivo abarca aproximadamente desde el año 1600 hasta la actualidad, con una
                    concentración significativa de documentos durante los siglos XVII, XVIII y XIX.
                    Estos documentos reflejan no solo la vida interna del santuario, sino también
                    su interacción con la comunidad circundante y las autoridades civiles y eclesiásticas.
                  </p>
                </Container>
              </Section>
            </FadeIn>

            {/* Document Types */}
            <FadeIn delay={0.4} duration={0.5}>
              <Section>
                <Container>
                  <SectionHeading
                    title="Tipos de Documentos"
                    description="Variedad de fuentes históricas disponibles"
                  />
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Documentos eclesiásticos:</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        <li>Libros de bautismos (desde 1600)</li>
                        <li>Libros de matrimonios (desde 1600)</li>
                        <li>Libros de defunciones (desde 1600)</li>
                        <li>Libros de confirmaciones</li>
                        <li>Actas de visitas pastorales</li>
                        <li>Documentos sacramentales diversos</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Documentos administrativos:</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        <li>Libros de cuentas y gastos</li>
                        <li>Documentos de propiedad y tierras</li>
                        <li>Correspondencia con autoridades</li>
                        <li>Actas de cabildo eclesial</li>
                        <li>Documentos relacionados con obras y construcciones</li>
                      </ul>
                    </div>
                  </div>
                </Container>
              </Section>
            </FadeIn>

            {/* Content and Value */}
            <FadeIn delay={0.6} duration={0.5}>
              <Section className="bg-marfil">
                <Container>
                  <SectionHeading
                    title="Contenido y Valor Histórico"
                    description="Qué información podemos encontrar"
                  />
                  <p className="text-muted-foreground">
                    Los documentos del archivo históricamente valioso permiten:
                  </p>
                  <div className="mt-6">
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                      <li>Establecer linajes familiares de la comunidad cocharquina</li>
                      <li>Reconstruir la historia económica local y regional</li>
                      <li>Estudiar prácticas religiosas y devocionales a través del tiempo</li>
                      <li>Analizar la evolución de la arquitectura y las obras del santuario</li>
                      <li>Comprender las relaciones entre el santuario y las autoridades civiles</li>
                      <li>Investigar fenómenos sociales como epidemias, cosechas y migraciones</li>
                    </ul>
                  </div>
                </Container>
              </Section>
            </FadeIn>

            {/* Preservation and Access */}
            <FadeIn delay={0.8} duration={0.5}>
              <Section>
                <Container>
                  <SectionHeading
                    title="Preservación y Acceso"
                    description="Cómo se conserva y quién puede consultarlo"
                  />
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Preservación:</h3>
                      <p className="text-muted-foreground">
                        Actualmente, el archivo se encuentra en proceso de organización,
                        clasificación y digitalización para su mejor conservación y
                        accesibilidad. Se están utilizando estándares archivísticos
                        internacionales para garantizar su preservación a largo plazo.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Acceso:</h3>
                      <p className="text-muted-foreground">
                        El acceso al archivo está regulado para garantizar su preservación.
                        Investigadores, estudiosos y miembros de la comunidad interesados
                        pueden solicitar acceso mediante coordinación previa con las
                        autoridades eclesiásticas del santuario.
                      </p>
                      <p className="text-muted-foreground mt-4">
                        Para consultas sobre acceso al archivo histórico, por favor
                        comuníquese con la oficina parroquial durante el horario de
                        atención.
                      </p>
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
                    Ven a explorar nuestra historia
                  </h2>
                  <p className="text-xl text-blanco/90 mb-6 max-w-2xl mx-auto">
                    Descubre los documentos que han registrado la vida de esta comunidad
                    de fe durante más de cuatro siglos.
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

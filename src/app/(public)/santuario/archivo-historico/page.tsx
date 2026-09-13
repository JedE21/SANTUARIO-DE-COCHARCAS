import * as React from 'react';
import type { Metadata } from 'next';
import { PageHero } from '@/components/public/page-hero';
import { Section, Container } from '@/components/public';
import { FadeIn, Reveal } from '@/components/motion';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Archivo histórico',
  description: 'Conoce el archivo histórico del Santuario de Nuestra Señora de Cocharcas.',
  path: '/santuario/archivo-historico',
});

const documentosEclesiasticos = [
  'Libros de bautismos (desde 1600)',
  'Libros de matrimonios (desde 1600)',
  'Libros de defunciones (desde 1600)',
  'Libros de confirmaciones',
  'Actas de visitas pastorales',
  'Documentos sacramentales diversos',
];

const documentosAdministrativos = [
  'Libros de cuentas y gastos',
  'Documentos de propiedad y tierras',
  'Correspondencia con autoridades',
  'Actas de cabildo eclesial',
  'Documentos relacionados con obras y construcciones',
];

const valoresDelArchivo = [
  'Establecer linajes familiares de la comunidad cocharquina',
  'Reconstruir la historia económica local y regional',
  'Estudiar prácticas religiosas y devocionales a través del tiempo',
  'Analizar la evolución de la arquitectura y las obras del santuario',
  'Comprender las relaciones entre el santuario y las autoridades civiles',
  'Investigar fenómenos sociales como epidemias, cosechas y migraciones',
];

export default async function ArchivoHistoricoPage() {
  return (
    <main>
      <PageHero
        eyebrow="Archivo histórico"
        title="La memoria escrita del santuario"
        description="Documentos que preservan la memoria histórica desde el siglo XVII."
      />

      {/* Introducción + periodo */}
      <Section className="bg-marfil">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <FadeIn className="lg:col-span-6">
              <p className="eyebrow text-tierra">Sobre el archivo</p>
              <h2 className="display-section mt-5 text-marron">Un tesoro documental</h2>
              <div className="mt-7 space-y-5 leading-relaxed text-muted-foreground">
                <p>
                  El archivo histórico del Santuario de Nuestra Señora de Cocharcas constituye un valioso
                  patrimonio documental que preserva la memoria escrita de la comunidad desde sus
                  inicios. Los documentos que allí se conservan permiten reconstruir aspectos
                  importantes de la historia religiosa, social, económica y cultural de la región.
                </p>
                <p>
                  Entre sus fondos se encuentran registros parroquiales, correspondencia eclesiástica,
                  documentos legales y administrativos, libros de cuentas y otros materiales que
                  datan desde el siglo XVII en adelante.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.08} className="lg:col-span-6">
              <p className="eyebrow text-tierra">Periodo histórico</p>
              <h2 className="display-section mt-5 text-marron">De 1600 a la actualidad</h2>
              <p className="mt-7 leading-relaxed text-muted-foreground">
                El archivo abarca aproximadamente desde el año 1600 hasta la actualidad, con una
                concentración significativa de documentos durante los siglos XVII, XVIII y XIX.
                Estos documentos reflejan no solo la vida interna del santuario, sino también
                su interacción con la comunidad circundante y las autoridades civiles y eclesiásticas.
              </p>
            </FadeIn>
          </div>
        </Container>
      </Section>

      {/* Tipos de documentos */}
      <Section className="bg-blanco">
        <Container>
          <FadeIn>
            <p className="eyebrow text-tierra">Tipos de documentos</p>
            <h2 className="display-section mt-5 text-marron">Variedad de fuentes históricas</h2>
          </FadeIn>
          <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-20">
            <FadeIn delay={0.05}>
              <h3 className="font-heading text-xl font-medium text-marron">
                Documentos eclesiásticos
              </h3>
              <ul className="mt-5 border-t border-tierra/20">
                {documentosEclesiasticos.map((doc) => (
                  <li key={doc} className="border-b border-tierra/20 py-3 text-sm text-muted-foreground">
                    {doc}
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn delay={0.12}>
              <h3 className="font-heading text-xl font-medium text-marron">
                Documentos administrativos
              </h3>
              <ul className="mt-5 border-t border-tierra/20">
                {documentosAdministrativos.map((doc) => (
                  <li key={doc} className="border-b border-tierra/20 py-3 text-sm text-muted-foreground">
                    {doc}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </Container>
      </Section>

      {/* Valor + preservación */}
      <Section className="bg-marfil">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <FadeIn className="lg:col-span-6">
              <p className="eyebrow text-tierra">Contenido y valor</p>
              <h2 className="display-section mt-5 text-marron">Qué permite investigar</h2>
              <ul className="mt-7 border-t border-tierra/20">
                {valoresDelArchivo.map((valor, i) => (
                  <Reveal key={valor} delay={Math.min(i * 0.05, 0.25)}>
                    <li className="border-b border-tierra/20 py-3 text-sm leading-relaxed text-muted-foreground">
                      {valor}
                    </li>
                  </Reveal>
                ))}
              </ul>
            </FadeIn>
            <div className="lg:col-span-6">
              <FadeIn delay={0.08}>
                <p className="eyebrow text-tierra">Preservación</p>
                <h2 className="display-section mt-5 text-marron">Conservación y acceso</h2>
                <div className="mt-7 space-y-5 leading-relaxed text-muted-foreground">
                  <p>
                    Actualmente, el archivo se encuentra en proceso de organización,
                    clasificación y digitalización para su mejor conservación y
                    accesibilidad. Se están utilizando estándares archivísticos
                    internacionales para garantizar su preservación a largo plazo.
                  </p>
                  <p>
                    El acceso al archivo está regulado para garantizar su preservación.
                    Investigadores, estudiosos y miembros de la comunidad interesados
                    pueden solicitar acceso mediante coordinación previa con las
                    autoridades eclesiásticas del santuario.
                  </p>
                  <p>
                    Para consultas sobre acceso al archivo histórico, por favor
                    comuníquese con la oficina parroquial durante el horario de
                    atención.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

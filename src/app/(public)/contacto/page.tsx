import type { Metadata } from 'next';
import { Container, Section } from '@/components/public';
import { PageHero } from '@/components/public/page-hero';
import { SectionSlider } from '@/components/public/section-slider';
import { FadeIn, Reveal } from '@/components/motion';
import { ContactForm } from '@/components/forms/ContactForm';
import { getSiteSettings, getFaqs, getSlidesBySection } from '@/lib/queries';
import { pageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMetadata({
  title: 'Contacto',
  description: 'Contacta con el Santuario de Nuestra Señora de Cocharcas: dirección, teléfono, correo y preguntas frecuentes.',
  path: '/contacto',
});

export default async function ContactoPage() {
  const [settings, faqs, slides] = await Promise.all([getSiteSettings(), getFaqs(), getSlidesBySection('contacto')]);

  const datos = [
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
  ];

  return (
    <main>
      {/* Carrusel de fotografías de la sección: protagonista en lugar de la banda marrón */}
      {slides.length > 0 ? (
        <SectionSlider slides={slides} label="Contacto" priority fullScreen />
      ) : (
        <PageHero
          eyebrow="Contacto"
          title="Escríbenos"
          description="Estamos para orientarte en tu visita y en tus solicitudes pastorales."
        />
      )}
      <h1 className="sr-only">Escríbenos: contacto del Santuario de Cocharcas</h1>

      <Section className="bg-marfil">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            {/* Formulario */}
            <FadeIn className="lg:col-span-7">
              <p className="eyebrow text-tierra">Mensaje</p>
              <h2 className="display-section mt-5 text-marron">Envíanos tu consulta</h2>
              <div className="mt-10">
                <ContactForm />
              </div>
            </FadeIn>

            {/* Datos institucionales */}
            <div className="lg:col-span-5">
              <FadeIn delay={0.08}>
                <p className="eyebrow text-tierra">El Santuario</p>
                <h2 className="display-section mt-5 text-marron">Información</h2>
                <div className="mt-8 border-t border-tierra/20">
                  {datos.map((fila) => (
                    <div
                      key={fila.label}
                      className="grid gap-1 border-b border-tierra/20 py-4 sm:grid-cols-[10rem_1fr] sm:items-baseline sm:gap-6"
                    >
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-tierra">
                        {fila.label}
                      </p>
                      <p className="font-heading text-lg text-marron">{fila.valor}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {faqs.length > 0 ? (
                <FadeIn delay={0.16} className="mt-16">
                  <p className="eyebrow text-tierra">Preguntas frecuentes</p>
                  <div className="mt-6 border-t border-tierra/20">
                    {faqs.slice(0, 4).map((faq, i) => (
                      <Reveal key={faq.id} delay={i * 0.06}>
                        <div className="border-b border-tierra/20 py-5">
                          <h3 className="font-heading text-lg font-medium text-marron">{faq.question}</h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </FadeIn>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

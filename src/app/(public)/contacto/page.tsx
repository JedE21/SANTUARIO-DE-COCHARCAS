import type { Metadata } from 'next';
import { Container, Section, Card } from '@/components/public';
import { PageHero } from '@/components/public/page-hero';
import { Reveal } from '@/components/motion';
import { ContactForm } from '@/components/forms/ContactForm';
import { getSiteSettings, getFaqs } from '@/lib/queries';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contacto',
  description: 'Contacta con el Santuario de Nuestra Señora de Cocharcas: dirección, teléfono, correo y preguntas frecuentes.',
  path: '/contacto',
});

export default async function ContactoPage() {
  const [settings, faqs] = await Promise.all([getSiteSettings(), getFaqs()]);
  return (
    <main>
      <PageHero
        eyebrow="Contacto"
        title="Escríbenos"
        description="Estamos para orientarte en tu visita y en tus solicitudes pastorales."
      />

      <Section className="bg-background">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <ContactForm />

            <div className="space-y-6">
              <Card className="p-6 transition-all duration-300 hover:shadow-md">
                <h2 className="font-heading text-xl font-semibold text-azul">Información</h2>
                <div className="linea-dorada mt-3 h-px w-14" aria-hidden="true" />
                <dl className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div><dt className="font-medium text-foreground">Dirección</dt><dd>{settings.address}</dd></div>
                  <div><dt className="font-medium text-foreground">Teléfono</dt><dd>{settings.phone}</dd></div>
                  <div><dt className="font-medium text-foreground">Correo</dt><dd>{settings.email}</dd></div>
                </dl>
              </Card>

              {faqs.length > 0 && (
                <Card className="p-6 transition-all duration-300 hover:shadow-md">
                  <h2 className="font-heading text-xl font-semibold text-azul">Preguntas frecuentes</h2>
                  <div className="linea-dorada mt-3 h-px w-14" aria-hidden="true" />
                  <div className="mt-4 space-y-4">
                    {faqs.slice(0, 4).map((faq) => (
                      <div key={faq.id}>
                        <h3 className="text-sm font-semibold text-foreground">{faq.question}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

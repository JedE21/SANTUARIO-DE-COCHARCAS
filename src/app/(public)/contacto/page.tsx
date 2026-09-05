import type { Metadata } from 'next';
import { Container, Section, Badge, Card } from '@/components/public';
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
      <Section className="bg-marfil">
        <Container className="py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Contacto</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl">Escríbenos</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Estamos para orientarte en tu visita y en tus solicitudes pastorales.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <ContactForm />

            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold">Información</h2>
                <dl className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div><dt className="font-medium text-foreground">Dirección</dt><dd>{settings.address}</dd></div>
                  <div><dt className="font-medium text-foreground">Teléfono</dt><dd>{settings.phone}</dd></div>
                  <div><dt className="font-medium text-foreground">Correo</dt><dd>{settings.email}</dd></div>
                </dl>
              </Card>

              {faqs.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold">Preguntas frecuentes</h2>
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

import Link from 'next/link';
import { Container } from '@/components/public';
import { FadeIn } from '@/components/motion';

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center bg-marfil">
      <Container className="py-20 text-center">
        <FadeIn>
          <p className="text-xs font-medium uppercase tracking-wider text-primary">Error 404</p>
          <h1 className="mt-4 font-heading text-5xl font-bold text-foreground">Página no encontrada</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            La página que buscas no existe o fue movida. Puedes volver al inicio o explorar el Santuario.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-normal hover:bg-primary/90"
            >
              Volver al inicio
            </Link>
            <Link
              href="/visita"
              className="inline-flex items-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium text-foreground transition-normal hover:bg-accent/10"
            >
              Planifica tu visita
            </Link>
          </div>
        </FadeIn>
      </Container>
    </main>
  );
}

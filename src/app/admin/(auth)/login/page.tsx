import type { Metadata } from 'next';
import Image from 'next/image';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  title: 'Iniciar Sesión - Administración',
};

/**
 * Login del panel: layout dividido en escritorio (imagen del santuario /
 * formulario) y formulario primero en móvil. La autenticación no cambia.
 */
export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col bg-negro lg:grid lg:grid-cols-2">
      {/* Formulario (primero en móvil, derecha en escritorio) */}
      <div className="order-2 flex items-center justify-center px-5 py-12 sm:px-8 lg:order-1">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>

      {/* Imagen del santuario (solo escritorio): presencia sobria, no distrae */}
      <div className="relative order-1 hidden overflow-hidden lg:order-2 lg:block">
        <Image
          src="/images/santuario/santuario-exterior.jpg"
          alt="Santuario de Nuestra Señora de Cocharcas entre los cerros de Apurímac"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(115deg, rgba(23,22,21,0.92) 0%, rgba(23,22,21,0.55) 45%, rgba(23,22,21,0.25) 100%)',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-10">
          <p className="font-heading text-xl text-blanco/90">
            Santuario de Nuestra Señora de Cocharcas
          </p>
          <p className="mt-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-dorado-claro/80">
            Cocharcas · Chincheros · Apurímac
          </p>
        </div>
      </div>
    </main>
  );
}

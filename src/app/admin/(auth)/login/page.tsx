import type { Metadata } from 'next';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  title: 'Iniciar Sesión - Administración',
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-marfil">
      <LoginForm />
    </main>
  );
}

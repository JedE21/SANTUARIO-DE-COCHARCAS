import { AdminShell } from '@/components/admin/AdminShell';
import { requireAdminPage } from '@/lib/security/guards';

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  // Defensa en profundidad: ademas del middleware, el layout del panel
  // re-verifica la sesion firmada antes de renderizar cualquier contenido.
  const session = await requireAdminPage();

  return (
    <AdminShell email={session.email} role={session.role}>
      {children}
    </AdminShell>
  );
}

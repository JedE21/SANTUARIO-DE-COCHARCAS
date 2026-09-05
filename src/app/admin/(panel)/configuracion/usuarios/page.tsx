import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { UsersManager } from '@/components/admin/UsersManager';
import { getUsersAdmin } from '@/lib/queries-admin';
import { getAdminSession } from '@/lib/security/guards';

export const dynamic = 'force-dynamic';

export default async function AdminUsuariosPage() {
  const [users, session] = await Promise.all([getUsersAdmin(), getAdminSession()]);
  const canManage = session?.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Usuarios del panel"
        description="Cuentas con acceso al panel administrativo, sus roles y estado de actividad."
      />
      <UsersManager users={users} canManage={canManage} />
    </div>
  );
}

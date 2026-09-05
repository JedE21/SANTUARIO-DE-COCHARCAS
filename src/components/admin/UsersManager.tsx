'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminCreateUser, adminSetUserRole, adminSetUserActive, type ActionResult } from '@/lib/actions';
import type { AdminUserRow } from '@/lib/queries-admin';

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super administrador',
  ADMIN_PARROQUIA: 'Administrador parroquial',
  EDITOR: 'Editor de contenido',
  RESPONSABLE_PASTORAL: 'Responsable pastoral',
};

const ROLES = Object.keys(ROLE_LABELS);

export function UsersManager({ users, canManage }: { users: AdminUserRow[]; canManage: boolean }) {
  const [result, setResult] = React.useState<ActionResult | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [busyUser, setBusyUser] = React.useState<string | null>(null);

  async function onCreate(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    setCreating(true);
    setResult(null);
    const res = await adminCreateUser(new FormData(form));
    setResult(res);
    setCreating(false);
    if (res.ok) {
      form.reset();
      window.location.reload();
    }
  }

  async function onRoleChange(userId: string, role: string) {
    setBusyUser(userId);
    const res = await adminSetUserRole(userId, role);
    setBusyUser(null);
    if (!res.ok) setResult(res);
    else window.location.reload();
  }

  async function onToggleActive(userId: string, active: boolean) {
    setBusyUser(userId);
    const res = await adminSetUserActive(userId, active);
    setBusyUser(null);
    if (!res.ok) setResult(res);
    else window.location.reload();
  }

  return (
    <div className="space-y-6">
      {!canManage && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Solo el SUPER_ADMIN puede crear usuarios o cambiar roles. Puedes ver el listado.
        </div>
      )}

      {canManage && (
        <form onSubmit={onCreate} className="space-y-4 rounded-lg border border-piedra/20 bg-blanco p-6 shadow-sm">
          <h3 className="font-semibold text-carbone">Crear usuario del panel</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-carbone">Correo</span>
              <Input name="email" type="email" required placeholder="correo@ejemplo.pe" />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-carbone">Nombre completo</span>
              <Input name="full_name" required placeholder="Nombres y apellidos" />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-carbone">Contraseña temporal</span>
              <Input name="password" type="password" required minLength={8} autoComplete="new-password" />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-carbone">Rol</span>
              <select
                name="role"
                required
                className="w-full rounded-md border border-piedra/30 px-3 py-2 text-sm focus:border-dorado focus:outline-none focus:ring-1 focus:ring-dorado"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={creating}>{creating ? 'Creando…' : 'Crear usuario'}</Button>
            {result?.error && <span className="text-sm text-red-700">{result.error}</span>}
            {result?.ok && !result.error && <span className="text-sm text-green-700">{result.message}</span>}
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg border border-piedra/20 bg-blanco shadow-sm">
        <table className="min-w-full divide-y divide-piedra/10 text-sm">
          <thead className="bg-marfil">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-carbone">Usuario</th>
              <th className="px-4 py-3 text-left font-semibold text-carbone">Rol</th>
              <th className="px-4 py-3 text-left font-semibold text-carbone">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-piedra/10">
            {users.map((u) => (
              <tr key={u.user_id} className="hover:bg-marfil/50">
                <td className="px-4 py-3">
                  <p className="font-medium text-carbone">{u.full_name ?? u.email}</p>
                  <p className="text-xs text-carbone/50">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  {canManage ? (
                    <select
                      value={u.role ?? ''}
                      disabled={busyUser === u.user_id}
                      onChange={(e) => onRoleChange(u.user_id, e.target.value)}
                      className="rounded-md border border-piedra/30 bg-blanco px-2 py-1.5 text-sm focus:border-dorado focus:outline-none"
                    >
                      {!u.role && <option value="">Sin rol</option>}
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-carbone/80">{u.role ? ROLE_LABELS[u.role] ?? u.role : 'Sin rol'}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {canManage ? (
                    <button
                      type="button"
                      disabled={busyUser === u.user_id}
                      onClick={() => onToggleActive(u.user_id, !u.active)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-normal ${
                        u.active
                          ? 'border-green-300 bg-green-50 text-green-800 hover:bg-green-100'
                          : 'border-piedra/30 bg-piedra/10 text-carbone/60 hover:bg-piedra/20'
                      }`}
                    >
                      {u.active ? 'Activa' : 'Inactiva'}
                    </button>
                  ) : (
                    <span className={`text-xs font-semibold ${u.active ? 'text-green-700' : 'text-carbone/50'}`}>
                      {u.active ? 'Activa' : 'Inactiva'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

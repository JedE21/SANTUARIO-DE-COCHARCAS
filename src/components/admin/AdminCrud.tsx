'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { adminGenericSave, adminGenericDelete, type ActionResult } from '@/lib/actions';

interface FieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'url' | 'email' | 'time';
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
}

/**
 * Columnas declarativas (serializables). NUNCA pasar funciones por props:
 * este componente es cliente y vive en la frontera RSC.
 */
interface ColumnConfig<T> {
  key: keyof T | string;
  label: string;
  /** Formato declarativo de la celda: texto plano, booleano o fecha. */
  type?: 'text' | 'boolean' | 'date';
  trueLabel?: string;
  falseLabel?: string;
}

interface AdminCrudProps<T extends { id: string }> {
  table: string;
  rows: T[];
  columns: ColumnConfig<T>[];
  fields: FieldConfig[];
  hiddenFields?: Record<string, string>;
  emptyMessage?: string;
}

/**
 * CRUD completo y reutilizable para cualquier seccion del CMS:
 * lista con Editar/Eliminar por fila + formulario Crear/Actualizar.
 * El control de permisos real esta en las server actions (sesion + rol).
 */
export function AdminCrud<T extends { id: string }>({
  table,
  rows: initialRows,
  columns,
  fields,
  hiddenFields = {},
  emptyMessage = 'No hay registros.',
}: AdminCrudProps<T>) {
  const [rows, setRows] = React.useState(initialRows);
  const [editing, setEditing] = React.useState<T | null>(null);
  const [result, setResult] = React.useState<ActionResult | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => setRows(initialRows), [initialRows]);

  const valueOf = (row: T, key: string): string => {
    const v = (row as Record<string, unknown>)[key];
    if (v === null || v === undefined) return '';
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    if (typeof v === 'object' && v instanceof Date) return v.toISOString().slice(0, 10);
    return String(v);
  };

  /** Celda segun tipo declarativo (sin funciones del servidor). */
  function cellContent(row: T, col: ColumnConfig<T>): React.ReactNode {
    const raw = (row as Record<string, unknown>)[col.key as string];
    if (col.type === 'boolean') {
      return raw ? col.trueLabel ?? 'Sí' : col.falseLabel ?? 'No';
    }
    if (col.type === 'date') {
      if (!raw) return '—';
      const d = new Date(String(raw).length === 10 ? `${String(raw)}T00:00:00` : String(raw));
      return Number.isNaN(d.getTime()) ? String(raw) : d.toLocaleDateString('es-PE');
    }
    return raw === null || raw === undefined || raw === '' ? '—' : String(raw);
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setSaving(true);
    setResult(null);
    const res = await adminGenericSave(new FormData(ev.currentTarget));
    setResult(res);
    setSaving(false);
    if (res.ok) {
      formRef.current?.reset();
      setEditing(null);
      window.location.reload();
    }
  }

  async function onDelete(row: T) {
    const label = valueOf(row, 'name') || valueOf(row, 'title') || valueOf(row, 'label') || row.id;
    if (!window.confirm(`¿Eliminar "${label}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(row.id);
    const fd = new FormData();
    fd.set('_table', table);
    fd.set('id', row.id);
    const res = await adminGenericDelete(fd);
    setDeleting(null);
    if (res.ok) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    }
    setResult(res);
  }

  function startEdit(row: T) {
    setEditing(row);
    setResult(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const normalizeForSelect = (v: string) => v; // selects editables usan el valor crudo

  return (
    <div className="space-y-8">
      {/* ---------------- Tabla ---------------- */}
      {rows.length === 0 ? (
        <div className="rounded-lg border border-piedra/20 bg-blanco p-8 text-center text-sm text-carbone/60">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-piedra/20 bg-blanco shadow-sm">
          <table className="min-w-full divide-y divide-piedra/10 text-sm">
            <thead className="bg-marfil">
              <tr>
                {columns.map((col) => (
                  <th key={String(col.key)} className="px-4 py-3 text-left font-semibold text-carbone">
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-semibold text-carbone">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-piedra/10">
              {rows.map((row) => (
                <tr key={row.id} className={`hover:bg-marfil/50 ${editing?.id === row.id ? 'bg-dorado/10' : ''}`}>
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 text-carbone/80">
                      {cellContent(row, col)}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(row)}
                        className="rounded-md border border-piedra/30 px-2.5 py-1 text-xs text-carbone transition-normal hover:bg-marfil"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(row)}
                        disabled={deleting === row.id}
                        className="rounded-md border border-red-200 px-2.5 py-1 text-xs text-red-700 transition-normal hover:bg-red-50 disabled:opacity-50"
                      >
                        {deleting === row.id ? 'Eliminando…' : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------------- Formulario crear/editar ---------------- */}
      {/* key remonta el formulario al cambiar de registro: los defaultValue se recargan */}
      <form key={editing?.id ?? '__nuevo__'} ref={formRef} onSubmit={onSubmit} className="space-y-4 rounded-lg border border-piedra/20 bg-blanco p-6 shadow-sm">
        <input type="hidden" name="_table" value={table} />
        {editing && <input type="hidden" name="id" value={editing.id} />}
        {!editing &&
          Object.entries(hiddenFields).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}

        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-carbone">
            {editing ? `Editar registro (${valueOf(editing, 'name') || valueOf(editing, 'title') || 'seleccionado'})` : 'Crear nuevo registro'}
          </h3>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                formRef.current?.reset();
              }}
              className="text-xs text-carbone/60 hover:text-carbone"
            >
              Cancelar edición
            </button>
          )}
        </div>

        {fields.map((field) => {
          const currentValue = editing ? valueOf(editing, field.name) : '';
          return (
            <div key={field.name}>
              <label htmlFor={`crud-${field.name}`} className="mb-1 block text-sm font-medium text-carbone">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  id={`crud-${field.name}`}
                  name={field.name}
                  rows={field.rows ?? 4}
                  required={field.required}
                  defaultValue={currentValue}
                  className="w-full rounded-md border border-piedra/30 px-3 py-2 text-sm focus:border-dorado focus:outline-none focus:ring-1 focus:ring-dorado"
                />
              ) : field.type === 'select' ? (
                <select
                  id={`crud-${field.name}`}
                  name={field.name}
                  required={field.required}
                  defaultValue={editing ? normalizeForSelect(currentValue) : undefined}
                  className="w-full rounded-md border border-piedra/30 px-3 py-2 text-sm focus:border-dorado focus:outline-none focus:ring-1 focus:ring-dorado"
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`crud-${field.name}`}
                  name={field.name}
                  type={field.type || 'text'}
                  required={field.required}
                  defaultValue={currentValue}
                  className="w-full rounded-md border border-piedra/30 px-3 py-2 text-sm focus:border-dorado focus:outline-none focus:ring-1 focus:ring-dorado"
                />
              )}
            </div>
          );
        })}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando…' : editing ? 'Actualizar registro' : 'Crear registro'}
          </Button>
          {result?.error && <span className="text-sm text-red-700">{result.error}</span>}
          {result?.ok && !result.error && <span className="text-sm text-green-700">{result.message}</span>}
        </div>
      </form>
    </div>
  );
}

'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { adminGenericSave, adminGenericDelete, uploadGalleryImage, type ActionResult } from '@/lib/actions';

interface FieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'url' | 'email' | 'time' | 'file';
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  /** Grupo visual opcional: 'content' | 'seo' | 'publication' */
  group?: 'content' | 'seo' | 'publication';
  /** Ancho completo en la parrilla de dos columnas. */
  fullWidth?: boolean;
  /** Para campos file: indicar que es imagen de galería (usa uploadGalleryImage). */
  uploadGallery?: boolean;
  /** Para campos file: aceptar solo imágenes. */
  accept?: string;
}

/**
 * Columnas declarativas (serializables). NUNCA pasar funciones por props:
 * este componente es cliente y vive en la frontera RSC.
 */
interface ColumnConfig<T> {
  key: keyof T | string;
  label: string;
  /** Formato declarativo de la celda: texto, booleano, fecha, estado o imagen. */
  type?: 'text' | 'boolean' | 'date' | 'status' | 'image';
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
  /** Etiqueta del recurso (p.ej. "noticia") para mensajes y confirmaciones. */
  entityLabel?: string;
}

const GROUP_LABELS: Record<string, string> = {
  content: 'Contenido',
  seo: 'SEO',
  publication: 'Publicación',
};

const GROUP_ORDER: NonNullable<FieldConfig['group']>[] = ['content', 'publication', 'seo'];

/** Badges discretos para estados editoriales. */
function StatusBadge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    published: 'border-green-200 bg-green-50 text-green-800',
    draft: 'border-amber-200 bg-amber-50 text-amber-900',
    archived: 'border-piedra/40 bg-marfil text-muted-foreground',
    true: 'border-green-200 bg-green-50 text-green-800',
    false: 'border-piedra/40 bg-marfil text-muted-foreground',
  };
  const labels: Record<string, string> = {
    published: 'Publicado',
    draft: 'Borrador',
    archived: 'Archivado',
    true: 'Sí',
    false: 'No',
  };
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[0.68rem] font-semibold ${
        styles[value] ?? 'border-piedra/40 bg-marfil text-muted-foreground'
      }`}
    >
      {labels[value] ?? value}
    </span>
  );
}

/**
 * CRUD completo y reutilizable para cualquier seccion del CMS:
 * lista con Editar/Eliminar por fila + formulario Crear/Actualizar
 * con grupos editoriales (Contenido / Publicación / SEO).
 * El control de permisos real esta en las server actions (sesion + rol).
 */
export function AdminCrud<T extends { id: string }>({
  table,
  rows: initialRows,
  columns,
  fields,
  hiddenFields = {},
  emptyMessage = 'No hay registros.',
  entityLabel = 'registro',
}: AdminCrudProps<T>) {
  const [rows, setRows] = React.useState(initialRows);
  const [editing, setEditing] = React.useState<T | null>(null);
  const [result, setResult] = React.useState<ActionResult | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const [confirming, setConfirming] = React.useState<T | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => setRows(initialRows), [initialRows]);

  const valueOf = (row: T, key: string): string => {
    const v = (row as Record<string, unknown>)[key];
    if (v === null || v === undefined) return '';
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    if (typeof v === 'object' && v instanceof Date) return v.toISOString().slice(0, 10);
    return String(v);
  };

  const rowTitle = (row: T) =>
    valueOf(row, 'name') || valueOf(row, 'title') || valueOf(row, 'label') || row.id;

  /** Celda segun tipo declarativo (sin funciones del servidor). */
  function cellContent(row: T, col: ColumnConfig<T>): React.ReactNode {
    const raw = (row as Record<string, unknown>)[col.key as string];
    if (col.type === 'boolean') {
      return <StatusBadge value={raw ? 'true' : 'false'} />;
    }
    if (col.type === 'status') {
      return <StatusBadge value={raw === null || raw === undefined || raw === '' ? '—' : String(raw)} />;
    }
    if (col.type === 'date') {
      if (!raw) return '—';
      const d = new Date(String(raw).length === 10 ? `${String(raw)}T00:00:00` : String(raw));
      return (
        <span className="whitespace-nowrap tabular-nums">
          {Number.isNaN(d.getTime())
            ? String(raw)
            : d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\./g, '')}
        </span>
      );
    }
    if (col.type === 'image') {
      if (!raw || raw === '') return <span className="text-muted-foreground">—</span>;
      return (
        <div className="relative h-10 w-14 overflow-hidden rounded border border-piedra/20 bg-marfil">
          <Image
            src={String(raw)}
            alt=""
            fill
            sizes="56px"
            className="object-cover"
            unoptimized={String(raw).includes('supabase.co') === false}
          />
        </div>
      );
    }
    return raw === null || raw === undefined || raw === '' ? (
      <span className="text-muted-foreground">—</span>
    ) : (
      String(raw)
    );
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
      setFilePreviews({});
      // Si era un registro seed (ID no-UUID), reemplazarlo en el estado local
      // con un registro "virtual" que tenga el mismo ID para que la tabla se
      // actualice sin necesidad de recargar la página.
      if (editing && !/^[0-9a-f-]{36}$/i.test(editing.id)) {
        const fd = new FormData(ev.currentTarget);
        const updatedFields: Record<string, unknown> = {};
        for (const [key, value] of fd.entries()) {
          if (!key.startsWith('_') && typeof value === 'string') {
            updatedFields[key] = value === 'true' ? true : value === 'false' ? false : value || null;
          }
        }
        setRows((prev) =>
          prev.map((r) => (r.id === editing.id ? { ...r, ...updatedFields } as T : r)),
        );
      } else {
        window.location.reload();
      }
    }
  }

  function requestDelete(row: T) {
    setConfirming(row);
  }

  async function performDelete() {
    if (!confirming) return;
    setDeleting(confirming.id);
    const fd = new FormData();
    fd.set('_table', table);
    fd.set('id', confirming.id);
    const res = await adminGenericDelete(fd);
    setDeleting(null);
    if (res.ok) {
      setRows((prev) => prev.filter((r) => r.id !== confirming.id));
    }
    setResult(res);
    setConfirming(null);
  }

  function startEdit(row: T) {
    setEditing(row);
    setResult(null);
    requestAnimationFrame(() =>
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    );
  }

  const normalizeForSelect = (v: string) => v; // selects editables usan el valor crudo

  // Agrupación editorial de campos (Contenido / Publicación / SEO)
  const grouped = GROUP_ORDER.map((group) => ({
    group,
    label: GROUP_LABELS[group],
    items: fields.filter((f) => f.group === group),
  })).filter((g) => g.items.length > 0);
  const ungrouped = fields.filter((f) => !f.group);

  const [filePreviews, setFilePreviews] = React.useState<Record<string, string>>({});
  const [uploadingField, setUploadingField] = React.useState<string | null>(null);

  const renderField = (field: FieldConfig) => {
    const currentValue = editing ? valueOf(editing, field.name) : '';
    const inputCls =
      'w-full rounded-md border border-piedra/40 bg-blanco px-3 py-2 text-sm text-marron transition-colors placeholder:text-muted-foreground/60 focus:border-dorado focus:outline-none focus:ring-1 focus:ring-dorado';
    return (
      <div key={field.name}>
        <label htmlFor={`crud-${field.name}`} className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-tierra">
          {field.label}
          {field.required ? <span className="ml-1 text-dorado-oscuro">*</span> : null}
        </label>
        {field.type === 'textarea' ? (
          <textarea
            id={`crud-${field.name}`}
            name={field.name}
            rows={field.rows ?? 4}
            required={field.required}
            defaultValue={currentValue}
            className={inputCls}
          />
        ) : field.type === 'select' ? (
          <select
            id={`crud-${field.name}`}
            name={field.name}
            required={field.required}
            defaultValue={editing ? normalizeForSelect(currentValue) : undefined}
            className={inputCls}
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : field.type === 'file' ? (
          <div className="space-y-2">
            {currentValue && !filePreviews[field.name] && (
              <div className="relative h-24 w-32 overflow-hidden rounded border border-piedra/20 bg-marfil">
                <Image
                  src={currentValue}
                  alt={field.label}
                  fill
                  sizes="128px"
                  className="object-cover"
                  unoptimized={currentValue.includes('supabase.co') === false}
                />
              </div>
            )}
            {filePreviews[field.name] && (
              <div className="relative h-24 w-32 overflow-hidden rounded border border-dorado/40 bg-marfil">
                <Image
                  src={filePreviews[field.name]}
                  alt="Preview"
                  fill
                  sizes="128px"
                  className="object-cover"
                />
                <span className="absolute bottom-0 left-0 right-0 bg-dorado/80 px-1 text-center text-[0.6rem] text-blanco">Nueva imagen</span>
              </div>
            )}
            <input
              id={`crud-${field.name}`}
              name={`_file_${field.name}`}
              type="file"
              accept={field.accept ?? 'image/jpeg,image/png,image/webp'}
              className="block w-full text-sm text-carbone/70 file:mr-3 file:rounded-md file:border-0 file:bg-carbone file:px-3 file:py-2 file:text-sm file:text-blanco hover:file:bg-carbone/90"
              onChange={async (ev) => {
                const file = ev.target.files?.[0];
                if (!file) return;
                setUploadingField(field.name);
                const fd = new FormData();
                fd.set('file', file);
                const result = await uploadGalleryImage(fd);
                if (result.ok && result.data?.url) {
                  setFilePreviews((prev) => ({ ...prev, [field.name]: result.data!.url }));
                  const hiddenInput = document.createElement('input');
                  hiddenInput.type = 'hidden';
                  hiddenInput.name = field.name;
                  hiddenInput.value = result.data!.url;
                  hiddenInput.id = `crud-${field.name}`;
                  ev.target.form?.appendChild(hiddenInput);
                }
                setUploadingField(null);
              }}
            />
            {uploadingField === field.name && (
              <span className="text-xs text-dorado-oscuro">Subiendo imagen…</span>
            )}
            <input type="hidden" name={field.name} value={filePreviews[field.name] ?? currentValue} />
          </div>
        ) : (
          <input
            id={`crud-${field.name}`}
            name={field.name}
            type={field.type || 'text'}
            required={field.required}
            defaultValue={currentValue}
            className={inputCls}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* ---------------- Tabla (desktop) / Cards (móvil) ---------------- */}
      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-piedra/50 bg-blanco p-10 text-center">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            Usa el formulario «{editing ? 'Editar' : 'Nuevo'} {entityLabel}» para crear el primero.
          </p>
        </div>
      ) : (
        <>
          {/* Vista de tabla — sm en adelante */}
          <div className="hidden overflow-x-auto rounded-lg border border-piedra/30 bg-blanco sm:block">
            <table className="min-w-full divide-y divide-piedra/20 text-sm">
              <thead className="bg-marfil/60">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={String(col.key)}
                      className="px-4 py-3 text-left text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-tierra"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-tierra">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-piedra/15">
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition-colors hover:bg-marfil/40 ${editing?.id === row.id ? 'bg-dorado/10' : ''}`}
                  >
                    {columns.map((col, colIdx) => (
                      <td
                        key={String(col.key)}
                        className={`px-4 py-3 ${colIdx === 0 ? 'font-medium text-marron' : 'text-marron/80'}`}
                      >
                        {cellContent(row, col)}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(row)}
                          className="rounded-md border border-piedra/40 px-2.5 py-1 text-xs font-medium text-marron transition-colors hover:border-tierra hover:bg-marfil focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-oscuro"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => requestDelete(row)}
                          disabled={deleting === row.id}
                          className="rounded-md border border-destructive/25 px-2.5 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive disabled:opacity-50"
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

          {/* Vista de cards — móvil */}
          <ul className="space-y-3 sm:hidden">
            {rows.map((row) => (
              <li
                key={row.id}
                className={`rounded-lg border bg-blanco p-4 ${editing?.id === row.id ? 'border-dorado/50' : 'border-piedra/30'}`}
              >
                <div className="space-y-1.5">
                  {columns.map((col) => (
                    <div key={String(col.key)} className="flex items-baseline justify-between gap-3">
                      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-tierra">
                        {col.label}
                      </span>
                      <span className="text-right text-sm text-marron/85">{cellContent(row, col)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2 border-t border-piedra/15 pt-3">
                  <button
                    type="button"
                    onClick={() => startEdit(row)}
                    className="flex-1 rounded-md border border-piedra/40 px-3 py-2 text-xs font-medium text-marron transition-colors hover:bg-marfil"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => requestDelete(row)}
                    disabled={deleting === row.id}
                    className="flex-1 rounded-md border border-destructive/25 px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/5 disabled:opacity-50"
                  >
                    {deleting === row.id ? 'Eliminando…' : 'Eliminar'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* ---------------- Formulario crear/editar ---------------- */}
      {/* key remonta el formulario al cambiar de registro: los defaultValue se recargan */}
      <form
        key={editing?.id ?? '__nuevo__'}
        ref={formRef}
        onSubmit={onSubmit}
        className="space-y-6 rounded-lg border border-piedra/30 bg-blanco p-6 sm:p-7"
      >
        <input type="hidden" name="_table" value={table} />
        {editing && <input type="hidden" name="id" value={editing.id} />}
        {!editing &&
          Object.entries(hiddenFields).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}

        <div className="flex items-center justify-between gap-4 border-b border-piedra/20 pb-4">
          <h2 className="font-heading text-lg font-medium text-marron">
            {editing ? `Editar ${entityLabel}` : `Nuevo ${entityLabel}`}
            {editing ? (
              <span className="ml-2 truncate text-sm font-normal text-muted-foreground">
                «{rowTitle(editing)}»
              </span>
            ) : null}
          </h2>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                formRef.current?.reset();
              }}
              className="shrink-0 text-xs font-medium text-tierra transition-colors hover:text-marron focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-oscuro"
            >
              Cancelar edición
            </button>
          )}
        </div>

        {/* Campos sin grupo: parrilla simple */}
        {ungrouped.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            {ungrouped.map(renderField)}
          </div>
        )}

        {/* Grupos editoriales */}
        {grouped.map((group) => (
          <fieldset key={group.group} className="border-t border-piedra/20 pt-5">
            <legend className="mb-4 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-dorado-oscuro">
              {group.label}
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              {group.items.map(renderField)}
            </div>
          </fieldset>
        ))}

        <div className="flex flex-wrap items-center gap-4 border-t border-piedra/20 pt-5">
          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando…' : editing ? 'Guardar cambios' : `Crear ${entityLabel}`}
          </Button>
          {result?.error && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {result.error}
            </p>
          )}
          {result?.ok && !result.error && (
            <p role="status" className="text-sm font-medium text-green-700">
              {result.message}
            </p>
          )}
        </div>
      </form>

      {/* ---------------- Confirmación de borrado ---------------- */}
      <ConfirmDialog
        open={confirming !== null}
        title={`¿Eliminar «${confirming ? rowTitle(confirming) : ''}»?`}
        busy={deleting !== null}
        onConfirm={performDelete}
        onCancel={() => setConfirming(null)}
      />
    </div>
  );
}

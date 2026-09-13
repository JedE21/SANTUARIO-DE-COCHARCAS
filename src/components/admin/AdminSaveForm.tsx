'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { adminGenericSave, type ActionResult } from '@/lib/actions';

interface FieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'url' | 'email';
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: string;
  rows?: number;
  /** Grupo visual opcional: 'content' | 'seo' | 'publication' */
  group?: 'content' | 'seo' | 'publication';
  /** Ancho completo en la parrilla de dos columnas. */
  fullWidth?: boolean;
}

interface AdminSaveFormProps {
  table: string;
  fields: FieldConfig[];
  hiddenFields?: Record<string, string>;
  submitLabel?: string;
}

const GROUP_LABELS: Record<string, string> = {
  content: 'Contenido',
  seo: 'SEO',
  publication: 'Publicación',
};

const GROUP_ORDER: NonNullable<FieldConfig['group']>[] = ['content', 'publication', 'seo'];

export function AdminSaveForm({
  table,
  fields,
  hiddenFields = {},
  submitLabel = 'Guardar cambios',
}: AdminSaveFormProps) {
  const [result, setResult] = React.useState<ActionResult | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setLoading(true);
    const res = await adminGenericSave(new FormData(ev.currentTarget));
    setResult(res);
    setLoading(false);
  }

  const inputCls =
    'w-full rounded-md border border-piedra/40 bg-blanco px-3 py-2 text-sm text-marron transition-colors placeholder:text-muted-foreground/60 focus:border-dorado focus:outline-none focus:ring-1 focus:ring-dorado';

  const renderField = (field: FieldConfig) => (
    <div key={field.name} className={field.fullWidth ? 'sm:col-span-2' : ''}>
      <label htmlFor={field.name} className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-tierra">
        {field.label}
        {field.required ? <span className="ml-1 text-dorado-oscuro">*</span> : null}
      </label>
      {field.type === 'textarea' ? (
        <textarea
          id={field.name}
          name={field.name}
          rows={field.rows ?? 4}
          required={field.required}
          defaultValue={field.defaultValue}
          className={inputCls}
        />
      ) : field.type === 'select' ? (
        <select
          id={field.name}
          name={field.name}
          required={field.required}
          defaultValue={field.defaultValue}
          className={inputCls}
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={field.name}
          name={field.name}
          type={field.type || 'text'}
          required={field.required}
          defaultValue={field.defaultValue}
          className={inputCls}
        />
      )}
    </div>
  );

  const grouped = GROUP_ORDER.map((group) => ({
    group,
    label: GROUP_LABELS[group],
    items: fields.filter((f) => f.group === group),
  })).filter((g) => g.items.length > 0);
  const ungrouped = fields.filter((f) => !f.group);

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-lg border border-piedra/30 bg-blanco p-6 sm:p-7">
      <input type="hidden" name="_table" value={table} />
      {Object.entries(hiddenFields).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}

      {ungrouped.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2">{ungrouped.map(renderField)}</div>
      )}

      {grouped.map((group) => (
        <fieldset key={group.group} className="border-t border-piedra/20 pt-5">
          <legend className="mb-4 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-dorado-oscuro">
            {group.label}
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">{group.items.map(renderField)}</div>
        </fieldset>
      ))}

      {result?.message ? (
        <p role="status" className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-800">
          {result.message}
        </p>
      ) : null}
      {result?.error ? (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-destructive">
          {result.error}
        </p>
      ) : null}

      <div className="border-t border-piedra/20 pt-5">
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}

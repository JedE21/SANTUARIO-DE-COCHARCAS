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
}

interface AdminSaveFormProps {
  table: string;
  fields: FieldConfig[];
  hiddenFields?: Record<string, string>;
  submitLabel?: string;
}

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

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-piedra/20 bg-blanco p-6 shadow-sm">
      <input type="hidden" name="_table" value={table} />
      {Object.entries(hiddenFields).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}

      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="mb-1 block text-sm font-medium text-carbone">
            {field.label}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              rows={field.rows ?? 4}
              required={field.required}
              defaultValue={field.defaultValue}
              className="w-full rounded-md border border-piedra/30 px-3 py-2 text-sm focus:border-dorado focus:outline-none focus:ring-1 focus:ring-dorado"
            />
          ) : field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              required={field.required}
              defaultValue={field.defaultValue}
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
              id={field.name}
              name={field.name}
              type={field.type || 'text'}
              required={field.required}
              defaultValue={field.defaultValue}
              className="w-full rounded-md border border-piedra/30 px-3 py-2 text-sm focus:border-dorado focus:outline-none focus:ring-1 focus:ring-dorado"
            />
          )}
        </div>
      ))}

      {result?.message ? (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{result.message}</p>
      ) : null}
      {result?.error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{result.error}</p>
      ) : null}

      <Button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : submitLabel}
      </Button>
    </form>
  );
}

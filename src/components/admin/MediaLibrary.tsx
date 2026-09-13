'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { uploadMediaAsset, deleteMediaAsset, type ActionResult } from '@/lib/actions';
import type { MediaRow } from '@/lib/queries-admin';

function formatSize(bytes: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary({ items }: { items: MediaRow[] }) {
  const [list, setList] = React.useState(items);
  const [result, setResult] = React.useState<ActionResult | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const [confirming, setConfirming] = React.useState<MediaRow | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  async function onUpload(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    setUploading(true);
    setResult(null);
    const res = await uploadMediaAsset(new FormData(form));
    setResult(res);
    setUploading(false);
    if (res.ok) {
      form.reset();
      if (fileInputRef.current) fileInputRef.current.value = '';
      window.location.reload();
    }
  }

  async function performDelete() {
    if (!confirming) return;
    setDeleting(confirming.id);
    const res = await deleteMediaAsset(confirming.id);
    setDeleting(null);
    setConfirming(null);
    if (res.ok) {
      setList((prev) => prev.filter((m) => m.id !== confirming.id));
    } else {
      setResult({ ok: false, error: res.error });
    }
  }

  function copyUrl(url: string) {
    void navigator.clipboard.writeText(url);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onUpload} className="space-y-4 rounded-lg border border-piedra/20 bg-blanco p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block space-y-1 md:col-span-1">
            <span className="text-sm font-medium text-carbone">Imagen (JPG/PNG/WebP, máx. 10 MB)</span>
            <input
              ref={fileInputRef}
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              className="block w-full text-sm text-carbone/70 file:mr-3 file:rounded-md file:border-0 file:bg-carbone file:px-3 file:py-2 file:text-sm file:text-blanco hover:file:bg-carbone/90"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-carbone">Nombre</span>
            <Input name="name" placeholder="Ej. Fachada del santuario" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-carbone">Texto alternativo (accesibilidad)</span>
            <Input name="alt_text" placeholder="Describe la imagen" />
          </label>
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={uploading}>{uploading ? 'Subiendo…' : 'Subir imagen'}</Button>
          {result?.error && <span className="text-sm text-red-700">{result.error}</span>}
          {result?.ok && !result.error && <span className="text-sm text-green-700">{result.message}</span>}
        </div>
      </form>

      {list.length === 0 ? (
        <div className="rounded-lg border border-piedra/20 bg-blanco p-8 text-center text-sm text-carbone/60">
          La biblioteca está vacía. Sube la primera fotografía del santuario.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((item) => (
            <figure key={item.id} className="overflow-hidden rounded-lg border border-piedra/20 bg-blanco shadow-sm">
              <div className="relative aspect-[4/3] w-full bg-marfil">
                <Image
                  src={item.url}
                  alt={item.alt_text ?? item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                  unoptimized={item.url.includes('supabase.co') === false}
                />
              </div>
              <figcaption className="space-y-2 p-3">
                <p className="truncate text-sm font-medium text-carbone" title={item.name}>{item.name}</p>
                <p className="text-xs text-carbone/50">{formatSize(item.size_bytes)}{item.mime_type ? ` · ${item.mime_type.replace('image/', '').toUpperCase()}` : ''}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => copyUrl(item.url)}
                    className="rounded-md border border-piedra/30 px-2 py-1 text-xs text-carbone transition-normal hover:bg-marfil"
                  >
                    Copiar URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirming(item)}
                    disabled={deleting === item.id}
                    className="rounded-md border border-destructive/25 px-2 py-1 text-xs font-medium text-destructive transition-normal hover:bg-destructive/5 disabled:opacity-50"
                  >
                    {deleting === item.id ? 'Eliminando…' : 'Eliminar'}
                  </button>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirming !== null}
        title={`¿Eliminar «${confirming?.name ?? ''}»?`}
        busy={deleting !== null}
        onConfirm={performDelete}
        onCancel={() => setConfirming(null)}
      />
    </div>
  );
}

'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import {
  adminDeleteRow,
  adminUpsertRow,
  uploadSlideImage,
  type ActionResult,
} from '@/lib/actions';
import { SLIDE_SECTIONS, slideSectionLabel } from '@/lib/slides';
import type { Slide } from '@/types/database';

/* ------------------------------------------------------------------ */
/*  Previsualización (URL o archivo local)                             */
/* ------------------------------------------------------------------ */

function SlidePreview({ src, alt }: { src: string | null; alt: string }) {
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src) {
    return (
      <div className="flex aspect-[16/7] w-full items-center justify-center rounded-md border border-dashed border-piedra/40 bg-marfil text-xs text-muted-foreground">
        La previsualización aparecerá aquí
      </div>
    );
  }

  if (failed) {
    return (
      <div className="flex aspect-[16/7] w-full items-center justify-center rounded-md border border-dashed border-destructive/40 bg-marfil px-4 text-center text-xs text-destructive">
        No se pudo cargar la imagen. Verifica la URL o el archivo.
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/7] w-full overflow-hidden rounded-md border border-piedra/30 bg-marfil">
      {/* <img> deliberado: la vista previa debe funcionar para CUALQUIER URL
          (el dominio puede no estar en remotePatterns de next/image). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Formulario de slide (crear/editar)                                 */
/* ------------------------------------------------------------------ */

interface SlideFormProps {
  section: string;
  initial: Slide | null;
  busy: boolean;
  onSave: (payload: Record<string, unknown>, id?: string) => Promise<ActionResult>;
  onCancel: () => void;
}

function SlideForm({ section, initial, busy, onSave, onCancel }: SlideFormProps) {
  const [mode, setMode] = React.useState<'url' | 'upload'>(initial?.image_url && !initial.image_url.startsWith('/') && !initial.image_url.includes(window.location.origin) ? 'url' : 'url');
  const [url, setUrl] = React.useState(initial?.image_url ?? '');
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  // Previsualización en vivo: URL escrita o archivo local (ObjectURL)
  const [localPreview, setLocalPreview] = React.useState<string | null>(null);
  React.useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  function onPickFile(file: File | null) {
    setError(null);
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(file ? URL.createObjectURL(file) : null);
  }

  const previewSrc = mode === 'upload' && localPreview ? localPreview : url.trim() !== '' ? url.trim() : null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    const image_url =
      mode === 'upload'
        ? url.trim() // el upload exitoso llena `url`
        : url.trim();
    if (image_url === '') {
      setError('Indica la imagen: sube un archivo o pega una URL.');
      return;
    }

    const payload: Record<string, unknown> = {
      section,
      title: String(fd.get('title') ?? '').trim().slice(0, 160),
      description: String(fd.get('description') ?? '').trim().slice(0, 400) || null,
      image_url,
      button_text: String(fd.get('button_text') ?? '').trim().slice(0, 60) || null,
      button_url: String(fd.get('button_url') ?? '').trim().slice(0, 300) || null,
      order_index: Number(fd.get('order_index') ?? 0) || 0,
      is_active: fd.get('is_active') === 'on' || fd.get('is_active') === 'true',
    };

    const res = await onSave(payload, initial?.id);
    if (!res.ok) setError(res.error ?? 'No se pudo guardar el slide.');
  }

  async function onUploadFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadSlideImage(fd);
      if (!res.ok || !res.data?.url) {
        setError(res.error ?? 'No se pudo subir la imagen.');
        return;
      }
      setUrl(res.data.url);
      setMode('url'); // tras subir mostramos la URL resultante
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-lg border border-piedra/25 bg-blanco p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-semibold text-marron">
          {initial ? 'Editar slide' : 'Nuevo slide'} · {slideSectionLabel(section)}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cerrar formulario"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-marfil focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-oscuro"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Columna imagen + previsualización */}
        <div className="space-y-3">
          <div className="flex rounded-md border border-piedra/35 p-0.5 text-xs font-medium" role="tablist" aria-label="Origen de la imagen">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'upload'}
              onClick={() => setMode('upload')}
              className={`flex-1 rounded px-3 py-1.5 transition-colors ${mode === 'upload' ? 'bg-marfil text-marron' : 'text-muted-foreground hover:text-marron'}`}
            >
              Subir archivo
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'url'}
              onClick={() => setMode('url')}
              className={`flex-1 rounded px-3 py-1.5 transition-colors ${mode === 'url' ? 'bg-marfil text-marron' : 'text-muted-foreground hover:text-marron'}`}
            >
              Usar URL
            </button>
          </div>

          {mode === 'upload' ? (
            <label className="block space-y-1">
              <span className="text-sm font-medium text-carbone">Imagen (JPG/PNG/WebP, máx. 10 MB)</span>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  onPickFile(f);
                  if (f) void onUploadFile(f);
                }}
                className="block w-full text-sm text-carbone/70 file:mr-3 file:rounded-md file:border-0 file:bg-carbone file:px-3 file:py-2 file:text-sm file:text-blanco hover:file:bg-carbone/90"
              />
              {uploading ? (
                <span className="flex items-center gap-1.5 text-xs text-tierra">
                  <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" /> Subiendo a la biblioteca…
                </span>
              ) : null}
            </label>
          ) : (
            <label className="block space-y-1">
              <span className="text-sm font-medium text-carbone">URL de la imagen</span>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://… o /images/santuario/foto.jpg"
                inputMode="url"
              />
              <span className="text-xs text-muted-foreground">
                Puedes pegar una URL externa o elegir una de la <a href="/admin/multimedia/biblioteca" className="underline underline-offset-2 hover:text-marron">biblioteca multimedia</a>.
              </span>
            </label>
          )}

          <SlidePreview src={previewSrc} alt={String(url || 'Previsualización')} />
        </div>

        {/* Columna textos */}
        <div className="space-y-3.5">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-carbone">Título</span>
            <Input name="title" defaultValue={initial?.title ?? ''} maxLength={160} placeholder="Ej. Fiesta de la Virgen de Cocharcas" required />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-carbone">Descripción</span>
            <textarea
              name="description"
              defaultValue={initial?.description ?? ''}
              maxLength={400}
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Texto breve que acompaña al título"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-carbone">Texto del botón</span>
              <Input name="button_text" defaultValue={initial?.button_text ?? ''} maxLength={60} placeholder="Opcional" />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-carbone">Enlace del botón</span>
              <Input name="button_url" defaultValue={initial?.button_url ?? ''} maxLength={300} placeholder="/festividades" />
            </label>
          </div>
          <div className="flex items-end gap-5">
            <label className="block w-28 space-y-1">
              <span className="text-sm font-medium text-carbone">Orden</span>
              <Input name="order_index" type="number" defaultValue={initial?.order_index ?? 0} min={0} max={999} />
            </label>
            <label className="flex items-center gap-2 pb-2 text-sm text-carbone">
              <input type="checkbox" name="is_active" defaultChecked={initial?.is_active !== false} className="h-4 w-4 accent-[#B08A45]" />
              Activo (visible públicamente)
            </label>
          </div>
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex items-center gap-3 border-t border-piedra/20 pt-4">
        <Button type="submit" disabled={busy || uploading}>
          {busy ? 'Guardando…' : initial ? 'Guardar cambios' : 'Agregar slide'}
        </Button>
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="rounded-md border border-piedra/40 px-4 py-2 text-sm font-medium text-marron transition-colors hover:bg-marfil disabled:opacity-50"
        >
          Cancelar
        </button>
        {mode === 'upload' && !uploading && localPreview && url.trim() === '' ? (
          <span className="text-xs text-muted-foreground">La imagen se subirá al guardar…</span>
        ) : null}
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Gestor principal                                                   */
/* ------------------------------------------------------------------ */

export function SlidesManager({ initialSlides }: { initialSlides: Slide[] }) {
  const [list, setList] = React.useState<Slide[]>(initialSlides);
  const [section, setSection] = React.useState<string>('home');
  const [creating, setCreating] = React.useState(false);
  const [editing, setEditing] = React.useState<Slide | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [confirming, setConfirming] = React.useState<Slide | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [moveBusy, setMoveBusy] = React.useState<string | null>(null);

  const sectionSlides = React.useMemo(
    () => list.filter((s) => s.section === section).sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)),
    [list, section],
  );

  function flash(ok: boolean, text: string) {
    setFeedback({ ok, text });
    window.setTimeout(() => setFeedback(null), 4000);
  }

  async function handleSave(payload: Record<string, unknown>, id?: string): Promise<ActionResult> {
    setBusy(true);
    const res = await adminUpsertRow('slides', id ? { ...payload, id } : payload);
    setBusy(false);
    if (res.ok) {
      flash(true, id ? 'Cambios guardados.' : 'Slide agregado.');
      setCreating(false);
      setEditing(null);
      window.location.reload();
    } else {
      flash(false, res.error ?? 'No se pudo guardar.');
    }
    return res;
  }

  async function toggleActive(slide: Slide) {
    setMoveBusy(slide.id);
    const res = await adminUpsertRow('slides', { id: slide.id, is_active: !slide.is_active });
    setMoveBusy(null);
    if (res.ok) {
      setList((prev) => prev.map((s) => (s.id === slide.id ? { ...s, is_active: !s.is_active } : s)));
      flash(true, slide.is_active ? 'Slide oculto.' : 'Slide visible.');
    } else {
      flash(false, res.error ?? 'No se pudo actualizar.');
    }
  }

  async function move(slide: Slide, dir: -1 | 1) {
    const siblings = sectionSlides;
    const idx = siblings.findIndex((s) => s.id === slide.id);
    const other = siblings[idx + dir];
    if (!other) return;
    setMoveBusy(slide.id);
    const [a, b] = await Promise.all([
      adminUpsertRow('slides', { id: slide.id, order_index: other.order_index ?? idx + dir }),
      adminUpsertRow('slides', { id: other.id, order_index: slide.order_index ?? idx }),
    ]);
    setMoveBusy(null);
    if (a.ok && b.ok) {
      setList((prev) =>
        prev.map((s) => {
          if (s.id === slide.id) return { ...s, order_index: other.order_index ?? idx + dir };
          if (s.id === other.id) return { ...s, order_index: slide.order_index ?? idx };
          return s;
        }),
      );
    } else {
      flash(false, a.error ?? b.error ?? 'No se pudo reordenar.');
    }
  }

  async function performDelete() {
    if (!confirming) return;
    setDeleting(true);
    const res = await adminDeleteRow('slides', confirming.id);
    setDeleting(false);
    if (res.ok) {
      setList((prev) => prev.filter((s) => s.id !== confirming.id));
      flash(true, 'Slide eliminado.');
    } else {
      flash(false, res.error ?? 'No se pudo eliminar.');
    }
    setConfirming(null);
  }

  const formOpen = creating || editing !== null;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Gestión de slides"
        description="Carruseles por sección: Inicio, Santuario, Fe y Peregrinación, Festividades, Historia y Galería. Cada sección muestra sus propias imágenes en el sitio público."
      />

      {/* Selector de sección + acciones */}
      <div className="flex flex-wrap items-end gap-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-carbone">Sección</span>
          <select
            value={section}
            onChange={(e) => {
              setSection(e.target.value);
              setCreating(false);
              setEditing(null);
            }}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {SLIDE_SECTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>

        <Button
          type="button"
          onClick={() => {
            setEditing(null);
            setCreating((v) => !v);
          }}
          disabled={formOpen}
        >
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" /> Agregar slide
        </Button>

        {feedback ? (
          <span className={`text-sm ${feedback.ok ? 'text-green-700' : 'text-destructive'}`} role="status">
            {feedback.text}
          </span>
        ) : null}
      </div>

      {/* Formulario */}
      {creating ? (
        <SlideForm
          key="new"
          section={section}
          initial={null}
          busy={busy}
          onSave={handleSave}
          onCancel={() => setCreating(false)}
        />
      ) : editing ? (
        <SlideForm
          key={editing.id}
          section={section}
          initial={editing}
          busy={busy}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      ) : null}

      {/* Lista de slides de la sección */}
      {sectionSlides.length === 0 && !formOpen ? (
        <div className="rounded-lg border border-piedra/20 bg-blanco p-10 text-center">
          <p className="text-sm font-medium text-carbone">Todavía no hay slides en esta sección</p>
          <p className="mt-1 text-sm text-muted-foreground">Agrega la primera imagen del carrusel de {slideSectionLabel(section)}.</p>
          <Button type="button" className="mt-5" onClick={() => setCreating(true)}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" /> Crear primer slide
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {sectionSlides.map((slide, i) => (
            <li
              key={slide.id}
              className={`flex flex-col gap-4 rounded-lg border bg-blanco p-4 sm:flex-row sm:items-center ${
                slide.is_active ? 'border-piedra/25' : 'border-piedra/20 bg-blanco/60 opacity-75'
              }`}
            >
              {/* Miniatura */}
              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-md bg-marfil sm:w-44">
                {slide.image_url ? (
                  // <img> para soportar cualquier URL sin remotePatterns
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={slide.image_url} alt={slide.title || 'Slide'} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Sin imagen</div>
                )}
                {!slide.is_active ? (
                  <span className="absolute left-2 top-2 rounded bg-negro/75 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-blanco">
                    Oculto
                  </span>
                ) : null}
              </div>

              {/* Datos */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-marron">{slide.title || '(sin título)'}</p>
                {slide.description ? (
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{slide.description}</p>
                ) : null}
                <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.68rem] text-muted-foreground">
                  <span className="font-medium text-tierra">Orden {slide.order_index ?? i}</span>
                  {slide.button_text && slide.button_url ? <span>· Botón: {slide.button_text}</span> : null}
                  <span>· {slide.is_active ? 'Activo' : 'Inactivo'}</span>
                </p>
              </div>

              {/* Acciones */}
              <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => move(slide, -1)}
                  disabled={moveBusy === slide.id || i === 0}
                  aria-label="Subir en el orden"
                  className="rounded-md border border-piedra/30 p-2 text-marron transition-colors hover:bg-marfil disabled:opacity-35"
                >
                  <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => move(slide, 1)}
                  disabled={moveBusy === slide.id || i === sectionSlides.length - 1}
                  aria-label="Bajar en el orden"
                  className="rounded-md border border-piedra/30 p-2 text-marron transition-colors hover:bg-marfil disabled:opacity-35"
                >
                  <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleActive(slide)}
                  disabled={moveBusy === slide.id}
                  aria-label={slide.is_active ? 'Ocultar slide' : 'Activar slide'}
                  className="rounded-md border border-piedra/30 p-2 text-marron transition-colors hover:bg-marfil disabled:opacity-35"
                >
                  {slide.is_active ? <Eye className="h-3.5 w-3.5" aria-hidden="true" /> : <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreating(false);
                    setEditing(slide);
                  }}
                  className="rounded-md border border-piedra/30 px-2.5 py-1.5 text-xs font-medium text-marron transition-colors hover:bg-marfil"
                >
                  <Pencil className="mr-1 inline h-3 w-3" aria-hidden="true" /> Editar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(slide)}
                  className="rounded-md border border-destructive/25 px-2.5 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/5"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={confirming !== null}
        title={`¿Eliminar «${confirming?.title || 'este slide'}»?`}
        description="Esta acción no se puede deshacer. El carrusel público dejará de mostrar esta imagen."
        busy={deleting}
        onConfirm={performDelete}
        onCancel={() => setConfirming(null)}
      />
    </div>
  );
}

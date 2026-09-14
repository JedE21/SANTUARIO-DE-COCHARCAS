'use client';

import * as React from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { Modal } from '@/components/ui/modal';
import { getCroppedImg, type OutputFormat } from '@/lib/utils/crop-image';

interface ImageCropModalProps {
  open: boolean;
  imageSrc: string;
  onCropComplete: (blob: Blob, url: string) => void;
  onCancel: () => void;
}

type AspectLabel = 'Libre' | '4:5' | '1:1' | '16:9';

const ASPECTS: { label: AspectLabel; value: number | null }[] = [
  { label: 'Libre', value: null },
  { label: '4:5', value: 4 / 5 },
  { label: '1:1', value: 1 },
  { label: '16:9', value: 16 / 9 },
];

const FORMAT_OPTIONS: { value: OutputFormat; label: string }[] = [
  { value: 'jpeg', label: 'JPEG' },
  { value: 'png', label: 'PNG' },
];

export function ImageCropModal({ open, imageSrc, onCropComplete, onCancel }: ImageCropModalProps) {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [aspect, setAspect] = React.useState<AspectLabel>('Libre');
  const [format, setFormat] = React.useState<OutputFormat>('jpeg');
  const [quality, setQuality] = React.useState(90);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(null);
  const [processing, setProcessing] = React.useState(false);

  const currentAspect = ASPECTS.find((a) => a.label === aspect);

  function handleCropChange(c: { x: number; y: number }) {
    setCrop(c);
  }

  function handleZoomChange(z: number) {
    setZoom(z);
  }

  function handleCropComplete(_croppedArea: Area, croppedPixels: Area) {
    setCroppedAreaPixels(croppedPixels);
  }

  async function handleConfirm() {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        format,
        quality / 100,
      );
      const url = URL.createObjectURL(blob);
      onCropComplete(blob, url);
    } catch {
      // Error silencioso — el usuario puede reintentar
    } finally {
      setProcessing(false);
    }
  }

  function handleAspectChange(label: AspectLabel) {
    setAspect(label);
    setCrop({ x: 0, y: 0 });
  }

  if (!open) return null;

  const inputCls =
    'w-full rounded-md border border-piedra/40 bg-blanco px-3 py-2 text-sm text-marron transition-colors focus:border-dorado focus:outline-none focus:ring-1 focus:ring-dorado';

  return (
    <Modal onClose={onCancel}>
      <div className="space-y-4">
        <div>
          <h2 className="font-heading text-lg font-medium text-marron">Editar imagen</h2>
          <p className="mt-1 text-xs text-muted-foreground">Recorta, zoom y ajusta la imagen antes de subirla.</p>
        </div>

        {/* Cropper */}
        <div className="relative h-72 w-full overflow-hidden rounded-lg border border-piedra/30 bg-gray-900 sm:h-80">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={currentAspect?.value ?? undefined}
            onCropChange={handleCropChange}
            onZoomChange={handleZoomChange}
            onCropComplete={handleCropComplete}
            cropShape="rect"
            showGrid={true}
            style={{
              containerStyle: { borderRadius: '0.5rem' },
              cropAreaStyle: { border: '2px solid #B8860B', borderRadius: '0.25rem' },
            }}
          />
        </div>

        {/* Controles */}
        <div className="space-y-3">
          {/* Zoom */}
          <div className="flex items-center gap-3">
            <label className="w-16 text-xs font-semibold text-tierra">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-piedra/20 accent-dorado"
            />
            <span className="w-10 text-right text-xs text-muted-foreground">{zoom.toFixed(1)}x</span>
          </div>

          {/* Rotación */}
          <div className="flex items-center gap-3">
            <label className="w-16 text-xs font-semibold text-tierra">Rotar</label>
            <input
              type="range"
              min={-45}
              max={45}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-piedra/20 accent-dorado"
            />
            <span className="w-10 text-right text-xs text-muted-foreground">{rotation}°</span>
          </div>

          {/* Aspect Ratio */}
          <div className="flex items-center gap-3">
            <label className="w-16 text-xs font-semibold text-tierra">Proporción</label>
            <div className="flex gap-1.5">
              {ASPECTS.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => handleAspectChange(a.label)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    aspect === a.label
                      ? 'bg-dorado text-blanco'
                      : 'border border-piedra/30 text-marron hover:bg-marfil'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Formato y calidad */}
          <div className="flex items-center gap-3">
            <label className="w-16 text-xs font-semibold text-tierra">Formato</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as OutputFormat)}
              className={inputCls + ' w-auto'}
            >
              {FORMAT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            {format === 'jpeg' && (
              <>
                <input
                  type="range"
                  min={60}
                  max={100}
                  step={5}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="h-1.5 w-32 cursor-pointer appearance-none rounded-full bg-piedra/20 accent-dorado"
                />
                <span className="text-xs text-muted-foreground">{quality}%</span>
              </>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 border-t border-piedra/20 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-piedra/40 px-4 py-2 text-sm font-medium text-marron transition-colors hover:bg-marfil"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={processing || !croppedAreaPixels}
            className="rounded-md bg-dorado px-4 py-2 text-sm font-medium text-blanco transition-colors hover:bg-dorado-oscuro disabled:opacity-50"
          >
            {processing ? 'Procesando…' : 'Usar imagen'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

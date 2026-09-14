/**
 * Utilidad para recortar imágenes usando Canvas API.
 * Genera un Blob listo para subir a Supabase Storage.
 */

export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type OutputFormat = 'jpeg' | 'png';

/**
 * Crea un Image element desde una URL (objectURL o dataURL).
 */
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
    img.setAttribute('crossorigin', 'anonymous');
    img.src = url;
  });
}

/**
 * Obtiene el ángulo de rotación normalizado (0-360°).
 */
function getRotation(rotation: number): number {
  return ((rotation % 360) + 360) % 360;
}

/**
 * Calcula el bounding box de una imagen rotada.
 */
function getRotatedSize(
  width: number,
  height: number,
  rotation: number,
): { width: number; height: number } {
  const rad = (getRotation(rotation) * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  return {
    width: width * cos + height * sin,
    height: width * sin + height * cos,
  };
}

/**
 * Recorta una imagen según el área indicada, con soporte de rotación.
 * Retorna un Blob listo para subir.
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: PixelCrop,
  rotation = 0,
  format: OutputFormat = 'jpeg',
  quality = 0.9,
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No se pudo crear el canvas de edición.');
  }

  const rot = getRotation(rotation);
  const originalWidth = image.naturalWidth;
  const originalHeight = image.naturalHeight;

  // Tamaño del canvas = tamaño de la imagen rotada
  const rotated = getRotatedSize(originalWidth, originalHeight, rot);
  canvas.width = rotated.width;
  canvas.height = rotated.height;

  // Mover origen al centro, rotar, dibujar imagen centrada
  ctx.translate(rotated.width / 2, rotated.height / 2);
  ctx.rotate((rot * Math.PI) / 180);
  ctx.drawImage(image, -originalWidth / 2, -originalHeight / 2);

  // Obtener los datos del área recortada del canvas resultante
  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');

  if (!croppedCtx) {
    throw new Error('No se pudo crear el canvas de recorte.');
  }

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  // Exportar a Blob
  return new Promise((resolve, reject) => {
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    croppedCanvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Error al generar la imagen recortada.'));
        }
      },
      mimeType,
      format === 'jpeg' ? quality : undefined,
    );
  });
}

/**
 * Convierte un File a objectURL (para previsualización).
 */
export function fileToObjectURL(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Libera un objectURL para evitar memory leaks.
 */
export function revokeObjectURL(url: string): void {
  URL.revokeObjectURL(url);
}

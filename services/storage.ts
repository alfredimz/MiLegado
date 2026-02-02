// Servicios de Almacenamiento (Migrado a Base64)
// En esta versión, no subimos a Firebase Storage debido a limitaciones de facturación.
// En su lugar, retornamos cadenas Base64 que se guardarán directamente en Firestore.
import * as FileSystem from 'expo-file-system/legacy';

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
}

export interface UploadResult {
  url: string;
  path: string;
}

// Helper para formatear Base64
const formatBase64 = (data: string, type: 'image' | 'video' | 'audio'): string => {
  if (data.startsWith('data:')) return data;

  // Mime types simples
  let mimeString = 'image/jpeg';
  if (type === 'video') mimeString = 'video/mp4';
  if (type === 'audio') mimeString = 'audio/m4a';

  return `data:${mimeString};base64,${data}`;
};

// "Subir" archivo (ahora solo formatea Base64)
// Si recibe una URI, intenta leer el archivo y convertir a Base64.
export async function uploadFile(
  path: string,
  data: string, // Esperamos Base64 string o URI
  onProgress?: (progress: UploadProgress) => void,
  mediaType: 'image' | 'video' | 'audio' = 'image'
): Promise<UploadResult> {
  // Simular progreso
  if (onProgress) {
    onProgress({ bytesTransferred: 50, totalBytes: 100, progress: 50 });
    setTimeout(() => onProgress({ bytesTransferred: 100, totalBytes: 100, progress: 100 }), 100);
  }

  let finalBase64 = data;

  // Si es una URI local, leer el archivo.
  // IMPORTANTE: Evitar confundir un Base64 que empieza con "/" (ej. JPG /9j/...) con un path absoluto.
  // Un path legítimo raramente excederá los 2000 caracteres, mientras que una imagen Base64 siempre lo hará.
  const isFileUri = data.startsWith('file://');
  const isAbsolutePath = data.startsWith('/') && data.length < 2000;

  if (isFileUri || isAbsolutePath) {
    try {
      console.log("Detectada URI local en storage.ts, convirtiendo a Base64...", data.substring(0, 50));
      finalBase64 = await FileSystem.readAsStringAsync(data, {
        encoding: 'base64',
      });
    } catch (error) {
      console.error("Error leyendo archivo para Base64:", error);
      throw new Error("No se pudo leer el archivo local para convertirlo a Base64.");
    }
  }

  const url = formatBase64(finalBase64, mediaType);
  return { url, path };
}

// Subir avatar
export async function uploadUserAvatar(
  userId: string,
  data: string, // Base64
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  const result = await uploadFile(`dummy/path/avatar`, data, onProgress, 'image');
  return result.url;
}

// Subir media de carta
export async function uploadCartaMedia(
  userId: string,
  cartaId: string,
  data: string, // Base64
  mediaType: 'image' | 'video' | 'audio',
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  const result = await uploadFile(`dummy/path/media`, data, onProgress, mediaType);
  return result.url;
}

// Mock getFileUrl
export async function getFileUrl(path: string): Promise<string> {
  // En este esquema, la URL ya es el contenido Base64 guardado en Firestore
  // No hay "path" real resoluble.
  return path;
}

// Mock delete
export async function deleteFile(path: string): Promise<void> {
  // No-op
  return;
}

export async function deleteCartaFiles(userId: string, cartaId: string): Promise<void> {
  // No-op
  return;
}

export default {
  uploadFile,
  uploadUserAvatar,
  uploadCartaMedia,
  getFileUrl,
  deleteFile,
  deleteCartaFiles,
};

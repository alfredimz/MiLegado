// Servicios de Almacenamiento Local
// Guarda archivos multimedia en el sistema de archivos del dispositivo
// Evita límites de Firestore guardando solo localmente
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

// Directorio base para almacenar media de la app
const MEDIA_DIRECTORY = `${FileSystem.documentDirectory}milegado_media/`;

// Asegurar que el directorio existe
async function ensureMediaDirectory(): Promise<void> {
  const dirInfo = await FileSystem.getInfoAsync(MEDIA_DIRECTORY);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(MEDIA_DIRECTORY, { intermediates: true });
  }
}

// Generar nombre único para archivo
function generateFileName(mediaType: 'image' | 'video' | 'audio'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extensions: Record<string, string> = {
    image: 'jpg',
    video: 'mp4',
    audio: 'm4a',
  };
  return `${mediaType}_${timestamp}_${random}.${extensions[mediaType]}`;
}

// Guardar archivo localmente (copiar de URI temporal a directorio permanente)
export async function uploadFile(
  path: string,
  data: string, // URI del archivo (file:// o content://)
  onProgress?: (progress: UploadProgress) => void,
  mediaType: 'image' | 'video' | 'audio' = 'image'
): Promise<UploadResult> {
  await ensureMediaDirectory();

  // Simular progreso inicial
  if (onProgress) {
    onProgress({ bytesTransferred: 10, totalBytes: 100, progress: 10 });
  }

  // Si ya es un data: URI (Base64), guardarlo directamente
  if (data.startsWith('data:')) {
    const fileName = generateFileName(mediaType);
    const destinationPath = `${MEDIA_DIRECTORY}${fileName}`;

    // Extraer el Base64 del data URI
    const base64Data = data.split(',')[1];
    await FileSystem.writeAsStringAsync(destinationPath, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (onProgress) {
      onProgress({ bytesTransferred: 100, totalBytes: 100, progress: 100 });
    }

    return { url: destinationPath, path: destinationPath };
  }

  // Si es una URI de archivo, copiar al directorio de la app
  if (data.startsWith('file://') || data.startsWith('/') || data.startsWith('content://')) {
    const fileName = generateFileName(mediaType);
    const destinationPath = `${MEDIA_DIRECTORY}${fileName}`;

    if (onProgress) {
      onProgress({ bytesTransferred: 30, totalBytes: 100, progress: 30 });
    }

    try {
      await FileSystem.copyAsync({
        from: data,
        to: destinationPath,
      });

      if (onProgress) {
        onProgress({ bytesTransferred: 100, totalBytes: 100, progress: 100 });
      }

      return { url: destinationPath, path: destinationPath };
    } catch (error) {
      console.error('Error copiando archivo:', error);
      // Si falla la copia, retornar la URI original (funcionará mientras el archivo temporal exista)
      return { url: data, path: data };
    }
  }

  // Si no es ninguno de los anteriores, retornar como está
  return { url: data, path: data };
}

// Guardar avatar de usuario
export async function uploadUserAvatar(
  userId: string,
  data: string, // URI o Base64
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  await ensureMediaDirectory();

  const fileName = `avatar_${userId}_${Date.now()}.jpg`;
  const destinationPath = `${MEDIA_DIRECTORY}${fileName}`;

  if (onProgress) {
    onProgress({ bytesTransferred: 30, totalBytes: 100, progress: 30 });
  }

  // Si es Base64 directo (sin prefijo data:)
  if (!data.startsWith('file://') && !data.startsWith('/') && !data.startsWith('data:')) {
    await FileSystem.writeAsStringAsync(destinationPath, data, {
      encoding: FileSystem.EncodingType.Base64,
    });
  } else if (data.startsWith('data:')) {
    const base64Data = data.split(',')[1];
    await FileSystem.writeAsStringAsync(destinationPath, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });
  } else {
    // Es una URI de archivo
    try {
      await FileSystem.copyAsync({
        from: data,
        to: destinationPath,
      });
    } catch (error) {
      console.warn('Error copiando avatar, usando URI original:', error);
      return data;
    }
  }

  if (onProgress) {
    onProgress({ bytesTransferred: 100, totalBytes: 100, progress: 100 });
  }

  return destinationPath;
}

// Guardar media de carta
export async function uploadCartaMedia(
  userId: string,
  cartaId: string,
  data: string, // URI del archivo
  mediaType: 'image' | 'video' | 'audio',
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  const result = await uploadFile(`cartas/${userId}/${cartaId}`, data, onProgress, mediaType);
  return result.url;
}

// Obtener URL de archivo (en este caso, es el mismo path local)
export async function getFileUrl(path: string): Promise<string> {
  // Verificar si el archivo existe
  if (path.startsWith(MEDIA_DIRECTORY)) {
    const fileInfo = await FileSystem.getInfoAsync(path);
    if (fileInfo.exists) {
      return path;
    }
  }
  return path;
}

// Eliminar archivo
export async function deleteFile(path: string): Promise<void> {
  try {
    if (path.startsWith(MEDIA_DIRECTORY)) {
      const fileInfo = await FileSystem.getInfoAsync(path);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(path);
      }
    }
  } catch (error) {
    console.warn('Error eliminando archivo:', error);
  }
}

// Eliminar todos los archivos de una carta
export async function deleteCartaFiles(userId: string, cartaId: string): Promise<void> {
  // En esta implementación, los archivos tienen nombres únicos
  // No hay una forma directa de agruparlos por carta sin un índice
  // Por ahora, no-op (los archivos se limpiarán manualmente si es necesario)
  return;
}

// Limpiar archivos huérfanos (opcional, para mantenimiento)
export async function cleanupOrphanedFiles(): Promise<void> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(MEDIA_DIRECTORY);
    if (dirInfo.exists) {
      const files = await FileSystem.readDirectoryAsync(MEDIA_DIRECTORY);
      console.log(`[Storage] ${files.length} archivos en el directorio de media`);
    }
  } catch (error) {
    console.warn('Error en cleanup:', error);
  }
}

// Obtener tamaño total usado por media
export async function getStorageUsage(): Promise<number> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(MEDIA_DIRECTORY);
    if (!dirInfo.exists) return 0;

    const files = await FileSystem.readDirectoryAsync(MEDIA_DIRECTORY);
    let totalSize = 0;

    for (const file of files) {
      const fileInfo = await FileSystem.getInfoAsync(`${MEDIA_DIRECTORY}${file}`);
      if (fileInfo.exists && 'size' in fileInfo) {
        totalSize += fileInfo.size || 0;
      }
    }

    return totalSize;
  } catch (error) {
    console.warn('Error calculando uso de almacenamiento:', error);
    return 0;
  }
}

export default {
  uploadFile,
  uploadUserAvatar,
  uploadCartaMedia,
  getFileUrl,
  deleteFile,
  deleteCartaFiles,
  cleanupOrphanedFiles,
  getStorageUsage,
};

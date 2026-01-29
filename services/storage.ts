// Servicios de Firebase Storage para MiLegado
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { storage, STORAGE_PATHS } from './firebase';

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number; // 0-100
}

export interface UploadResult {
  url: string;
  path: string;
}

// Subir archivo con progreso
export async function uploadFile(
  path: string,
  uri: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  try {
    // Convertir URI a Blob
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, path);

    if (onProgress) {
      // Upload con seguimiento de progreso
      const uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress({
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              progress: Math.round(progress),
            });
          },
          (error) => {
            reject(handleStorageError(error));
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ url, path });
          }
        );
      });
    } else {
      // Upload simple sin progreso
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      return { url, path };
    }
  } catch (error: any) {
    throw handleStorageError(error);
  }
}

// Subir avatar de usuario
export async function uploadUserAvatar(
  userId: string,
  uri: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  const fileName = `avatar_${Date.now()}.jpg`;
  const path = `${STORAGE_PATHS.USER_AVATARS(userId)}/${fileName}`;

  const result = await uploadFile(path, uri, onProgress);
  return result.url;
}

// Subir media de carta
export async function uploadCartaMedia(
  userId: string,
  cartaId: string,
  uri: string,
  mediaType: 'image' | 'video' | 'audio',
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  const extension = getExtensionForType(mediaType);
  const fileName = `${mediaType}_${Date.now()}.${extension}`;
  const path = `${STORAGE_PATHS.CARTA_MEDIA(userId, cartaId)}/${fileName}`;

  const result = await uploadFile(path, uri, onProgress);
  return result.url;
}

// Obtener URL de descarga
export async function getFileUrl(path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error: any) {
    throw handleStorageError(error);
  }
}

// Eliminar archivo
export async function deleteFile(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error: any) {
    // Ignorar error si el archivo no existe
    if (error.code !== 'storage/object-not-found') {
      throw handleStorageError(error);
    }
  }
}

// Eliminar todos los archivos de una carta
export async function deleteCartaFiles(
  userId: string,
  cartaId: string
): Promise<void> {
  try {
    const folderRef = ref(storage, STORAGE_PATHS.CARTA_MEDIA(userId, cartaId));
    const listResult = await listAll(folderRef);

    const deletePromises = listResult.items.map((item) => deleteObject(item));
    await Promise.all(deletePromises);
  } catch (error: any) {
    throw handleStorageError(error);
  }
}

// Obtener extensión según tipo de media
function getExtensionForType(type: 'image' | 'video' | 'audio'): string {
  switch (type) {
    case 'image':
      return 'jpg';
    case 'video':
      return 'mp4';
    case 'audio':
      return 'm4a';
    default:
      return 'bin';
  }
}

// Manejar errores de Storage
function handleStorageError(error: any): Error {
  const errorMessages: Record<string, string> = {
    'storage/unknown': 'Error desconocido de almacenamiento',
    'storage/object-not-found': 'El archivo no existe',
    'storage/bucket-not-found': 'Bucket de almacenamiento no encontrado',
    'storage/project-not-found': 'Proyecto no encontrado',
    'storage/quota-exceeded': 'Cuota de almacenamiento excedida',
    'storage/unauthenticated': 'Usuario no autenticado',
    'storage/unauthorized': 'No tienes permiso para esta acción',
    'storage/retry-limit-exceeded': 'Tiempo de espera excedido',
    'storage/invalid-checksum': 'El archivo está corrupto',
    'storage/canceled': 'Subida cancelada',
    'storage/invalid-url': 'URL inválida',
    'storage/cannot-slice-blob': 'Error al procesar el archivo',
    'storage/server-file-wrong-size': 'Error de tamaño de archivo',
  };

  const message = errorMessages[error.code] || error.message || 'Error de almacenamiento';
  return new Error(message);
}

export default {
  uploadFile,
  uploadUserAvatar,
  uploadCartaMedia,
  getFileUrl,
  deleteFile,
  deleteCartaFiles,
};

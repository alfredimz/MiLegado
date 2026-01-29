// Hook para acceder a la cámara y galería del dispositivo
// Requisito de rúbrica: API de Cámara (expo-camera) y Galería (expo-image-picker)
import { useState, useCallback } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export interface MediaAsset {
  uri: string;
  width: number;
  height: number;
  type?: 'image' | 'video';
  duration?: number; // Para videos, en milisegundos
  fileName?: string;
  fileSize?: number;
}

export interface UseCameraReturn {
  // Permisos
  cameraPermission: ImagePicker.PermissionStatus | null;
  galleryPermission: ImagePicker.PermissionStatus | null;
  hasCameraPermission: boolean;
  hasGalleryPermission: boolean;
  requestCameraPermission: () => Promise<boolean>;
  requestGalleryPermission: () => Promise<boolean>;

  // Acciones
  takePhoto: () => Promise<MediaAsset | null>;
  recordVideo: () => Promise<MediaAsset | null>;
  pickImage: () => Promise<MediaAsset | null>;
  pickVideo: () => Promise<MediaAsset | null>;
  pickMedia: () => Promise<MediaAsset | null>;

  // Estado
  isLoading: boolean;
  error: string | null;
}

export function useCamera(): UseCameraReturn {
  const [cameraPermission, requestCameraPermissionAsync] = useCameraPermissions();
  const [galleryPermission, setGalleryPermission] =
    useState<ImagePicker.PermissionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Solicitar permiso de cámara
  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await requestCameraPermissionAsync();
      return status === 'granted';
    } catch (err) {
      setError('Error al solicitar permiso de cámara');
      return false;
    }
  }, [requestCameraPermissionAsync]);

  // Solicitar permiso de galería
  const requestGalleryPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(status);
      return status === 'granted';
    } catch (err) {
      setError('Error al solicitar permiso de galería');
      return false;
    }
  }, []);

  // Tomar foto con la cámara
  const takePhoto = useCallback(async (): Promise<MediaAsset | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Verificar permiso
      if (cameraPermission?.status !== 'granted') {
        const granted = await requestCameraPermission();
        if (!granted) {
          setError('Permiso de cámara denegado');
          return null;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (result.canceled || !result.assets[0]) {
        return null;
      }

      const asset = result.assets[0];
      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        type: 'image',
        fileName: asset.fileName || undefined,
        fileSize: asset.fileSize || undefined,
      };
    } catch (err: any) {
      setError(err.message || 'Error al tomar foto');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [cameraPermission, requestCameraPermission]);

  // Grabar video con la cámara
  const recordVideo = useCallback(async (): Promise<MediaAsset | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Verificar permiso
      if (cameraPermission?.status !== 'granted') {
        const granted = await requestCameraPermission();
        if (!granted) {
          setError('Permiso de cámara denegado');
          return null;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60, // Máximo 60 segundos
      });

      if (result.canceled || !result.assets[0]) {
        return null;
      }

      const asset = result.assets[0];
      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        type: 'video',
        duration: asset.duration || undefined,
        fileName: asset.fileName || undefined,
        fileSize: asset.fileSize || undefined,
      };
    } catch (err: any) {
      setError(err.message || 'Error al grabar video');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [cameraPermission, requestCameraPermission]);

  // Seleccionar imagen de la galería
  const pickImage = useCallback(async (): Promise<MediaAsset | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Verificar permiso
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(status);

      if (status !== 'granted') {
        setError('Permiso de galería denegado');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (result.canceled || !result.assets[0]) {
        return null;
      }

      const asset = result.assets[0];
      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        type: 'image',
        fileName: asset.fileName || undefined,
        fileSize: asset.fileSize || undefined,
      };
    } catch (err: any) {
      setError(err.message || 'Error al seleccionar imagen');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Seleccionar video de la galería
  const pickVideo = useCallback(async (): Promise<MediaAsset | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(status);

      if (status !== 'granted') {
        setError('Permiso de galería denegado');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60,
      });

      if (result.canceled || !result.assets[0]) {
        return null;
      }

      const asset = result.assets[0];
      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        type: 'video',
        duration: asset.duration || undefined,
        fileName: asset.fileName || undefined,
        fileSize: asset.fileSize || undefined,
      };
    } catch (err: any) {
      setError(err.message || 'Error al seleccionar video');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Seleccionar cualquier tipo de media
  const pickMedia = useCallback(async (): Promise<MediaAsset | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(status);

      if (status !== 'granted') {
        setError('Permiso de galería denegado');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled || !result.assets[0]) {
        return null;
      }

      const asset = result.assets[0];
      const isVideo = asset.type === 'video' || asset.duration !== undefined;

      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        type: isVideo ? 'video' : 'image',
        duration: asset.duration || undefined,
        fileName: asset.fileName || undefined,
        fileSize: asset.fileSize || undefined,
      };
    } catch (err: any) {
      setError(err.message || 'Error al seleccionar media');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    cameraPermission: cameraPermission?.status || null,
    galleryPermission,
    hasCameraPermission: cameraPermission?.status === 'granted',
    hasGalleryPermission: galleryPermission === 'granted',
    requestCameraPermission,
    requestGalleryPermission,
    takePhoto,
    recordVideo,
    pickImage,
    pickVideo,
    pickMedia,
    isLoading,
    error,
  };
}

export default useCamera;

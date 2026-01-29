// Hook para grabar y reproducir audio
// Requisito de rúbrica: API de Audio (expo-av)
import { useState, useCallback, useRef, useEffect } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';

export interface AudioRecording {
  uri: string;
  duration: number; // en milisegundos
}

export interface UseAudioReturn {
  // Estado de grabación
  isRecording: boolean;
  recordingDuration: number; // en segundos
  canRecord: boolean;

  // Estado de reproducción
  isPlaying: boolean;
  playbackPosition: number; // en milisegundos
  playbackDuration: number; // en milisegundos

  // Acciones de grabación
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<AudioRecording | null>;
  pauseRecording: () => Promise<void>;
  resumeRecording: () => Promise<void>;

  // Acciones de reproducción
  playSound: (uri: string) => Promise<void>;
  pauseSound: () => Promise<void>;
  resumeSound: () => Promise<void>;
  stopSound: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;

  // Permisos
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;

  // Errores
  error: string | null;
}

export function useAudio(): UseAudioReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [canRecord, setCanRecord] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  // Solicitar permisos de audio
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);
      return granted;
    } catch (err) {
      setError('Error al solicitar permiso de micrófono');
      return false;
    }
  }, []);

  // Configurar modo de audio
  const configureAudioMode = useCallback(async (forRecording: boolean) => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: forRecording,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (err) {
      console.error('Error configuring audio mode:', err);
    }
  }, []);

  // Iniciar grabación
  const startRecording = useCallback(async () => {
    setError(null);

    try {
      // Verificar/solicitar permiso
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          setError('Permiso de micrófono denegado');
          return;
        }
      }

      // Detener reproducción si existe
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // Configurar modo de audio para grabación
      await configureAudioMode(true);

      // Crear y comenzar grabación
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setIsRecording(true);
      setRecordingDuration(0);

      // Iniciar contador de duración
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar grabación');
      setIsRecording(false);
    }
  }, [hasPermission, requestPermission, configureAudioMode]);

  // Detener grabación
  const stopRecording = useCallback(async (): Promise<AudioRecording | null> => {
    if (!recordingRef.current) {
      return null;
    }

    try {
      // Detener intervalo de duración
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      // Detener grabación
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      const status = await recordingRef.current.getStatusAsync();

      recordingRef.current = null;
      setIsRecording(false);

      // Restaurar modo de audio
      await configureAudioMode(false);

      if (!uri) {
        setError('No se pudo obtener el archivo de audio');
        return null;
      }

      return {
        uri,
        duration: status.durationMillis || recordingDuration * 1000,
      };
    } catch (err: any) {
      setError(err.message || 'Error al detener grabación');
      setIsRecording(false);
      return null;
    }
  }, [recordingDuration, configureAudioMode]);

  // Pausar grabación
  const pauseRecording = useCallback(async () => {
    if (!recordingRef.current || !isRecording) return;

    try {
      await recordingRef.current.pauseAsync();
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
    } catch (err: any) {
      setError(err.message || 'Error al pausar grabación');
    }
  }, [isRecording]);

  // Reanudar grabación
  const resumeRecording = useCallback(async () => {
    if (!recordingRef.current) return;

    try {
      await recordingRef.current.startAsync();
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Error al reanudar grabación');
    }
  }, []);

  // Callback de estado de reproducción
  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (status.error) {
        setError(`Error de reproducción: ${status.error}`);
      }
      return;
    }

    setIsPlaying(status.isPlaying);
    setPlaybackPosition(status.positionMillis);
    setPlaybackDuration(status.durationMillis || 0);

    if (status.didJustFinish) {
      setIsPlaying(false);
      setPlaybackPosition(0);
    }
  }, []);

  // Reproducir sonido
  const playSound = useCallback(
    async (uri: string) => {
      setError(null);

      try {
        // Detener grabación si existe
        if (recordingRef.current) {
          await stopRecording();
        }

        // Descargar sonido previo si existe
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        // Configurar modo de audio para reproducción
        await configureAudioMode(false);

        // Cargar y reproducir sonido
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );

        soundRef.current = sound;
        setIsPlaying(true);
      } catch (err: any) {
        setError(err.message || 'Error al reproducir audio');
        setIsPlaying(false);
      }
    },
    [stopRecording, configureAudioMode, onPlaybackStatusUpdate]
  );

  // Pausar sonido
  const pauseSound = useCallback(async () => {
    if (!soundRef.current) return;

    try {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } catch (err: any) {
      setError(err.message || 'Error al pausar audio');
    }
  }, []);

  // Reanudar sonido
  const resumeSound = useCallback(async () => {
    if (!soundRef.current) return;

    try {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    } catch (err: any) {
      setError(err.message || 'Error al reanudar audio');
    }
  }, []);

  // Detener sonido
  const stopSound = useCallback(async () => {
    if (!soundRef.current) return;

    try {
      await soundRef.current.stopAsync();
      await soundRef.current.setPositionAsync(0);
      setIsPlaying(false);
      setPlaybackPosition(0);
    } catch (err: any) {
      setError(err.message || 'Error al detener audio');
    }
  }, []);

  // Ir a posición específica
  const seekTo = useCallback(async (position: number) => {
    if (!soundRef.current) return;

    try {
      await soundRef.current.setPositionAsync(position);
      setPlaybackPosition(position);
    } catch (err: any) {
      setError(err.message || 'Error al buscar posición');
    }
  }, []);

  return {
    isRecording,
    recordingDuration,
    canRecord,
    isPlaying,
    playbackPosition,
    playbackDuration,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    playSound,
    pauseSound,
    resumeSound,
    stopSound,
    seekTo,
    hasPermission,
    requestPermission,
    error,
  };
}

export default useAudio;

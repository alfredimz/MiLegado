// Hook para grabar y reproducir audio
// Migrado a expo-audio (expo-av deprecado en SDK 54)
import { useState, useCallback, useEffect, useRef } from 'react';
import {
  useAudioRecorder,
  useAudioRecorderState,
  useAudioPlayer,
  useAudioPlayerStatus,
  RecordingPresets,
  AudioModule,
} from 'expo-audio';

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
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUri, setCurrentUri] = useState<string | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [recordedDuration, setRecordedDuration] = useState(0);

  // Recorder de expo-audio
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 500);

  // Player de expo-audio (null cuando no hay URI)
  const player = useAudioPlayer(currentUri ? { uri: currentUri } : null);
  const playerStatus = useAudioPlayerStatus(player);

  // Solicitar permisos de audio
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      const granted = status.granted;
      setHasPermission(granted);
      return granted;
    } catch (err) {
      setError('Error al solicitar permiso de micrófono');
      return false;
    }
  }, []);

  // Verificar permisos al montar
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const status = await AudioModule.getRecordingPermissionsAsync();
        setHasPermission(status.granted);
      } catch (err) {
        console.error('Error checking audio permission:', err);
      }
    };
    checkPermission();
  }, []);

  // Configurar modo de audio
  useEffect(() => {
    const configureAudio = async () => {
      try {
        await AudioModule.setAudioModeAsync({
          playsInSilentMode: true,
        });
      } catch (err) {
        console.error('Error configuring audio mode:', err);
      }
    };
    configureAudio();
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
      if (player && playerStatus?.playing) {
        player.pause();
      }

      // Preparar y comenzar grabación
      await recorder.prepareToRecordAsync();
      recorder.record();
      setRecordedUri(null);
      setRecordedDuration(0);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar grabación');
    }
  }, [hasPermission, requestPermission, recorder, player, playerStatus]);

  // Detener grabación
  const stopRecording = useCallback(async (): Promise<AudioRecording | null> => {
    try {
      await recorder.stop();
      const uri = recorder.uri;
      const duration = recorderState.durationMillis || 0;

      if (!uri) {
        setError('No se pudo obtener el archivo de audio');
        return null;
      }

      setRecordedUri(uri);
      setRecordedDuration(duration);

      return {
        uri,
        duration,
      };
    } catch (err: any) {
      setError(err.message || 'Error al detener grabación');
      return null;
    }
  }, [recorder, recorderState.durationMillis]);

  // Pausar grabación
  const pauseRecording = useCallback(async () => {
    try {
      recorder.pause();
    } catch (err: any) {
      setError(err.message || 'Error al pausar grabación');
    }
  }, [recorder]);

  // Reanudar grabación
  const resumeRecording = useCallback(async () => {
    try {
      recorder.record();
    } catch (err: any) {
      setError(err.message || 'Error al reanudar grabación');
    }
  }, [recorder]);

  // Reproducir sonido
  const playSound = useCallback(
    async (uri: string) => {
      setError(null);

      try {
        // Si el URI es diferente, actualizar
        if (uri !== currentUri) {
          setCurrentUri(uri);
          // Esperar a que el player se actualice y luego reproducir
          setTimeout(() => {
            player?.play();
          }, 100);
        } else {
          // Reiniciar desde el principio si es el mismo URI
          player?.seekTo(0);
          player?.play();
        }
      } catch (err: any) {
        setError(err.message || 'Error al reproducir audio');
      }
    },
    [currentUri, player]
  );

  // Pausar sonido
  const pauseSound = useCallback(async () => {
    try {
      player?.pause();
    } catch (err: any) {
      setError(err.message || 'Error al pausar audio');
    }
  }, [player]);

  // Reanudar sonido
  const resumeSound = useCallback(async () => {
    try {
      player?.play();
    } catch (err: any) {
      setError(err.message || 'Error al reanudar audio');
    }
  }, [player]);

  // Detener sonido
  const stopSound = useCallback(async () => {
    try {
      player?.pause();
      player?.seekTo(0);
    } catch (err: any) {
      setError(err.message || 'Error al detener audio');
    }
  }, [player]);

  // Ir a posición específica (en milisegundos)
  const seekTo = useCallback(
    async (position: number) => {
      try {
        // expo-audio usa segundos, convertir de ms
        player?.seekTo(position / 1000);
      } catch (err: any) {
        setError(err.message || 'Error al buscar posición');
      }
    },
    [player]
  );

  return {
    // Grabación
    isRecording: recorderState.isRecording,
    recordingDuration: Math.floor((recorderState.durationMillis || 0) / 1000),
    canRecord: hasPermission,

    // Reproducción
    isPlaying: playerStatus?.playing || false,
    playbackPosition: (playerStatus?.currentTime || 0) * 1000, // Convertir a ms
    playbackDuration: (playerStatus?.duration || 0) * 1000, // Convertir a ms

    // Acciones de grabación
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,

    // Acciones de reproducción
    playSound,
    pauseSound,
    resumeSound,
    stopSound,
    seekTo,

    // Permisos
    hasPermission,
    requestPermission,

    // Errores
    error,
  };
}

export default useAudio;

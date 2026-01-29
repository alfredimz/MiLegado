import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Mic, Square, Play, Pause, Trash2 } from 'lucide-react-native';
import { Colors, spacing, borderRadius, typography } from '../../constants';
import { useAudio } from '../../hooks';

export interface AudioRecorderProps {
  onRecordingComplete: (uri: string, duration: number) => void;
  maxDuration?: number; // en segundos
}

export function AudioRecorder({
  onRecordingComplete,
  maxDuration = 120,
}: AudioRecorderProps) {
  const {
    isRecording,
    recordingDuration,
    isPlaying,
    playbackPosition,
    playbackDuration,
    startRecording,
    stopRecording,
    playSound,
    pauseSound,
    resumeSound,
    stopSound,
    error,
  } = useAudio();

  const [recordedUri, setRecordedUri] = React.useState<string | null>(null);
  const [recordedDuration, setRecordedDuration] = React.useState(0);

  // Formatear tiempo
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Formatear tiempo en milisegundos
  const formatTimeMs = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    return formatTime(totalSeconds);
  };

  // Manejar inicio/fin de grabación
  const handleRecordToggle = async () => {
    if (isRecording) {
      const recording = await stopRecording();
      if (recording) {
        setRecordedUri(recording.uri);
        setRecordedDuration(recording.duration);
      }
    } else {
      setRecordedUri(null);
      setRecordedDuration(0);
      await startRecording();
    }
  };

  // Manejar reproducción
  const handlePlayToggle = async () => {
    if (!recordedUri) return;

    if (isPlaying) {
      await pauseSound();
    } else {
      await playSound(recordedUri);
    }
  };

  // Eliminar grabación
  const handleDelete = async () => {
    await stopSound();
    setRecordedUri(null);
    setRecordedDuration(0);
  };

  // Confirmar grabación
  const handleConfirm = () => {
    if (recordedUri) {
      onRecordingComplete(recordedUri, recordedDuration);
    }
  };

  // Verificar si se excedió el tiempo máximo
  React.useEffect(() => {
    if (isRecording && recordingDuration >= maxDuration) {
      stopRecording().then((recording) => {
        if (recording) {
          setRecordedUri(recording.uri);
          setRecordedDuration(recording.duration);
        }
      });
    }
  }, [isRecording, recordingDuration, maxDuration, stopRecording]);

  return (
    <View style={styles.container}>
      {/* Visualización de tiempo */}
      <View style={styles.timeDisplay}>
        {isRecording ? (
          <>
            <View style={styles.recordingIndicator} />
            <Text style={styles.time}>{formatTime(recordingDuration)}</Text>
            <Text style={styles.maxTime}>/ {formatTime(maxDuration)}</Text>
          </>
        ) : recordedUri ? (
          <>
            <Text style={styles.time}>{formatTimeMs(playbackPosition)}</Text>
            <Text style={styles.maxTime}>/ {formatTimeMs(recordedDuration)}</Text>
          </>
        ) : (
          <Text style={styles.instructions}>Toca el micrófono para grabar</Text>
        )}
      </View>

      {/* Barra de progreso */}
      {recordedUri && (
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${(playbackPosition / recordedDuration) * 100}%`,
              },
            ]}
          />
        </View>
      )}

      {/* Controles */}
      <View style={styles.controls}>
        {/* Botón de eliminar (solo si hay grabación) */}
        {recordedUri && !isRecording && (
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleDelete}
          >
            <Trash2 size={24} color={Colors.error} />
          </TouchableOpacity>
        )}

        {/* Botón principal de grabación/reproducción */}
        {!recordedUri || isRecording ? (
          <TouchableOpacity
            style={[
              styles.mainButton,
              isRecording && styles.mainButtonRecording,
            ]}
            onPress={handleRecordToggle}
          >
            {isRecording ? (
              <Square size={32} color={Colors.text} />
            ) : (
              <Mic size={32} color={Colors.text} />
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.mainButton}
            onPress={handlePlayToggle}
          >
            {isPlaying ? (
              <Pause size={32} color={Colors.text} />
            ) : (
              <Play size={32} color={Colors.text} />
            )}
          </TouchableOpacity>
        )}

        {/* Botón de confirmar (solo si hay grabación y no está grabando) */}
        {recordedUri && !isRecording && (
          <TouchableOpacity
            style={[styles.controlButton, styles.confirmButton]}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmText}>Usar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Mensaje de error */}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.error,
    marginRight: spacing.sm,
  },
  time: {
    ...typography.h2,
    color: Colors.text,
  },
  maxTime: {
    ...typography.body,
    color: Colors.textMuted,
    marginLeft: spacing.xs,
  },
  instructions: {
    ...typography.body,
    color: Colors.textSecondary,
  },
  progressContainer: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 2,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButtonRecording: {
    backgroundColor: Colors.error,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: spacing.md,
    width: 'auto',
    borderRadius: borderRadius.lg,
  },
  confirmText: {
    ...typography.button,
    color: Colors.text,
  },
  error: {
    ...typography.caption,
    color: Colors.error,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});

export default AudioRecorder;

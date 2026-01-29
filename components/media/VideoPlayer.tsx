import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Play, Pause, RotateCcw } from 'lucide-react-native';
import { Colors, spacing, borderRadius, typography } from '../../constants';

export interface VideoPlayerProps {
  uri: string;
  poster?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  style?: any;
  onPlaybackStatusUpdate?: (status: AVPlaybackStatus) => void;
}

export function VideoPlayer({
  uri,
  poster,
  autoPlay = false,
  showControls = true,
  style,
  onPlaybackStatusUpdate,
}: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isEnded, setIsEnded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Formatear tiempo
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Manejar actualización de estado
  const handlePlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) {
        setIsLoading(true);
        return;
      }

      setIsLoading(false);
      setIsPlaying(status.isPlaying);
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);

      if (status.didJustFinish) {
        setIsEnded(true);
        setIsPlaying(false);
      }

      onPlaybackStatusUpdate?.(status);
    },
    [onPlaybackStatusUpdate]
  );

  // Toggle play/pause
  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    if (isEnded) {
      await videoRef.current.replayAsync();
      setIsEnded(false);
    } else if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  };

  // Reiniciar video
  const handleReplay = async () => {
    if (!videoRef.current) return;
    await videoRef.current.replayAsync();
    setIsEnded(false);
  };

  return (
    <View style={[styles.container, style]}>
      <Video
        ref={videoRef}
        source={{ uri }}
        posterSource={poster ? { uri: poster } : undefined}
        usePoster={!!poster}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={autoPlay}
        isLooping={false}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        style={styles.video}
      />

      {showControls && (
        <View style={styles.controlsOverlay}>
          {/* Botón central de play/pause */}
          <TouchableOpacity
            style={styles.playButton}
            onPress={handlePlayPause}
            activeOpacity={0.7}
          >
            {isEnded ? (
              <RotateCcw size={32} color={Colors.text} />
            ) : isPlaying ? (
              <Pause size={32} color={Colors.text} />
            ) : (
              <Play size={32} color={Colors.text} />
            )}
          </TouchableOpacity>

          {/* Barra de progreso */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${duration > 0 ? (position / duration) * 100 : 0}%` },
                ]}
              />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>
        </View>
      )}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: Colors.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  progressBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  timeText: {
    ...typography.caption,
    color: Colors.text,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    ...typography.body,
    color: Colors.text,
  },
});

export default VideoPlayer;

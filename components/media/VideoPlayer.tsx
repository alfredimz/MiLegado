import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { Play, Pause, RotateCcw } from 'lucide-react-native';
import { Colors, spacing, borderRadius, typography } from '../../constants';

export interface VideoPlayerProps {
  uri: string;
  poster?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  style?: any;
  onPlaybackStatusUpdate?: (status: { isPlaying: boolean; position: number; duration: number }) => void;
}

export function VideoPlayer({
  uri,
  poster,
  autoPlay = false,
  showControls = true,
  style,
  onPlaybackStatusUpdate,
}: VideoPlayerProps) {
  // Crear player con expo-video
  const player = useVideoPlayer(uri, (player) => {
    player.loop = false;
    if (autoPlay) {
      player.play();
    }
  });

  // Escuchar cambios de estado
  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });

  // Estado de posición y duración
  const [position, setPosition] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [isEnded, setIsEnded] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Monitorear el estado del player
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (player) {
        const currentPos = player.currentTime * 1000; // Convertir a ms
        const totalDuration = player.duration * 1000; // Convertir a ms

        setPosition(currentPos);
        setDuration(totalDuration);
        setIsLoading(false);

        // Detectar si terminó
        if (totalDuration > 0 && currentPos >= totalDuration - 100) {
          setIsEnded(true);
        }

        // Callback para el padre
        onPlaybackStatusUpdate?.({
          isPlaying: player.playing,
          position: currentPos,
          duration: totalDuration,
        });
      }
    }, 250);

    return () => clearInterval(interval);
  }, [player, onPlaybackStatusUpdate]);

  // Formatear tiempo
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle play/pause
  const handlePlayPause = useCallback(() => {
    if (!player) return;

    if (isEnded) {
      player.seekBy(-player.currentTime); // Reiniciar
      player.play();
      setIsEnded(false);
    } else if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }, [player, isPlaying, isEnded]);

  // Reiniciar video
  const handleReplay = useCallback(() => {
    if (!player) return;
    player.seekBy(-player.currentTime);
    player.play();
    setIsEnded(false);
  }, [player]);

  return (
    <View style={[styles.container, style]}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="contain"
        nativeControls={false}
        allowsFullscreen={true}
        allowsPictureInPicture={false}
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
              <RotateCcw size={32} color={Colors.textInverse} />
            ) : isPlaying ? (
              <Pause size={32} color={Colors.textInverse} />
            ) : (
              <Play size={32} color={Colors.textInverse} />
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
    color: Colors.textInverse,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    ...typography.body,
    color: Colors.textInverse,
  },
});

export default VideoPlayer;

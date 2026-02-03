import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { Play, Pause, RotateCcw } from 'lucide-react-native';
import { Colors, spacing } from '../../constants';

export interface AudioPlayerProps {
  uri: string;
  title?: string;
  autoPlay?: boolean;
  style?: any;
}

export function AudioPlayer({
  uri,
  title = 'Mensaje de voz',
  autoPlay = false,
  style,
}: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isEnded, setIsEnded] = useState(false);

  // Cargar audio
  useEffect(() => {
    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [uri]);

  const loadAudio = async () => {
    try {
      setIsLoading(true);

      // Configurar modo de audio
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: autoPlay },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setIsLoading(false);

      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }
    } catch (error) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = useCallback((status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish) {
        setIsEnded(true);
        setIsPlaying(false);
      }
    }
  }, []);

  const handlePlayPause = async () => {
    if (!sound) return;

    if (isEnded) {
      await sound.setPositionAsync(0);
      await sound.playAsync();
      setIsEnded(false);
    } else if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {/* Icono / Botón Play */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlayPause}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          {isLoading ? (
            <Text style={styles.loadingEmoji}>...</Text>
          ) : isEnded ? (
            <RotateCcw size={24} color={Colors.textInverse} />
          ) : isPlaying ? (
            <Pause size={24} color={Colors.textInverse} />
          ) : (
            <Play size={24} color={Colors.textInverse} />
          )}
        </TouchableOpacity>

        {/* Info y progreso */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{title}</Text>

          {/* Barra de progreso */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress}%` },
                ]}
              />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingEmoji: {
    fontSize: 16,
    color: Colors.textInverse,
  },
  infoContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  progressContainer: {
    width: '100%',
  },
  progressBackground: {
    height: 4,
    backgroundColor: Colors.border,
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
    fontSize: 12,
    fontFamily: 'Nunito_300Light',
    color: Colors.textMuted,
  },
});

export default AudioPlayer;

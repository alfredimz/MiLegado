import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing } from '../../constants';
import { Button, Card } from '../../components/ui';
import { Header } from '../../components/layout';
import { VideoPlayer } from '../../components/media';

export default function CrearPreviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const params = useLocalSearchParams<{
    id?: string;
    titulo: string;
    tipo: 'texto' | 'audio' | 'video' | 'foto';
    contenido: string;
    mediaItems?: string;
  }>();

  const [isLoading, setIsLoading] = useState(false);

  const contenido = params.contenido ? JSON.parse(params.contenido) : {};
  const mediaItems = params.mediaItems ? JSON.parse(params.mediaItems) : [];

  const handleContinue = () => {
    router.push({
      pathname: '/crear/asignar',
      params: {
        id: params.id,
        titulo: params.titulo,
        tipo: params.tipo,
        contenido: params.contenido,
        mediaItems: params.mediaItems,
      },
    });
  };

  const renderContent = () => {
    switch (params.tipo) {
      case 'texto':
        return (
          <Card style={styles.card}>
            <Text style={styles.textContent}>{contenido.texto}</Text>
          </Card>
        );

      case 'foto':
        return (
          <View style={styles.mediaContainer}>
            {contenido.texto && (
              <Card style={styles.card}>
                <Text style={styles.textContent}>{contenido.texto}</Text>
              </Card>
            )}
            <View style={styles.imagesGrid}>
              {mediaItems.map((item: any, index: number) => (
                <Image
                  key={index}
                  source={{ uri: item.uri }}
                  style={styles.image}
                />
              ))}
            </View>
          </View>
        );

      case 'video':
        return (
          <View style={styles.mediaContainer}>
            {contenido.texto && (
              <Card style={styles.card}>
                <Text style={styles.textContent}>{contenido.texto}</Text>
              </Card>
            )}
            {mediaItems[0] && (
              <Card padding="none">
                <VideoPlayer uri={mediaItems[0].uri} />
              </Card>
            )}
          </View>
        );

      case 'audio':
        return (
          <View style={styles.mediaContainer}>
            {contenido.texto && (
              <Card style={styles.card}>
                <Text style={styles.textContent}>{contenido.texto}</Text>
              </Card>
            )}
            <Card style={styles.audioCard}>
              <Text style={styles.audioEmoji}>🎤</Text>
              <View style={styles.audioInfo}>
                <Text style={styles.audioTitle}>Mensaje de voz</Text>
                <Text style={styles.audioSubtitle}>Listo para enviar</Text>
              </View>
            </Card>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Vista previa" showBack />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        <Text style={styles.sectionTitle}>{params.titulo}</Text>
        <Text style={styles.subtitle}>
          Así verán tus guardianes este legado
        </Text>

        {renderContent()}

      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          title="Continuar"
          onPress={handleContinue}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'CormorantGaramond_300Light',
    fontWeight: '300',
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_300Light',
    color: Colors.textSecondary,
    marginBottom: spacing.xl,
  },
  card: {
    marginBottom: spacing.md,
  },
  textContent: {
    fontSize: 16,
    fontFamily: 'Nunito_300Light',
    color: Colors.text,
    lineHeight: 24,
  },
  mediaContainer: {
    gap: spacing.md,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  image: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 0, // Paradise Garden: sin border radius
  },
  audioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  audioEmoji: {
    fontSize: 32,
  },
  audioInfo: {
    marginLeft: spacing.md,
  },
  audioTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: Colors.text,
  },
  audioSubtitle: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textMuted,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
});

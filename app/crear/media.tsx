import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Camera, Image as ImageIcon, Mic, Video, Plus, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing, typography, borderRadius } from '../../constants';
import { Button, Input, Card } from '../../components/ui';
import { Header } from '../../components/layout';
import { AudioRecorder, VideoPlayer } from '../../components/media';
import { useAuth } from '../../contexts/AuthContext';
import { useCamera, useAudio, type MediaAsset } from '../../hooks';
import { createCarta } from '../../services/firestore';
import { uploadCartaMedia } from '../../services/storage';

type MediaTipo = 'foto' | 'video' | 'audio';

const TIPO_CONFIG: Record<MediaTipo, { title: string; icon: React.ReactNode }> = {
  foto: {
    title: 'Carta con fotos',
    icon: <ImageIcon size={24} color={Colors.primary} />,
  },
  video: {
    title: 'Video mensaje',
    icon: <Video size={24} color={Colors.error} />,
  },
  audio: {
    title: 'Mensaje de voz',
    icon: <Mic size={24} color={Colors.secondary} />,
  },
};

export default function CrearMediaScreen() {
  const router = useRouter();
  const { tipo = 'foto' } = useLocalSearchParams<{ tipo: MediaTipo }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { takePhoto, recordVideo, pickImage, pickVideo, isLoading: cameraLoading } = useCamera();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mediaItems, setMediaItems] = useState<MediaAsset[]>([]);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const config = TIPO_CONFIG[tipo] || TIPO_CONFIG.foto;

  // Tomar foto o seleccionar de galería
  const handleAddPhoto = async (fromCamera: boolean) => {
    const result = fromCamera ? await takePhoto() : await pickImage();
    if (result) {
      setMediaItems((prev) => [...prev, result]);
    }
  };

  // Grabar o seleccionar video
  const handleAddVideo = async (fromCamera: boolean) => {
    const result = fromCamera ? await recordVideo() : await pickVideo();
    if (result) {
      setMediaItems([result]); // Solo un video a la vez
    }
  };

  // Manejar grabación de audio completada
  const handleAudioRecorded = (uri: string, duration: number) => {
    setAudioUri(uri);
    setAudioDuration(duration);
  };

  // Eliminar media
  const handleRemoveMedia = (index: number) => {
    setMediaItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Eliminar audio
  const handleRemoveAudio = () => {
    setAudioUri(null);
    setAudioDuration(0);
  };

  // Guardar carta
  const handleSave = async () => {
    if (!titulo.trim()) {
      Alert.alert('Error', 'Agrega un título a tu carta');
      return;
    }

    if (tipo === 'audio' && !audioUri) {
      Alert.alert('Error', 'Graba un mensaje de voz');
      return;
    }

    if ((tipo === 'foto' || tipo === 'video') && mediaItems.length === 0) {
      Alert.alert('Error', `Agrega ${tipo === 'foto' ? 'al menos una foto' : 'un video'}`);
      return;
    }

    if (!user) return;

    setIsSaving(true);
    try {
      // Crear carta primero para obtener el ID
      const cartaTipo = tipo === 'foto' ? 'mixta' : tipo;
      const carta = await createCarta(user.uid, {
        titulo: titulo.trim(),
        tipo: cartaTipo,
        contenido: {
          texto: descripcion.trim() || undefined,
        },
      });

      // Subir archivos multimedia
      const uploadPromises: Promise<string>[] = [];

      if (tipo === 'audio' && audioUri) {
        uploadPromises.push(
          uploadCartaMedia(user.uid, carta.id, audioUri, 'audio')
        );
      }

      if (tipo === 'video' && mediaItems[0]) {
        uploadPromises.push(
          uploadCartaMedia(user.uid, carta.id, mediaItems[0].uri, 'video')
        );
      }

      if (tipo === 'foto') {
        for (const item of mediaItems) {
          uploadPromises.push(
            uploadCartaMedia(user.uid, carta.id, item.uri, 'image')
          );
        }
      }

      // Aquí se subirían los archivos y se actualizaría la carta
      // Por ahora solo mostramos éxito

      Alert.alert(
        'Carta creada',
        'Tu carta ha sido creada. Los archivos se están subiendo en segundo plano.',
        [
          {
            text: 'Ver carta',
            onPress: () => router.replace(`/(tabs)/cartas/${carta.id}`),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo crear la carta');
    } finally {
      setIsSaving(false);
    }
  };

  const renderPhotoContent = () => (
    <View style={styles.mediaSection}>
      <Text style={styles.sectionTitle}>Fotos</Text>

      <View style={styles.photosGrid}>
        {mediaItems.map((item, index) => (
          <View key={index} style={styles.photoContainer}>
            <Image source={{ uri: item.uri }} style={styles.photoPreview} />
            <Button
              title=""
              onPress={() => handleRemoveMedia(index)}
              variant="ghost"
              size="sm"
              icon={<X size={16} color={Colors.text} />}
              style={styles.removeButton}
            />
          </View>
        ))}

        {mediaItems.length < 5 && (
          <View style={styles.addPhotoButtons}>
            <Button
              title="Cámara"
              onPress={() => handleAddPhoto(true)}
              variant="outline"
              size="sm"
              icon={<Camera size={16} color={Colors.primary} />}
              loading={cameraLoading}
              style={styles.addButton}
            />
            <Button
              title="Galería"
              onPress={() => handleAddPhoto(false)}
              variant="outline"
              size="sm"
              icon={<ImageIcon size={16} color={Colors.primary} />}
              style={styles.addButton}
            />
          </View>
        )}
      </View>

      <Text style={styles.hint}>Máximo 5 fotos</Text>
    </View>
  );

  const renderVideoContent = () => (
    <View style={styles.mediaSection}>
      <Text style={styles.sectionTitle}>Video</Text>

      {mediaItems[0] ? (
        <View>
          <VideoPlayer uri={mediaItems[0].uri} />
          <Button
            title="Cambiar video"
            onPress={() => setMediaItems([])}
            variant="outline"
            style={styles.changeButton}
          />
        </View>
      ) : (
        <View style={styles.videoButtons}>
          <Card style={styles.videoOption} onPress={() => handleAddVideo(true)}>
            <Video size={32} color={Colors.primary} />
            <Text style={styles.videoOptionText}>Grabar video</Text>
          </Card>
          <Card style={styles.videoOption} onPress={() => handleAddVideo(false)}>
            <ImageIcon size={32} color={Colors.primary} />
            <Text style={styles.videoOptionText}>Seleccionar de galería</Text>
          </Card>
        </View>
      )}

      <Text style={styles.hint}>Máximo 60 segundos</Text>
    </View>
  );

  const renderAudioContent = () => (
    <View style={styles.mediaSection}>
      <Text style={styles.sectionTitle}>Mensaje de voz</Text>

      {audioUri ? (
        <Card style={styles.audioPreview}>
          <Mic size={32} color={Colors.secondary} />
          <View style={styles.audioInfo}>
            <Text style={styles.audioTitle}>Audio grabado</Text>
            <Text style={styles.audioDuration}>
              {Math.floor(audioDuration / 1000)} segundos
            </Text>
          </View>
          <Button
            title="Eliminar"
            onPress={handleRemoveAudio}
            variant="ghost"
            size="sm"
          />
        </Card>
      ) : (
        <AudioRecorder
          onRecordingComplete={handleAudioRecorded}
          maxDuration={120}
        />
      )}

      <Text style={styles.hint}>Máximo 2 minutos</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title={config.title} showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Título de la carta"
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ej: Un mensaje especial para ti"
          maxLength={100}
        />

        <Input
          label="Descripción (opcional)"
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Agrega un mensaje de texto..."
          multiline
          numberOfLines={3}
        />

        {tipo === 'foto' && renderPhotoContent()}
        {tipo === 'video' && renderVideoContent()}
        {tipo === 'audio' && renderAudioContent()}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          title="Crear carta"
          onPress={handleSave}
          loading={isSaving}
          fullWidth
          disabled={!titulo.trim()}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  mediaSection: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: Colors.text,
    marginBottom: spacing.md,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoContainer: {
    position: 'relative',
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.lg,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.error,
    borderRadius: borderRadius.full,
    width: 24,
    height: 24,
    padding: 0,
  },
  addPhotoButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  addButton: {
    flex: 1,
  },
  hint: {
    ...typography.caption,
    color: Colors.textMuted,
    marginTop: spacing.sm,
  },
  videoButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  videoOption: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
  },
  videoOptionText: {
    ...typography.bodySm,
    color: Colors.text,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  changeButton: {
    marginTop: spacing.md,
  },
  audioPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  audioInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  audioTitle: {
    ...typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  audioDuration: {
    ...typography.caption,
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

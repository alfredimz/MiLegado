import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing } from '../../../constants';
import { Button, Card, Badge, Avatar } from '../../../components/ui';
import { Header } from '../../../components/layout';
import { VideoPlayer, AudioPlayer } from '../../../components/media';
import { useAuth } from '../../../contexts/AuthContext';
import {
  getLocalCartas,
  getLocalGuardianes,
  deleteLocalCarta,
} from '../../../services/localStore';
import type { Carta, Guardian, TipoCarta } from '../../../types';

// Emojis para cada tipo
const TIPO_EMOJIS: Record<TipoCarta, string> = {
  texto: '📝',
  audio: '🎤',
  video: '🎬',
  mixta: '📷',
};

export default function CartaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [carta, setCarta] = useState<Carta | null>(null);
  const [guardianes, setGuardianes] = useState<Guardian[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCarta();
  }, [id]);

  const loadCarta = async () => {
    if (!id || !user) return;

    try {
      // Cargar solo desde almacenamiento local
      const [localCartas, localGuardianes] = await Promise.all([
        getLocalCartas(user.uid),
        getLocalGuardianes(user.uid),
      ]);

      const data = localCartas.find(c => c.id === id) || null;
      let allGuardianes: Guardian[] = [];

      if (data?.guardianes.length) {
        allGuardianes = localGuardianes.filter(g => data.guardianes.includes(g.id));
      }

      setCarta(data);
      setGuardianes(allGuardianes);
    } catch (error) {
      console.error('Error loading carta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar carta',
      '¿Estás seguro de que deseas eliminar esta carta? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            if (!id || !user) return;
            try {
              // Eliminar solo localmente
              await deleteLocalCarta(user.uid, id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la carta');
            }
          },
        },
      ]
    );
  };

  if (isLoading || !carta) {
    return (
      <View style={styles.container}>
        <Header title="Cargando..." showBack />
        <View style={styles.loading}>
          <Text style={styles.loadingEmoji}>💓</Text>
          <Text style={styles.loadingText}>Cargando carta...</Text>
        </View>
      </View>
    );
  }

  const formattedDate = new Date(carta.createdAt).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      <Header
        title="Detalle de carta"
        showBack
        rightContent={
          <Button
            title=""
            onPress={handleDelete}
            variant="danger"
            icon={<Text style={styles.deleteIcon}>🗑️</Text>}
          />
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header de la carta */}
        <Card style={styles.headerCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Text style={styles.tipoEmoji}>{TIPO_EMOJIS[carta.tipo]}</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.title}>{carta.titulo}</Text>
              <View style={styles.badges}>
                <Badge
                  label={carta.tipo.charAt(0).toUpperCase() + carta.tipo.slice(1)}
                  variant="primary"
                  size="sm"
                />
                <Badge
                  label={carta.estado.charAt(0).toUpperCase() + carta.estado.slice(1)}
                  variant={
                    carta.estado === 'activa'
                      ? 'success'
                      : carta.estado === 'borrador'
                      ? 'warning'
                      : 'info'
                  }
                  size="sm"
                />
              </View>
            </View>
          </View>

          <View style={styles.dateRow}>
            <Text style={styles.dateIcon}>📅</Text>
            <Text style={styles.dateText}>Creada el {formattedDate}</Text>
          </View>
        </Card>

        {/* Contenido de la carta */}
        <Text style={styles.sectionTitle}>Contenido</Text>

        {/* Texto */}
        {carta.contenido.texto && (
          <Card style={styles.contentCard}>
            <Text style={styles.contentText}>{carta.contenido.texto}</Text>
          </Card>
        )}

        {/* Video */}
        {carta.contenido.videoUrl && (
          <Card style={styles.contentCard} padding="none">
            <VideoPlayer uri={carta.contenido.videoUrl} />
          </Card>
        )}

        {/* Audio */}
        {carta.contenido.audioUrl && (
          <Card style={styles.contentCard} padding="none">
            <AudioPlayer
              uri={carta.contenido.audioUrl}
              title="Mensaje de voz"
            />
          </Card>
        )}

        {/* Imágenes */}
        {carta.contenido.imageUrls && carta.contenido.imageUrls.length > 0 && (
          <Card style={styles.contentCard} padding="sm">
            <View style={styles.imagesGrid}>
              {carta.contenido.imageUrls.map((url, index) => (
                <Image
                  key={index}
                  source={{ uri: url }}
                  style={styles.image}
                />
              ))}
            </View>
          </Card>
        )}

        {/* Guardianes asignados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Guardianes asignados</Text>
            <Text style={styles.sectionEmoji}>👥</Text>
          </View>

          {guardianes.length > 0 ? (
            guardianes.map((guardian) => (
              <Card key={guardian.id} style={styles.guardianCard}>
                <Avatar
                  source={guardian.photoURL}
                  name={guardian.nombre}
                  size="md"
                />
                <View style={styles.guardianInfo}>
                  <Text style={styles.guardianName}>{guardian.nombre}</Text>
                  <Text style={styles.guardianRelacion}>{guardian.relacion}</Text>
                </View>
              </Card>
            ))
          ) : (
            <Card style={styles.emptyGuardianes}>
              <Text style={styles.emptyText}>
                No hay guardianes asignados a esta carta
              </Text>
            </Card>
          )}
        </View>

        {/* Acciones */}
        <View style={styles.actions}>
          <Button
            title="Editar carta"
            onPress={() => router.push({ pathname: '/(tabs)/cartas/editar', params: { id } })}
            variant="primary"
            fullWidth
            icon={<Text style={styles.editIcon}>✏️</Text>}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Nunito_300Light',
    color: Colors.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  headerCard: {
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 0, // Paradise Garden: sin border radius
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipoEmoji: {
    fontSize: 20,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    fontSize: 20,
    fontFamily: 'CormorantGaramond_400Regular',
    fontWeight: '400',
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateIcon: {
    fontSize: 14,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Nunito_300Light',
    color: Colors.textMuted,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionEmoji: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'CormorantGaramond_400Regular',
    fontWeight: '400',
    color: Colors.text,
    marginBottom: spacing.md,
  },
  contentCard: {
    marginBottom: spacing.md,
  },
  contentText: {
    fontSize: 16,
    fontFamily: 'Nunito_300Light',
    color: Colors.text,
    lineHeight: 24,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  audioEmoji: {
    fontSize: 24,
  },
  audioText: {
    fontSize: 16,
    fontFamily: 'Nunito_300Light',
    color: Colors.text,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 0, // Paradise Garden: sin border radius
  },
  guardianCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  guardianInfo: {
    marginLeft: spacing.md,
  },
  guardianName: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    fontWeight: '400',
    color: Colors.text,
  },
  guardianRelacion: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textMuted,
    textTransform: 'capitalize',
  },
  emptyGuardianes: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Nunito_300Light',
    color: Colors.textMuted,
    textAlign: 'center',
  },
  actions: {
    marginTop: spacing.lg,
  },
  deleteIcon: {
    fontSize: 18,
  },
  editIcon: {
    fontSize: 16,
  },
});

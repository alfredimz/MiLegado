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
import { Edit2, Trash2, Users, Calendar, FileText, Mic, Video } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing, typography, borderRadius } from '../../../constants';
import { Button, Card, Badge, Avatar } from '../../../components/ui';
import { Header } from '../../../components/layout';
import { VideoPlayer } from '../../../components/media';
import { useAuth } from '../../../contexts/AuthContext';
import { getCarta, deleteCarta, getGuardian } from '../../../services/firestore';
import type { Carta, Guardian, TipoCarta } from '../../../types';

const TIPO_ICONS: Record<TipoCarta, React.ReactNode> = {
  texto: <FileText size={20} color={Colors.primary} />,
  audio: <Mic size={20} color={Colors.secondary} />,
  video: <Video size={20} color={Colors.error} />,
  mixta: <FileText size={20} color={Colors.info} />,
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
    if (!id) return;

    try {
      const data = await getCarta(id);
      setCarta(data);

      // Cargar guardianes asignados
      if (data?.guardianes.length) {
        const guardianesData = await Promise.all(
          data.guardianes.map((gId) => getGuardian(gId))
        );
        setGuardianes(guardianesData.filter((g): g is Guardian => g !== null));
      }
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
            if (!id) return;
            try {
              await deleteCarta(id);
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
            variant="ghost"
            icon={<Trash2 size={20} color={Colors.error} />}
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
            <View style={styles.iconContainer}>{TIPO_ICONS[carta.tipo]}</View>
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
            <Calendar size={16} color={Colors.textMuted} />
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
          <Card style={styles.contentCard}>
            <View style={styles.audioContainer}>
              <Mic size={24} color={Colors.primary} />
              <Text style={styles.audioText}>
                Mensaje de audio adjunto
              </Text>
            </View>
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
            <Users size={20} color={Colors.textMuted} />
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
            onPress={() => {}}
            variant="primary"
            fullWidth
            icon={<Edit2 size={20} color={Colors.textInverse} />}
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
  loadingText: {
    ...typography.body,
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
    borderRadius: borderRadius.lg,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    ...typography.h3,
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
  dateText: {
    ...typography.bodySm,
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
  sectionTitle: {
    ...typography.h3,
    color: Colors.text,
    marginBottom: spacing.md,
  },
  contentCard: {
    marginBottom: spacing.md,
  },
  contentText: {
    ...typography.body,
    color: Colors.text,
    lineHeight: 24,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  audioText: {
    ...typography.body,
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
    borderRadius: borderRadius.md,
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
    ...typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  guardianRelacion: {
    ...typography.caption,
    color: Colors.textMuted,
    textTransform: 'capitalize',
  },
  emptyGuardianes: {
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  actions: {
    marginTop: spacing.lg,
  },
});

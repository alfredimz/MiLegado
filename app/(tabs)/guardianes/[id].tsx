import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Edit2,
  Trash2,
  Mail,
  Phone,
  CheckCircle,
  FileText,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing, typography, borderRadius } from '../../../constants';
import { Button, Card, Badge, Avatar } from '../../../components/ui';
import { Header } from '../../../components/layout';
import { CartaCard } from '../../../components/cards';
import { useAuth } from '../../../contexts/AuthContext';
import { getGuardian, deleteGuardian, getUserCartas } from '../../../services/firestore';
import type { Guardian, Carta } from '../../../types';

export default function GuardianDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [guardian, setGuardian] = useState<Guardian | null>(null);
  const [cartasAsignadas, setCartasAsignadas] = useState<Carta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGuardian();
  }, [id]);

  const loadGuardian = async () => {
    if (!id || !user) return;

    try {
      const [guardianData, cartasData] = await Promise.all([
        getGuardian(id),
        getUserCartas(user.uid),
      ]);

      setGuardian(guardianData);

      // Filtrar cartas asignadas a este guardián
      if (guardianData) {
        const asignadas = cartasData.filter((c) =>
          c.guardianes.includes(guardianData.id)
        );
        setCartasAsignadas(asignadas);
      }
    } catch (error) {
      console.error('Error loading guardian:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar guardián',
      `¿Estás seguro de que deseas eliminar a ${guardian?.nombre} como guardián? Las cartas asignadas ya no le serán entregadas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            if (!id) return;
            try {
              await deleteGuardian(id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el guardián');
            }
          },
        },
      ]
    );
  };

  const handleEmail = () => {
    if (guardian?.email) {
      Linking.openURL(`mailto:${guardian.email}`);
    }
  };

  const handlePhone = () => {
    if (guardian?.telefono) {
      Linking.openURL(`tel:${guardian.telefono}`);
    }
  };

  if (isLoading || !guardian) {
    return (
      <View style={styles.container}>
        <Header title="Cargando..." showBack />
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Cargando guardián...</Text>
        </View>
      </View>
    );
  }

  const formattedDate = new Date(guardian.createdAt).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      <Header
        title="Detalle de guardián"
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
        {/* Header del guardián */}
        <Card style={styles.headerCard}>
          <View style={styles.profileHeader}>
            <Avatar
              source={guardian.photoURL}
              name={guardian.nombre}
              size="xl"
            />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{guardian.nombre}</Text>
                {guardian.isVerified && (
                  <CheckCircle size={20} color={Colors.success} />
                )}
              </View>
              <Text style={styles.relacion}>{guardian.relacion}</Text>
              <Badge
                label={guardian.isVerified ? 'Verificado' : 'Pendiente'}
                variant={guardian.isVerified ? 'success' : 'warning'}
                size="sm"
              />
            </View>
          </View>

          {/* Información de contacto */}
          <View style={styles.contactSection}>
            <Button
              title={guardian.email}
              onPress={handleEmail}
              variant="outline"
              size="sm"
              icon={<Mail size={16} color={Colors.primary} />}
              fullWidth
              style={styles.contactButton}
            />

            {guardian.telefono && (
              <Button
                title={guardian.telefono}
                onPress={handlePhone}
                variant="outline"
                size="sm"
                icon={<Phone size={16} color={Colors.primary} />}
                fullWidth
                style={styles.contactButton}
              />
            )}
          </View>

          <Text style={styles.addedDate}>
            Agregado el {formattedDate}
          </Text>
        </Card>

        {/* Notas */}
        {guardian.notas && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas</Text>
            <Card>
              <Text style={styles.notasText}>{guardian.notas}</Text>
            </Card>
          </View>
        )}

        {/* Cartas asignadas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cartas asignadas</Text>
            <Badge
              label={`${cartasAsignadas.length}`}
              variant="primary"
              size="sm"
            />
          </View>

          {cartasAsignadas.length > 0 ? (
            cartasAsignadas.map((carta) => (
              <CartaCard
                key={carta.id}
                carta={carta}
                onPress={() => router.push(`/(tabs)/cartas/${carta.id}`)}
              />
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <FileText size={32} color={Colors.textMuted} />
              <Text style={styles.emptyText}>
                No hay cartas asignadas a este guardián
              </Text>
            </Card>
          )}
        </View>

        {/* Acciones */}
        <View style={styles.actions}>
          <Button
            title="Editar guardián"
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    ...typography.h2,
    color: Colors.text,
  },
  relacion: {
    ...typography.body,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
    marginBottom: spacing.xs,
  },
  contactSection: {
    marginBottom: spacing.md,
  },
  contactButton: {
    marginBottom: spacing.sm,
  },
  addedDate: {
    ...typography.caption,
    color: Colors.textMuted,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: Colors.text,
  },
  notasText: {
    ...typography.body,
    color: Colors.text,
    lineHeight: 24,
  },
  emptyCard: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  actions: {
    marginTop: spacing.lg,
  },
});

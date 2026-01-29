import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Plus,
  FileText,
  Heart,
  Battery,
  BatteryCharging,
  BatteryLow,
  Users,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing, typography, borderRadius } from '../../constants';
import { Button, Card, Avatar, Badge } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { useBattery } from '../../hooks';
import { getUserCartas, getUserGuardianes } from '../../services/firestore';
import type { Carta, Guardian } from '../../types';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { percentage, isCharging, isLowBattery } = useBattery();

  const [cartas, setCartas] = useState<Carta[]>([]);
  const [guardianes, setGuardianes] = useState<Guardian[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar datos
  const loadData = async () => {
    if (!user) return;

    try {
      const [cartasData, guardianesData] = await Promise.all([
        getUserCartas(user.uid),
        getUserGuardianes(user.uid),
      ]);
      setCartas(cartasData);
      setGuardianes(guardianesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Estadísticas
  const stats = {
    totalCartas: cartas.length,
    cartasActivas: cartas.filter((c) => c.estado === 'activa').length,
    borradores: cartas.filter((c) => c.estado === 'borrador').length,
    totalGuardianes: guardianes.length,
  };

  // Obtener icono de batería
  const BatteryIcon = isCharging
    ? BatteryCharging
    : isLowBattery
    ? BatteryLow
    : Battery;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xl },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
        />
      }
    >
      {/* Header con saludo */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Hola,</Text>
          <Text style={styles.userName}>{user?.displayName || 'Usuario'}</Text>
        </View>
        <Avatar source={user?.photoURL} name={user?.displayName} size="lg" />
      </View>

      {/* Indicador de batería (Requisito de rúbrica) */}
      <Card style={styles.batteryCard}>
        <View style={styles.batteryContent}>
          <View style={styles.batteryInfo}>
            <BatteryIcon
              size={24}
              color={isLowBattery ? Colors.error : isCharging ? Colors.success : Colors.text}
            />
            <Text style={styles.batteryText}>
              {percentage}%
              {isCharging && ' - Cargando'}
            </Text>
          </View>
          {isLowBattery && (
            <Text style={styles.batteryWarning}>
              Batería baja. Guarda tu trabajo.
            </Text>
          )}
        </View>
      </Card>

      {/* CTA crear carta */}
      <Card style={styles.ctaCard} variant="elevated">
        <View style={styles.ctaContent}>
          <Heart size={32} color={Colors.primary} />
          <View style={styles.ctaText}>
            <Text style={styles.ctaTitle}>Crea tu primer legado</Text>
            <Text style={styles.ctaDescription}>
              Escribe una carta, graba un video o deja un mensaje de voz
            </Text>
          </View>
        </View>
        <Button
          title="Crear carta"
          onPress={() => router.push('/crear')}
          icon={<Plus size={20} color={Colors.textInverse} />}
          fullWidth
          style={styles.ctaButton}
        />
      </Card>

      {/* Estadísticas */}
      <Text style={styles.sectionTitle}>Tu legado</Text>
      <View style={styles.statsGrid}>
        <Card style={styles.statCard} onPress={() => router.push('/(tabs)/cartas')}>
          <FileText size={24} color={Colors.primary} />
          <Text style={styles.statNumber}>{stats.totalCartas}</Text>
          <Text style={styles.statLabel}>Cartas</Text>
        </Card>

        <Card style={styles.statCard} onPress={() => router.push('/(tabs)/cartas')}>
          <View style={styles.statBadge}>
            <Badge label="Activas" variant="success" size="sm" />
          </View>
          <Text style={styles.statNumber}>{stats.cartasActivas}</Text>
          <Text style={styles.statLabel}>Cartas activas</Text>
        </Card>

        <Card style={styles.statCard} onPress={() => router.push('/(tabs)/guardianes')}>
          <Users size={24} color={Colors.secondary} />
          <Text style={styles.statNumber}>{stats.totalGuardianes}</Text>
          <Text style={styles.statLabel}>Guardianes</Text>
        </Card>

        <Card style={styles.statCard} onPress={() => router.push('/(tabs)/cartas')}>
          <View style={styles.statBadge}>
            <Badge label="Borradores" variant="warning" size="sm" />
          </View>
          <Text style={styles.statNumber}>{stats.borradores}</Text>
          <Text style={styles.statLabel}>Borradores</Text>
        </Card>
      </View>

      {/* Acciones rápidas */}
      <Text style={styles.sectionTitle}>Acciones rápidas</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => router.push('/crear')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: `${Colors.primary}20` }]}>
            <FileText size={24} color={Colors.primary} />
          </View>
          <Text style={styles.quickActionText}>Nueva carta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => router.push('/(tabs)/guardianes')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: `${Colors.secondary}20` }]}>
            <Users size={24} color={Colors.secondary} />
          </View>
          <Text style={styles.quickActionText}>Guardianes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    ...typography.body,
    color: Colors.textSecondary,
  },
  userName: {
    ...typography.h2,
    color: Colors.text,
  },
  batteryCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  batteryContent: {
    flexDirection: 'column',
  },
  batteryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  batteryText: {
    ...typography.body,
    color: Colors.text,
  },
  batteryWarning: {
    ...typography.bodySm,
    color: Colors.error,
    marginTop: spacing.xs,
  },
  ctaCard: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  ctaText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  ctaTitle: {
    ...typography.h3,
    color: Colors.text,
  },
  ctaDescription: {
    ...typography.bodySm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  ctaButton: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: Colors.text,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    width: '47%',
    padding: spacing.md,
    alignItems: 'center',
  },
  statBadge: {
    marginBottom: spacing.xs,
  },
  statNumber: {
    ...typography.h1,
    color: Colors.text,
    marginVertical: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: Colors.textMuted,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: borderRadius.xl,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  quickActionText: {
    ...typography.bodySm,
    color: Colors.text,
    fontWeight: '500',
  },
});

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing } from '../../constants';
import { Button, Card, Avatar, Badge } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { useBattery } from '../../hooks';
import { useStorage } from '../../hooks';
import { getLocalCartas, getLocalGuardianes } from '../../services/localStore';
import type { Carta, Guardian } from '../../types';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { percentage, isCharging, isLowBattery } = useBattery();
  const { loadDrafts } = useStorage();

  const [cartas, setCartas] = useState<Carta[]>([]);
  const [guardianes, setGuardianes] = useState<Guardian[]>([]);
  const [localDraftCount, setLocalDraftCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar datos solo desde almacenamiento local
  const loadData = async () => {
    if (!user) return;

    try {
      // Cargar borradores (solo locales)
      const draftsData = await loadDrafts();
      setLocalDraftCount(draftsData ? draftsData.length : 0);

      // Cargar cartas y guardianes desde almacenamiento local
      const [localCartas, localGuardianes] = await Promise.all([
        getLocalCartas(user.uid),
        getLocalGuardianes(user.uid),
      ]);

      setCartas(localCartas);
      setGuardianes(localGuardianes);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Estadísticas
  const stats = {
    totalCartas: cartas.length + localDraftCount,
    cartasActivas: cartas.filter((c) => c.estado === 'activa').length,
    borradores: cartas.filter((c) => c.estado === 'borrador').length + localDraftCount,
    totalGuardianes: guardianes.length,
  };

  // Emoji de batería
  const getBatteryEmoji = () => {
    if (isCharging) return '🔌';
    if (isLowBattery) return '🪫';
    if (percentage > 80) return '🔋';
    if (percentage > 50) return '🔋';
    return '🪫';
  };

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

      {/* Indicador de batería */}
      <Card style={styles.batteryCard}>
        <View style={styles.batteryContent}>
          <View style={styles.batteryInfo}>
            <Text style={styles.batteryEmoji}>{getBatteryEmoji()}</Text>
            <Text style={styles.batteryText}>
              {percentage}%
              {isCharging && ' - Cargando'}
            </Text>
          </View>
          {isLowBattery && (
            <Text style={styles.batteryWarning}>
              ⚠️ Batería baja. Guarda tu trabajo.
            </Text>
          )}
        </View>
      </Card>

      {/* CTA crear carta */}
      <Card style={styles.ctaCard}>
        <View style={styles.ctaContent}>
          <Text style={styles.ctaEmoji}>💓</Text>
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
          icon={<Text style={styles.buttonIcon}>➕</Text>}
          fullWidth
          style={styles.ctaButton}
        />
      </Card>

      {/* Estadísticas */}
      <Text style={styles.sectionTitle}>Tu legado</Text>
      <View style={styles.statsGrid}>
        <Card style={styles.statCard} onPress={() => router.push('/(tabs)/cartas')}>
          <Text style={styles.statEmoji}>📚</Text>
          <Text style={styles.statNumber}>{stats.totalCartas}</Text>
          <Text style={styles.statLabel}>Cartas</Text>
        </Card>

        <Card style={styles.statCard} onPress={() => router.push({ pathname: '/(tabs)/cartas', params: { filter: 'activa' } })}>
          <View style={styles.statBadge}>
            <Badge label="✨ Activas" variant="success" size="sm" />
          </View>
          <Text style={styles.statNumber}>{stats.cartasActivas}</Text>
          <Text style={styles.statLabel}>Cartas activas</Text>
        </Card>

        <Card style={styles.statCard} onPress={() => router.push('/(tabs)/guardianes')}>
          <Text style={styles.statEmoji}>👥</Text>
          <Text style={styles.statNumber}>{stats.totalGuardianes}</Text>
          <Text style={styles.statLabel}>Guardianes</Text>
        </Card>

        <Card style={styles.statCard} onPress={() => router.push({ pathname: '/(tabs)/cartas', params: { filter: 'borrador' } })}>
          <View style={styles.statBadge}>
            <Badge label="📋 Borradores" variant="warning" size="sm" />
          </View>
          <Text style={styles.statNumber}>{stats.borradores}</Text>
          <Text style={styles.statLabel}>Borradores</Text>
        </Card>
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
    fontSize: 16,
    fontFamily: 'Nunito_300Light',
    color: Colors.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'CormorantGaramond_300Light',
    fontWeight: '300',
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
  batteryEmoji: {
    fontSize: 20,
  },
  batteryText: {
    fontSize: 16,
    fontFamily: 'Nunito_300Light',
    color: Colors.text,
  },
  batteryWarning: {
    fontSize: 14,
    fontFamily: 'Nunito_300Light',
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
  ctaEmoji: {
    fontSize: 32,
  },
  ctaText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  ctaTitle: {
    fontSize: 20,
    fontFamily: 'CormorantGaramond_400Regular',
    fontWeight: '400',
    color: Colors.text,
  },
  ctaDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_300Light',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  ctaButton: {
    marginTop: spacing.sm,
  },
  buttonIcon: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'CormorantGaramond_400Regular',
    fontWeight: '400',
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
  statEmoji: {
    fontSize: 24,
  },
  statBadge: {
    marginBottom: spacing.xs,
  },
  statNumber: {
    fontSize: 32,
    fontFamily: 'CormorantGaramond_300Light',
    fontWeight: '300',
    color: Colors.text,
    marginVertical: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textMuted,
  },
});

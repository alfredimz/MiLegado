import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Plus, Filter, FileText } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing, typography, borderRadius } from '../../../constants';
import { Button, Badge } from '../../../components/ui';
import { Header, EmptyState } from '../../../components/layout';
import { CartaCard } from '../../../components/cards';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserCartas } from '../../../services/firestore';
import type { Carta, TipoCarta, EstadoCarta } from '../../../types';

type FilterType = 'todos' | TipoCarta | EstadoCarta;

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'texto', label: 'Texto' },
  { key: 'audio', label: 'Audio' },
  { key: 'video', label: 'Video' },
  { key: 'activa', label: 'Activas' },
  { key: 'borrador', label: 'Borradores' },
];

export default function CartasScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [cartas, setCartas] = useState<Carta[]>([]);
  const [filteredCartas, setFilteredCartas] = useState<Carta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');

  // Cargar cartas
  const loadCartas = async () => {
    if (!user) return;

    try {
      const data = await getUserCartas(user.uid);
      setCartas(data);
      applyFilter(activeFilter, data);
    } catch (error) {
      console.error('Error loading cartas:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      loadCartas();
    }, [user])
  );

  // Aplicar filtro
  const applyFilter = (filter: FilterType, data: Carta[] = cartas) => {
    setActiveFilter(filter);

    if (filter === 'todos') {
      setFilteredCartas(data);
    } else if (['texto', 'audio', 'video', 'mixta'].includes(filter)) {
      setFilteredCartas(data.filter((c) => c.tipo === filter));
    } else if (['borrador', 'activa', 'entregada'].includes(filter)) {
      setFilteredCartas(data.filter((c) => c.estado === filter));
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCartas();
  };

  const handleCartaPress = (carta: Carta) => {
    router.push(`/(tabs)/cartas/${carta.id}`);
  };

  const renderFilter = ({ item }: { item: (typeof FILTERS)[0] }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === item.key && styles.filterButtonActive,
      ]}
      onPress={() => applyFilter(item.key)}
    >
      <Text
        style={[
          styles.filterText,
          activeFilter === item.key && styles.filterTextActive,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderCarta = ({ item }: { item: Carta }) => (
    <CartaCard
      carta={item}
      onPress={() => handleCartaPress(item)}
    />
  );

  const renderEmpty = () => (
    <EmptyState
      icon={<FileText size={48} color={Colors.textMuted} />}
      title="No tienes cartas"
      description="Crea tu primera carta para empezar a construir tu legado digital"
      actionLabel="Crear carta"
      onAction={() => router.push('/crear')}
    />
  );

  return (
    <View style={styles.container}>
      <Header
        title="Mi Legado"
        rightContent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/crear')}
          >
            <Plus size={24} color={Colors.text} />
          </TouchableOpacity>
        }
      />

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={FILTERS}
          renderItem={renderFilter}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Lista de cartas */}
      <FlatList
        data={filteredCartas}
        renderItem={renderCarta}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={!isLoading ? renderEmpty : null}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: Colors.surface,
    marginRight: spacing.sm,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    ...typography.bodySm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: Colors.textInverse,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    flexGrow: 1,
  },
});

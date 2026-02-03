import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing } from '../../../constants';
import { Header, EmptyState } from '../../../components/layout';
import { CartaCard } from '../../../components/cards';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserCartas, deleteCarta } from '../../../services/firestore';
import { getLocalCartas, setLocalCartas, deleteLocalCarta } from '../../../services/localStore';
import { useStorage } from '../../../hooks';
import type { Carta, TipoCarta, EstadoCarta, CartaDraft } from '../../../types';

type FilterType = 'todos' | TipoCarta | EstadoCarta;

const FILTERS: { key: FilterType; label: string; emoji: string }[] = [
  { key: 'todos', label: 'Todos', emoji: '📋' },
  { key: 'texto', label: 'Texto', emoji: '📝' },
  { key: 'audio', label: 'Audio', emoji: '🎤' },
  { key: 'video', label: 'Video', emoji: '🎬' },
  { key: 'activa', label: 'Activas', emoji: '✨' },
  { key: 'borrador', label: 'Borradores', emoji: '📄' },
];

export default function CartasScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filter?: FilterType }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { drafts, loadDrafts, deleteDraft } = useStorage();

  const [cartas, setCartas] = useState<Carta[]>([]);
  const [filteredCartas, setFilteredCartas] = useState<Carta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');

  // Cargar cartas
  const loadCartas = async (targetFilter?: FilterType) => {
    if (!user) return;

    try {
      const loadedDrafts = await loadDrafts();

      // Intentar cargar desde Firebase
      let remoteCartas: Carta[] = [];
      try {
        remoteCartas = await getUserCartas(user.uid);
        // Actualizar cache local con datos de Firebase
        await setLocalCartas(user.uid, remoteCartas);
      } catch (firebaseError) {
        console.warn('Firebase no disponible, usando datos locales:', firebaseError);
        // Fallback: cargar desde almacenamiento local
        remoteCartas = await getLocalCartas(user.uid);
      }

      const localCartas: Carta[] = (loadedDrafts || []).map((draft: CartaDraft) => ({
        id: draft.id,
        userId: user.uid,
        titulo: draft.titulo,
        tipo: draft.tipo,
        contenido: draft.contenido,
        guardianes: draft.guardianes,
        estado: 'borrador' as const,
        createdAt: new Date(draft.lastModified),
        updatedAt: new Date(draft.lastModified),
      }));

      const allCartas = [...localCartas, ...remoteCartas].sort((a, b) =>
        b.updatedAt.getTime() - a.updatedAt.getTime()
      );

      setCartas(allCartas);

      const filterToApply = targetFilter || activeFilter;
      applyFilter(filterToApply, allCartas);

      if (targetFilter) setActiveFilter(targetFilter);

    } catch (error) {
      console.error('Error loading cartas:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const initFilter = params.filter as FilterType;
      if (initFilter && ['todos', 'texto', 'audio', 'video', 'mixta', 'activa', 'borrador'].includes(initFilter)) {
        loadCartas(initFilter);
      } else {
        loadCartas();
      }
    }, [user, params.filter])
  );

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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCartas();
  };

  const handleDelete = async (carta: Carta) => {
    Alert.alert(
      "Eliminar Carta",
      "¿Estás seguro de que deseas eliminar esta carta? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              if (carta.id.startsWith('draft_')) {
                await deleteDraft(carta.id);
              } else if (carta.id.startsWith('local_')) {
                // Carta guardada localmente
                if (user) {
                  await deleteLocalCarta(user.uid, carta.id);
                }
              } else {
                // Intentar eliminar en Firebase, si falla eliminar localmente
                try {
                  await deleteCarta(carta.id);
                } catch (firebaseError) {
                  console.warn('Firebase no disponible, eliminando localmente:', firebaseError);
                  if (user) {
                    await deleteLocalCarta(user.uid, carta.id);
                  }
                }
              }
              loadCartas();
            } catch (error) {
              console.error("Error deleting carta:", error);
              Alert.alert("Error", "No se pudo eliminar la carta.");
            }
          }
        }
      ]
    );
  };

  const handleEdit = (carta: Carta) => {
    const isDraft = carta.id.startsWith('draft_');
    const draft = isDraft ? drafts.find(d => d.id === carta.id) : null;
    const contenidoSource = draft ? draft.contenido : carta.contenido;

    let mediaItems: any[] = [];

    if (contenidoSource.imageUrls) {
      mediaItems.push(...contenidoSource.imageUrls.map(url => ({ uri: url, type: 'image' })));
    }
    if (contenidoSource.videoUrl) {
      mediaItems.push({ uri: contenidoSource.videoUrl, type: 'video' });
    }
    if (contenidoSource.audioUrl) {
      mediaItems.push({ uri: contenidoSource.audioUrl, type: 'audio' });
    }

    router.push({
      pathname: '/crear/preview',
      params: {
        id: carta.id,
        titulo: carta.titulo,
        tipo: carta.tipo,
        contenido: JSON.stringify(contenidoSource),
        mediaItems: JSON.stringify(mediaItems),
      }
    });
  };

  const handleCartaPress = (carta: Carta) => {
    if (carta.id.startsWith('draft_')) {
      handleEdit(carta);
    } else {
      router.push(`/(tabs)/cartas/${carta.id}`);
    }
  };

  const handleOptionsPress = (carta: Carta) => {
    const canEdit = carta.estado !== 'entregada';

    const options: { text: string, style?: 'default' | 'cancel' | 'destructive', onPress?: () => void }[] = [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => handleDelete(carta)
      }
    ];

    if (canEdit) {
      options.push({
        text: "Editar",
        style: "default",
        onPress: () => handleEdit(carta)
      });
    }

    Alert.alert(
      "Opciones",
      `¿Qué deseas hacer con "${carta.titulo}"?`,
      // @ts-ignore
      options
    );
  };

  const renderFilter = ({ item }: { item: (typeof FILTERS)[0] }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === item.key && styles.filterButtonActive,
      ]}
      onPress={() => applyFilter(item.key)}
    >
      <Text style={styles.filterEmoji}>{item.emoji}</Text>
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
      onOptionsPress={() => handleOptionsPress(item)}
    />
  );

  const renderEmpty = () => (
    <EmptyState
      icon="📚"
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
            <Text style={styles.addIcon}>➕</Text>
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
    borderRadius: 0, // Paradise Garden: sin border radius
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 0, // Paradise Garden: sin border radius
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  filterButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  filterEmoji: {
    fontSize: 14,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.primary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    flexGrow: 1,
  },
});

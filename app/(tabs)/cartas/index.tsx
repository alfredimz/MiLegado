import React, { useState, useEffect, useCallback } from 'react';
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
import { Plus, Filter, FileText } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing, typography, borderRadius } from '../../../constants';
import { Button, Badge } from '../../../components/ui';
import { Header, EmptyState } from '../../../components/layout';
import { CartaCard } from '../../../components/cards';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserCartas, deleteCarta } from '../../../services/firestore';
import { useStorage } from '../../../hooks';
import type { Carta, TipoCarta, EstadoCarta, CartaDraft } from '../../../types';

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
      // Cargar borradores locales y obtenerlos directamente
      const loadedDrafts = await loadDrafts();

      const remoteCartas = await getUserCartas(user.uid);

      // Convertir drafts a formato Carta para la UI
      const localCartas: Carta[] = (loadedDrafts || []).map((draft: CartaDraft) => ({
        id: draft.id,
        userId: user.uid,
        titulo: draft.titulo,
        tipo: draft.tipo,
        contenido: draft.contenido,
        guardianes: draft.guardianes,
        estado: 'borrador',
        createdAt: new Date(draft.lastModified),
        updatedAt: new Date(draft.lastModified),
      }));

      // Unir listas
      const allCartas = [...localCartas, ...remoteCartas].sort((a, b) =>
        b.updatedAt.getTime() - a.updatedAt.getTime()
      );

      setCartas(allCartas);

      // Aplicar filtro: prioridad a targetFilter (param), luego estado actual
      const filterToApply = targetFilter || activeFilter;
      applyFilter(filterToApply, allCartas);

      // Si cambiamos por parametro, actualizar estado visual del filtro
      if (targetFilter) setActiveFilter(targetFilter);

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
      // Checar si hay param nuevo para forzar filtro
      const initFilter = params.filter as FilterType;
      if (initFilter && ['todos', 'texto', 'audio', 'video', 'mixta', 'activa', 'borrador'].includes(initFilter)) {
        loadCartas(initFilter);
        // Limpiar param para que futuras navegaciones back no reseteen? 
        // setParams no disponible directamente aqui facil sin rerender loops.
        // Asumimos que si navega de nuevo desde home, se pasará param.
      } else {
        loadCartas();
      }
    }, [user, params.filter]) // Re-run when filter param changes
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
              } else {
                await deleteCarta(carta.id);
              }
              loadCartas(); // Reload list
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
    // Para drafts, buscar en state local si es posible para tener data fresca
    // Para firestore, usamos la carta que viene por props que ya tiene info completa (excepto quizas contenido muy largo si fuera paginado)
    const isDraft = carta.id.startsWith('draft_');
    const draft = isDraft ? drafts.find(d => d.id === carta.id) : null;

    // Preparar contenido
    // Si es draft, usamos draft.contenido. Si es Carta, carta.contenido.
    const contenidoSource = draft ? draft.contenido : carta.contenido;

    // Preparar mediaItems
    // Carta tiene urls en image/video/audioUrl. Preview espera { uri, type }.
    let mediaItems: any[] = [];

    if (contenidoSource.imageUrls) {
      mediaItems.push(...contenidoSource.imageUrls.map(url => ({ uri: url, type: 'image' })));
    }
    // Nota: audioUrl y videoUrl en el modelo actual son campos separados en contenido,
    // pero Preview espera que si es video, venga en mediaItems?
    // Revisando Preview:
    // case 'video': usa mediaItems[0]
    // case 'foto': usa mediaItems.map
    // case 'audio': NO usa mediaItems, usa style hardcoded. (Wait, Preview audio renderContent doesnt use mediaItems params?)
    // Verificando preview.tsx: "case 'audio': returns Card..." static text.
    // Bueno, pasaremos los datos de todos modos.

    if (contenidoSource.videoUrl) {
      mediaItems.push({ uri: contenidoSource.videoUrl, type: 'video' });
    }
    if (contenidoSource.audioUrl) {
      mediaItems.push({ uri: contenidoSource.audioUrl, type: 'audio' });
    }

    router.push({
      pathname: '/crear/preview',
      params: {
        id: carta.id, // Pasamos ID para que al finalizar se sepa que es update
        titulo: carta.titulo,
        tipo: carta.tipo,
        contenido: JSON.stringify(contenidoSource),
        mediaItems: JSON.stringify(mediaItems),
      }
    });
  };

  const handleCartaPress = (carta: Carta) => {
    // Si es un borrador local, ir a editar
    if (carta.id.startsWith('draft_')) {
      handleEdit(carta);
    } else {
      // Si es de firestore, ir a detalle
      router.push(`/(tabs)/cartas/${carta.id}`);
    }
  };

  const handleOptionsPress = (carta: Carta) => {
    // Permitir editar a todos (Borradores y Activas)
    // Restricción: 'entregada' quizás no debería editarse?
    // Por ahora habilitamos para 'activa' y 'borrador'.
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

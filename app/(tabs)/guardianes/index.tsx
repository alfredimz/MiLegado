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
import { useRouter, useFocusEffect } from 'expo-router';
import { Plus, Users, UserPlus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing, typography, borderRadius } from '../../../constants';
import { Button, Input } from '../../../components/ui';
import { Header, EmptyState } from '../../../components/layout';
import { GuardianCard } from '../../../components/cards';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserGuardianes, createGuardian, getUserCartas } from '../../../services/firestore';
import type { Guardian, CreateGuardianData, RelacionGuardian, Carta } from '../../../types';
import { RELACION_OPTIONS } from '../../../types/guardian';

export default function GuardianesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [guardianes, setGuardianes] = useState<Guardian[]>([]);
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [relacion, setRelacion] = useState<RelacionGuardian>('otro');
  const [isSaving, setIsSaving] = useState(false);

  // Cargar guardianes
  const loadGuardianes = async () => {
    if (!user) return;

    try {
      const [guardianesData, cartasData] = await Promise.all([
        getUserGuardianes(user.uid),
        getUserCartas(user.uid),
      ]);
      setGuardianes(guardianesData);
      setCartas(cartasData);
    } catch (error) {
      console.error('Error loading guardianes:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGuardianes();
    }, [user])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadGuardianes();
  };

  // Contar cartas asignadas a un guardián
  const getCartasAsignadas = (guardianId: string): number => {
    return cartas.filter((c) => c.guardianes.includes(guardianId)).length;
  };

  const handleGuardianPress = (guardian: Guardian) => {
    router.push(`/(tabs)/guardianes/${guardian.id}`);
  };

  // Guardar nuevo guardián
  const handleSaveGuardian = async () => {
    if (!user) return;

    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Ingresa un correo electrónico válido');
      return;
    }

    setIsSaving(true);
    try {
      const data: CreateGuardianData = {
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        telefono: telefono.trim() || undefined,
        relacion,
      };

      await createGuardian(user.uid, data);

      // Limpiar form
      setNombre('');
      setEmail('');
      setTelefono('');
      setRelacion('otro');
      setShowAddForm(false);

      // Recargar lista
      loadGuardianes();

      Alert.alert('Guardián agregado', `${nombre} ha sido agregado como guardián`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo agregar el guardián');
    } finally {
      setIsSaving(false);
    }
  };

  const renderGuardian = ({ item }: { item: Guardian }) => (
    <GuardianCard
      guardian={item}
      onPress={() => handleGuardianPress(item)}
      cartasAsignadas={getCartasAsignadas(item.id)}
    />
  );

  const renderEmpty = () => (
    <EmptyState
      icon={<Users size={48} color={Colors.textMuted} />}
      title="No tienes guardianes"
      description="Agrega a las personas que recibirán tus cartas cuando llegue el momento"
      actionLabel="Agregar guardián"
      onAction={() => setShowAddForm(true)}
    />
  );

  const renderAddForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Nuevo guardián</Text>

      <Input
        label="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre del guardián"
        autoCapitalize="words"
      />

      <Input
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        placeholder="correo@ejemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        label="Teléfono (opcional)"
        value={telefono}
        onChangeText={setTelefono}
        placeholder="+52 55 1234 5678"
        keyboardType="phone-pad"
      />

      <Text style={styles.labelRelacion}>Relación</Text>
      <View style={styles.relacionGrid}>
        {RELACION_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.relacionOption,
              relacion === option.value && styles.relacionOptionActive,
            ]}
            onPress={() => setRelacion(option.value)}
          >
            <Text
              style={[
                styles.relacionText,
                relacion === option.value && styles.relacionTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.formButtons}>
        <Button
          title="Cancelar"
          onPress={() => {
            setShowAddForm(false);
            setNombre('');
            setEmail('');
            setTelefono('');
            setRelacion('otro');
          }}
          variant="outline"
          style={styles.formButton}
        />
        <Button
          title="Guardar"
          onPress={handleSaveGuardian}
          loading={isSaving}
          style={styles.formButton}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Guardianes"
        rightContent={
          !showAddForm && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddForm(true)}
            >
              <UserPlus size={24} color={Colors.text} />
            </TouchableOpacity>
          )
        }
      />

      {showAddForm ? (
        renderAddForm()
      ) : (
        <FlatList
          data={guardianes}
          renderItem={renderGuardian}
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
      )}
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
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  formTitle: {
    ...typography.h2,
    color: Colors.text,
    marginBottom: spacing.lg,
  },
  labelRelacion: {
    ...typography.bodySm,
    color: Colors.text,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  relacionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  relacionOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  relacionOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  relacionText: {
    ...typography.bodySm,
    color: Colors.textSecondary,
  },
  relacionTextActive: {
    color: Colors.textInverse,
    fontWeight: '600',
  },
  formButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  formButton: {
    flex: 1,
  },
});

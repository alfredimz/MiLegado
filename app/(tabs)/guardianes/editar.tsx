import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing } from '../../../constants';
import { Button, Input, Avatar } from '../../../components/ui';
import { Header } from '../../../components/layout';
import { useAuth } from '../../../contexts/AuthContext';
import { getLocalGuardianes, saveLocalGuardian } from '../../../services/localStore';
import type { Guardian, RelacionGuardian } from '../../../types';
import { RELACION_OPTIONS } from '../../../types/guardian';

export default function EditarGuardianScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [guardian, setGuardian] = useState<Guardian | null>(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [relacion, setRelacion] = useState<RelacionGuardian>('otro');
  const [notas, setNotas] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ nombre?: string; email?: string }>({});

  useEffect(() => {
    loadGuardian();
  }, [id]);

  const loadGuardian = async () => {
    if (!id || !user) return;

    try {
      // Cargar solo desde almacenamiento local
      const localGuardianes = await getLocalGuardianes(user.uid);
      const data = localGuardianes.find(g => g.id === id) || null;

      if (data) {
        setGuardian(data);
        setNombre(data.nombre);
        setEmail(data.email || '');
        setTelefono(data.telefono || '');
        setRelacion(data.relacion);
        setNotas(data.notas || '');
      }
    } catch (error) {
      console.error('Error loading guardian:', error);
      Alert.alert('Error', 'No se pudo cargar el guardián');
    } finally {
      setIsLoading(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    if (!id || !user || !guardian) return;

    setIsSaving(true);
    try {
      // Preparar el guardián actualizado
      const updatedGuardian: Guardian = {
        ...guardian,
        nombre: nombre.trim(),
        email: email.trim().toLowerCase() || undefined,
        telefono: telefono.trim() || undefined,
        relacion,
        notas: notas.trim() || undefined,
        updatedAt: new Date(),
      };

      // Guardar solo localmente
      await saveLocalGuardian(user.uid, updatedGuardian);

      Alert.alert(
        'Guardián actualizado',
        'Los cambios han sido guardados exitosamente.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      console.error('Error actualizando guardián:', error);
      Alert.alert('Error', error.message || 'No se pudo actualizar el guardián');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Editar Guardián" showBack />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingEmoji}>💓</Text>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </View>
    );
  }

  if (!guardian) {
    return (
      <View style={styles.container}>
        <Header title="Error" showBack />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingEmoji}>⚠️</Text>
          <Text style={styles.loadingText}>Guardián no encontrado</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title="Editar Guardián" showBack />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <Avatar
            source={guardian.photoURL}
            name={nombre}
            size="xl"
          />
        </View>

        <View style={styles.form}>
          <Input
            label="Nombre completo *"
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre del guardián"
            autoCapitalize="words"
            error={errors.nombre}
            leftIcon={<Text style={styles.inputIcon}>👤</Text>}
          />

          <Input
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            placeholder="correo@ejemplo.com (opcional)"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            leftIcon={<Text style={styles.inputIcon}>✉️</Text>}
          />

          <Input
            label="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            placeholder="+52 55 1234 5678 (opcional)"
            keyboardType="phone-pad"
            leftIcon={<Text style={styles.inputIcon}>📱</Text>}
          />

          <View style={styles.relacionSection}>
            <Text style={styles.relacionLabel}>Relación *</Text>
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
          </View>

          <Input
            label="Notas"
            value={notas}
            onChangeText={setNotas}
            placeholder="Información adicional (opcional)"
            multiline
            numberOfLines={3}
            leftIcon={<Text style={styles.inputIcon}>📝</Text>}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          title="Guardar Cambios"
          onPress={handleSave}
          loading={isSaving}
          fullWidth
          disabled={!nombre.trim()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.sm,
  },
  inputIcon: {
    fontSize: 18,
  },
  relacionSection: {
    marginBottom: spacing.md,
  },
  relacionLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    fontWeight: '400',
    color: Colors.text,
    marginBottom: spacing.sm,
  },
  relacionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  relacionOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 0,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  relacionOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  relacionText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textSecondary,
  },
  relacionTextActive: {
    color: Colors.primary,
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

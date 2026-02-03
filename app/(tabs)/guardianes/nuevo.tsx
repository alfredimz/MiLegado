import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing } from '../../../constants';
import { Button, Input } from '../../../components/ui';
import { Header } from '../../../components/layout';
import { useAuth } from '../../../contexts/AuthContext';
import { createGuardian } from '../../../services/firestore';
import type { CreateGuardianData, RelacionGuardian } from '../../../types';
import { RELACION_OPTIONS } from '../../../types/guardian';

export default function NuevoGuardianScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [relacion, setRelacion] = useState<RelacionGuardian>('otro');
  const [notas, setNotas] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ nombre?: string; email?: string }>({});

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
    if (!user) return;

    setIsSaving(true);
    try {
      const data: CreateGuardianData = {
        nombre: nombre.trim(),
        email: email.trim().toLowerCase() || undefined,
        telefono: telefono.trim() || undefined,
        relacion,
        notas: notas.trim() || undefined,
      };

      await createGuardian(user.uid, data);

      Alert.alert(
        'Guardián agregado',
        `${nombre} ha sido agregado como guardián exitosamente.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      console.error('Error creando guardián:', error);
      Alert.alert('Error', error.message || 'No se pudo agregar el guardián');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title="Nuevo Guardián" showBack />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introSection}>
          <Text style={styles.introEmoji}>👥</Text>
          <Text style={styles.introTitle}>Agrega un guardián</Text>
          <Text style={styles.introText}>
            Los guardianes son las personas de confianza que recibirán tus cartas
            cuando llegue el momento.
          </Text>
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
          title="Guardar Guardián"
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  introSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    padding: spacing.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  introEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  introTitle: {
    fontSize: 24,
    fontFamily: 'CormorantGaramond_300Light',
    fontWeight: '300',
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  introText: {
    fontSize: 14,
    fontFamily: 'Nunito_300Light',
    color: Colors.textSecondary,
    textAlign: 'center',
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

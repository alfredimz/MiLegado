import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing, typography, borderRadius } from '../../constants';
import { Button, Input } from '../../components/ui';
import { Header } from '../../components/layout';
import { useAuth } from '../../contexts/AuthContext';
import { createCarta } from '../../services/firestore';
import { useStorage } from '../../hooks';

const MAX_CHARACTERS = 5000;

export default function CrearTextoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { saveDraft } = useStorage();

  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const charactersLeft = MAX_CHARACTERS - contenido.length;

  const handleSaveDraft = async () => {
    if (!titulo.trim()) {
      Alert.alert('Error', 'Agrega un título a tu carta');
      return;
    }

    try {
      await saveDraft({
        id: `draft_${Date.now()}`,
        titulo: titulo.trim(),
        tipo: 'texto',
        contenido: { texto: contenido },
        guardianes: [],
        lastModified: new Date().toISOString(),
      });

      Alert.alert('Borrador guardado', 'Tu carta se ha guardado como borrador');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el borrador');
    }
  };

  const handleContinue = async () => {
    if (!titulo.trim()) {
      Alert.alert('Error', 'Agrega un título a tu carta');
      return;
    }

    if (!contenido.trim()) {
      Alert.alert('Error', 'Escribe algo en tu carta');
      return;
    }

    if (!user) return;

    setIsSaving(true);
    try {
      const carta = await createCarta(user.uid, {
        titulo: titulo.trim(),
        tipo: 'texto',
        contenido: { texto: contenido.trim() },
      });

      Alert.alert(
        'Carta creada',
        'Tu carta ha sido creada como borrador. Puedes editarla y asignar guardianes más tarde.',
        [
          {
            text: 'Ver carta',
            onPress: () => router.replace(`/(tabs)/cartas/${carta.id}`),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo crear la carta');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title="Carta de texto"
        showBack
        rightContent={
          <Button
            title="Borrador"
            onPress={handleSaveDraft}
            variant="ghost"
            size="sm"
          />
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Título de la carta"
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ej: Para mi hijo en su graduación"
          maxLength={100}
        />

        <View style={styles.textAreaContainer}>
          <Text style={styles.label}>Contenido</Text>
          <TextInput
            style={styles.textArea}
            value={contenido}
            onChangeText={setContenido}
            placeholder="Escribe tu mensaje aquí..."
            placeholderTextColor={Colors.textMuted}
            multiline
            textAlignVertical="top"
            maxLength={MAX_CHARACTERS}
          />
          <Text style={styles.characterCount}>
            {charactersLeft} caracteres restantes
          </Text>
        </View>

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>Consejos para tu carta:</Text>
          <Text style={styles.tipItem}>• Sé auténtico y habla desde el corazón</Text>
          <Text style={styles.tipItem}>• Incluye recuerdos especiales</Text>
          <Text style={styles.tipItem}>• Comparte tus deseos y consejos</Text>
          <Text style={styles.tipItem}>• Expresa tu amor de forma clara</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          title="Crear carta"
          onPress={handleContinue}
          loading={isSaving}
          fullWidth
          disabled={!titulo.trim() || !contenido.trim()}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  textAreaContainer: {
    marginBottom: spacing.lg,
  },
  textArea: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    fontSize: 16,
    padding: spacing.md,
    minHeight: 200,
    maxHeight: 400,
  },
  characterCount: {
    ...typography.caption,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  tips: {
    backgroundColor: Colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  tipsTitle: {
    ...typography.bodySm,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  tipItem: {
    ...typography.bodySm,
    color: Colors.textSecondary,
    marginBottom: spacing.xs,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing } from '../../../constants';
import { Button, Input, Card, Badge, Avatar } from '../../../components/ui';
import { Header } from '../../../components/layout';
import { VideoPlayer } from '../../../components/media';
import { useAuth } from '../../../contexts/AuthContext';
import { getCarta, updateCarta, getGuardian, getUserGuardianes } from '../../../services/firestore';
import type { Carta, Guardian, TipoCarta, UpdateCartaData } from '../../../types';

const MAX_CHARACTERS = 5000;

export default function EditarCartaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [carta, setCarta] = useState<Carta | null>(null);
  const [titulo, setTitulo] = useState('');
  const [contenidoTexto, setContenidoTexto] = useState('');
  const [guardianesSeleccionados, setGuardianesSeleccionados] = useState<string[]>([]);
  const [todosGuardianes, setTodosGuardianes] = useState<Guardian[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const charactersLeft = MAX_CHARACTERS - contenidoTexto.length;

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id || !user) return;

    try {
      const [cartaData, guardianesData] = await Promise.all([
        getCarta(id),
        getUserGuardianes(user.uid),
      ]);

      if (cartaData) {
        setCarta(cartaData);
        setTitulo(cartaData.titulo);
        setContenidoTexto(cartaData.contenido.texto || '');
        setGuardianesSeleccionados(cartaData.guardianes);
      }

      setTodosGuardianes(guardianesData);
    } catch (error) {
      console.error('Error loading carta:', error);
      Alert.alert('Error', 'No se pudo cargar la carta');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleGuardian = (guardianId: string) => {
    setGuardianesSeleccionados((prev) =>
      prev.includes(guardianId)
        ? prev.filter((id) => id !== guardianId)
        : [...prev, guardianId]
    );
  };

  const handleSave = async () => {
    if (!titulo.trim()) {
      Alert.alert('Error', 'El título no puede estar vacío');
      return;
    }

    if (!id || !carta) return;

    setIsSaving(true);
    try {
      const updateData: UpdateCartaData = {
        titulo: titulo.trim(),
        contenido: {
          ...carta.contenido,
          texto: contenidoTexto.trim() || undefined,
        },
        guardianes: guardianesSeleccionados,
      };

      await updateCarta(id, updateData);

      Alert.alert(
        'Carta actualizada',
        'Los cambios han sido guardados exitosamente.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      console.error('Error actualizando carta:', error);
      Alert.alert('Error', error.message || 'No se pudo actualizar la carta');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Editar Carta" showBack />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingEmoji}>💓</Text>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </View>
    );
  }

  if (!carta) {
    return (
      <View style={styles.container}>
        <Header title="Error" showBack />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingEmoji}>⚠️</Text>
          <Text style={styles.loadingText}>Carta no encontrada</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title="Editar Carta" showBack />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Tipo de carta (solo lectura) */}
        <View style={styles.tipoSection}>
          <Text style={styles.label}>Tipo de carta</Text>
          <Badge
            label={carta.tipo.charAt(0).toUpperCase() + carta.tipo.slice(1)}
            variant="primary"
            size="md"
          />
        </View>

        {/* Título */}
        <Input
          label="Título de la carta"
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ej: Para mi hijo en su graduación"
          maxLength={100}
        />

        {/* Contenido de texto */}
        <View style={styles.textAreaContainer}>
          <Text style={styles.label}>Mensaje de texto</Text>
          <TextInput
            style={styles.textArea}
            value={contenidoTexto}
            onChangeText={setContenidoTexto}
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

        {/* Media existente (solo lectura) */}
        {(carta.contenido.videoUrl || carta.contenido.audioUrl || (carta.contenido.imageUrls && carta.contenido.imageUrls.length > 0)) && (
          <View style={styles.mediaSection}>
            <Text style={styles.sectionTitle}>Contenido multimedia</Text>
            <Text style={styles.mediaNote}>
              Los archivos multimedia no pueden ser editados. Para cambiarlos, crea una nueva carta.
            </Text>

            {carta.contenido.videoUrl && (
              <Card padding="none" style={styles.mediaCard}>
                <VideoPlayer uri={carta.contenido.videoUrl} />
              </Card>
            )}

            {carta.contenido.audioUrl && (
              <Card style={styles.audioCard}>
                <Text style={styles.audioEmoji}>🎤</Text>
                <Text style={styles.audioText}>Mensaje de voz adjunto</Text>
              </Card>
            )}

            {carta.contenido.imageUrls && carta.contenido.imageUrls.length > 0 && (
              <View style={styles.imagesGrid}>
                {carta.contenido.imageUrls.map((url, index) => (
                  <Image
                    key={index}
                    source={{ uri: url }}
                    style={styles.image}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Guardianes */}
        <View style={styles.guardianesSection}>
          <Text style={styles.sectionTitle}>Guardianes asignados</Text>
          <Text style={styles.guardianesNote}>
            Selecciona quiénes recibirán esta carta
          </Text>

          {todosGuardianes.length > 0 ? (
            <View style={styles.guardianesList}>
              {todosGuardianes.map((guardian) => {
                const isSelected = guardianesSeleccionados.includes(guardian.id);
                return (
                  <TouchableOpacity
                    key={guardian.id}
                    style={[
                      styles.guardianItem,
                      isSelected && styles.guardianItemSelected,
                    ]}
                    onPress={() => toggleGuardian(guardian.id)}
                    activeOpacity={0.7}
                  >
                    <Avatar
                      source={guardian.photoURL}
                      name={guardian.nombre}
                      size="sm"
                    />
                    <View style={styles.guardianInfo}>
                      <Text style={[
                        styles.guardianName,
                        isSelected && styles.guardianNameSelected,
                      ]}>
                        {guardian.nombre}
                      </Text>
                      <Text style={styles.guardianRelacion}>{guardian.relacion}</Text>
                    </View>
                    <View style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}>
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <Card style={styles.emptyGuardianes}>
              <Text style={styles.emptyText}>
                No tienes guardianes registrados
              </Text>
              <Button
                title="Agregar guardian"
                onPress={() => router.push('/(tabs)/guardianes/nuevo')}
                variant="outline"
                size="sm"
              />
            </Card>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          title="Guardar Cambios"
          onPress={handleSave}
          loading={isSaving}
          fullWidth
          disabled={!titulo.trim()}
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
  tipoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    fontWeight: '400',
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  textAreaContainer: {
    marginBottom: spacing.lg,
  },
  textArea: {
    backgroundColor: Colors.surface,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    fontSize: 16,
    fontFamily: 'Nunito_300Light',
    padding: spacing.md,
    minHeight: 150,
    maxHeight: 300,
  },
  characterCount: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  mediaSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'CormorantGaramond_400Regular',
    fontWeight: '400',
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  mediaNote: {
    fontSize: 14,
    fontFamily: 'Nunito_300Light',
    color: Colors.textMuted,
    marginBottom: spacing.md,
  },
  mediaCard: {
    marginBottom: spacing.md,
  },
  audioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  audioEmoji: {
    fontSize: 24,
  },
  audioText: {
    fontSize: 16,
    fontFamily: 'Nunito_300Light',
    color: Colors.text,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 0,
  },
  guardianesSection: {
    marginBottom: spacing.lg,
  },
  guardianesNote: {
    fontSize: 14,
    fontFamily: 'Nunito_300Light',
    color: Colors.textMuted,
    marginBottom: spacing.md,
  },
  guardianesList: {
    gap: spacing.sm,
  },
  guardianItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 0,
  },
  guardianItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceAlt,
  },
  guardianInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  guardianName: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: Colors.text,
  },
  guardianNameSelected: {
    color: Colors.primary,
  },
  guardianRelacion: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textMuted,
    textTransform: 'capitalize',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  checkmark: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyGuardianes: {
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Nunito_300Light',
    color: Colors.textMuted,
    textAlign: 'center',
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

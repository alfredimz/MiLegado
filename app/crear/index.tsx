import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing } from '../../constants';

interface TipoCartaOption {
  id: 'texto' | 'audio' | 'video' | 'foto';
  title: string;
  description: string;
  emoji: string;
  route: string;
}

const TIPOS_CARTA: TipoCartaOption[] = [
  {
    id: 'texto',
    title: 'Carta de texto',
    description: 'Escribe un mensaje con tus palabras',
    emoji: '📝',
    route: '/crear/texto',
  },
  {
    id: 'audio',
    title: 'Mensaje de voz',
    description: 'Graba un audio para tus seres queridos',
    emoji: '🎤',
    route: '/crear/media?tipo=audio',
  },
  {
    id: 'video',
    title: 'Video mensaje',
    description: 'Graba un video personal',
    emoji: '🎬',
    route: '/crear/media?tipo=video',
  },
  {
    id: 'foto',
    title: 'Carta con fotos',
    description: 'Agrega fotos a tu mensaje',
    emoji: '📷',
    route: '/crear/media?tipo=foto',
  },
];

export default function CrearIndexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSelectType = (tipo: TipoCartaOption) => {
    router.push(tipo.route as any);
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva carta</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>¿Qué tipo de carta deseas crear?</Text>
        <Text style={styles.subtitle}>
          Elige el formato que mejor exprese tu mensaje
        </Text>

        <View style={styles.optionsContainer}>
          {TIPOS_CARTA.map((tipo) => (
            <TouchableOpacity
              key={tipo.id}
              style={styles.optionCard}
              onPress={() => handleSelectType(tipo)}
              activeOpacity={0.7}
            >
              <View style={styles.optionIcon}>
                <Text style={styles.optionEmoji}>{tipo.emoji}</Text>
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{tipo.title}</Text>
                <Text style={styles.optionDescription}>{tipo.description}</Text>
              </View>
              <Text style={styles.chevron}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 0, // Paradise Garden: sin border radius
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 18,
    color: Colors.text,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'CormorantGaramond_400Regular',
    fontWeight: '400',
    color: Colors.text,
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontFamily: 'CormorantGaramond_300Light',
    fontWeight: '300',
    color: Colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_300Light',
    color: Colors.textSecondary,
    marginBottom: spacing.xl,
  },
  optionsContainer: {
    gap: spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 0, // Paradise Garden: sin border radius
    borderWidth: 1,
    borderColor: Colors.border,
    padding: spacing.lg,
  },
  optionIcon: {
    width: 64,
    height: 64,
    borderRadius: 0, // Paradise Garden: sin border radius
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionEmoji: {
    fontSize: 28,
  },
  optionContent: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  optionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_400Regular',
    fontWeight: '400',
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_300Light',
    color: Colors.textSecondary,
  },
  chevron: {
    fontSize: 18,
    color: Colors.textMuted,
  },
});

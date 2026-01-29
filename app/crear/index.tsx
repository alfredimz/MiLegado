import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FileText, Mic, Video, Image, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing, typography, borderRadius } from '../../constants';
import { Header, Card } from '../../components';

interface TipoCartaOption {
  id: 'texto' | 'audio' | 'video' | 'foto';
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

const TIPOS_CARTA: TipoCartaOption[] = [
  {
    id: 'texto',
    title: 'Carta de texto',
    description: 'Escribe un mensaje con tus palabras',
    icon: <FileText size={32} color={Colors.primary} />,
    route: '/crear/texto',
  },
  {
    id: 'audio',
    title: 'Mensaje de voz',
    description: 'Graba un audio para tus seres queridos',
    icon: <Mic size={32} color={Colors.secondary} />,
    route: '/crear/media?tipo=audio',
  },
  {
    id: 'video',
    title: 'Video mensaje',
    description: 'Graba un video personal',
    icon: <Video size={32} color={Colors.error} />,
    route: '/crear/media?tipo=video',
  },
  {
    id: 'foto',
    title: 'Carta con fotos',
    description: 'Agrega fotos a tu mensaje',
    icon: <Image size={32} color={Colors.info} />,
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
          <X size={24} color={Colors.text} />
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
              <View style={styles.optionIcon}>{tipo.icon}</View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{tipo.title}</Text>
                <Text style={styles.optionDescription}>{tipo.description}</Text>
              </View>
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
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h3,
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
    ...typography.h2,
    color: Colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
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
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  optionIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContent: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  optionTitle: {
    ...typography.h3,
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  optionDescription: {
    ...typography.bodySm,
    color: Colors.textSecondary,
  },
});

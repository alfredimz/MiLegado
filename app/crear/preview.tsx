import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing, typography } from '../../constants';
import { Button } from '../../components/ui';
import { Header } from '../../components/layout';

export default function CrearPreviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Header title="Vista previa" showBack />

      <View style={styles.content}>
        <Text style={styles.title}>Vista previa de tu carta</Text>
        <Text style={styles.subtitle}>
          Esta pantalla mostraría la vista previa completa de la carta antes de guardarla.
        </Text>

        <Button
          title="Volver"
          onPress={() => router.back()}
          variant="outline"
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    minWidth: 150,
  },
});

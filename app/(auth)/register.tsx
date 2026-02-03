import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing } from '../../constants';
import { Button, Input } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signUp } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!displayName) {
      newErrors.displayName = 'El nombre es requerido';
    } else if (displayName.length < 2) {
      newErrors.displayName = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await signUp(email, password, displayName);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.tagline}>Tu legado comienza aquí</Text>
          <Text style={styles.subtitle}>
            Comienza a construir tu legado digital
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <Input
            label="Nombre completo"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Tu nombre"
            autoCapitalize="words"
            autoComplete="name"
            error={errors.displayName}
            leftIcon={<Text style={styles.inputIcon}>👤</Text>}
          />

          <Input
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            placeholder="tu@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
            leftIcon={<Text style={styles.inputIcon}>✉️</Text>}
          />

          <Input
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            autoComplete="new-password"
            error={errors.password}
            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
          />

          <Input
            label="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repite tu contraseña"
            secureTextEntry
            autoComplete="new-password"
            error={errors.confirmPassword}
            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
          />

          {/* Checkbox de terminos */}
          <TouchableOpacity
            style={styles.termsCheckbox}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.checkbox,
              acceptedTerms && styles.checkboxChecked,
            ]}>
              {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsCheckboxText}>
              Acepto los{' '}
              <Text
                style={styles.termsLink}
                onPress={() => setShowTermsModal(true)}
              >
                Términos y Condiciones
              </Text>
            </Text>
          </TouchableOpacity>
          {errors.terms && (
            <Text style={styles.termsError}>{errors.terms}</Text>
          )}

          <Button
            title="Crear cuenta"
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
            style={styles.registerButton}
            disabled={!acceptedTerms}
          />
        </View>

        {/* Login link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.loginLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>

      {/* Modal de términos */}
      <Modal
        visible={showTermsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Términos y Condiciones</Text>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSectionTitle}>1. Aceptación de los términos</Text>
              <Text style={styles.modalText}>
                Al utilizar la aplicación MiLegado, usted acepta estos términos y condiciones en su totalidad.
              </Text>

              <Text style={styles.modalSectionTitle}>2. Descripción del servicio</Text>
              <Text style={styles.modalText}>
                MiLegado es una plataforma de legado digital que permite crear mensajes para ser entregados a guardianes designados.
              </Text>

              <Text style={styles.modalSectionTitle}>3. Privacidad</Text>
              <Text style={styles.modalText}>
                Sus datos personales serán tratados conforme a nuestra Política de Privacidad. Nos comprometemos a proteger su información.
              </Text>

              <Text style={styles.modalSectionTitle}>4. El Latido</Text>
              <Text style={styles.modalText}>
                La función "El Latido" requiere confirmación periódica. Si no confirma su estado, el sistema notificará a sus guardianes.
              </Text>

              <Text style={styles.modalSectionTitle}>5. Proyecto académico</Text>
              <Text style={styles.modalText}>
                Esta aplicación ha sido desarrollada como proyecto académico para UNIR. Es un prototipo con fines educativos.
              </Text>
            </ScrollView>

            <View style={styles.modalButtons}>
              <Button
                title="Aceptar"
                onPress={() => {
                  setAcceptedTerms(true);
                  setShowTermsModal(false);
                }}
                variant="primary"
                fullWidth
              />
              <Button
                title="Cerrar"
                onPress={() => setShowTermsModal(false)}
                variant="ghost"
                fullWidth
              />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    marginBottom: spacing.md,
    marginLeft: -spacing.xs,
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: Colors.text,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontFamily: 'CormorantGaramond_300Light',
    fontWeight: '300',
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: 18,
    fontFamily: 'DancingScript_400Regular',
    color: Colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_300Light',
    color: Colors.textSecondary,
  },
  form: {
    marginBottom: spacing.lg,
  },
  inputIcon: {
    fontSize: 18,
  },
  registerButton: {
    marginTop: spacing.md,
  },
  termsCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  checkboxChecked: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  checkmark: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsCheckboxText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito_300Light',
    color: Colors.textSecondary,
  },
  termsLink: {
    color: Colors.primary,
    fontFamily: 'Nunito_400Regular',
  },
  termsError: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: Colors.error,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'Nunito_300Light',
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: Colors.primary,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.background,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'CormorantGaramond_400Regular',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  modalScroll: {
    maxHeight: 300,
    marginBottom: spacing.md,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: Colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  modalText: {
    fontSize: 14,
    fontFamily: 'Nunito_300Light',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  modalButtons: {
    gap: spacing.sm,
  },
});

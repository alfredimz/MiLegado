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
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing } from '../../constants';
import { Button, Input } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';

// Generar código de 6 dígitos para verificación dummy
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

type RecoveryStep = 'email' | 'code' | 'newPassword' | 'success';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Estados para recuperación de contraseña (dummy)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<RecoveryStep>('email');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [tempPassword, setTempPassword] = useState('');

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await signIn(email, password);
      // El login siempre funciona en modo demo
    } catch (error: any) {
      // Este catch no debería ejecutarse en modo demo
      Alert.alert('Error', error.message || 'No se pudo iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir modal de recuperación
  const handleForgotPassword = () => {
    setRecoveryEmail(email); // Pre-llenar con el email del login si existe
    setRecoveryStep('email');
    setRecoveryError('');
    setInputCode('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowRecoveryModal(true);
  };

  // Paso 1: Enviar código (dummy - muestra el código directamente)
  const handleSendCode = () => {
    if (!recoveryEmail || !/\S+@\S+\.\S+/.test(recoveryEmail)) {
      setRecoveryError('Ingresa un correo electrónico válido');
      return;
    }

    // Generar código y mostrarlo (simulación para demo escolar)
    const code = generateCode();
    setGeneratedCode(code);
    setRecoveryError('');
    setRecoveryStep('code');

    // Mostrar el código directamente (demo)
    Alert.alert(
      '📧 Código de verificación',
      `Tu código es: ${code}\n\n(Este es un flujo de demostración para proyecto escolar)`,
      [{ text: 'Entendido' }]
    );
  };

  // Paso 2: Verificar código
  const handleVerifyCode = () => {
    if (inputCode !== generatedCode) {
      setRecoveryError('El código ingresado es incorrecto');
      return;
    }

    setRecoveryError('');
    setRecoveryStep('newPassword');
  };

  // Paso 3: Establecer nueva contraseña (dummy - guarda para auto-fill)
  const handleChangePassword = () => {
    if (newPassword.length < 6) {
      setRecoveryError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setRecoveryError('Las contraseñas no coinciden');
      return;
    }

    // Guardar la nueva contraseña para auto-fill después
    setTempPassword(newPassword);
    setRecoveryError('');
    setRecoveryStep('success');
  };

  // Cerrar modal y auto-llenar credenciales
  const closeRecoveryModal = (autoFill: boolean = false) => {
    if (autoFill && recoveryEmail && tempPassword) {
      setEmail(recoveryEmail);
      setPassword(tempPassword);
    }
    setShowRecoveryModal(false);
    setRecoveryStep('email');
    setRecoveryEmail('');
    setGeneratedCode('');
    setInputCode('');
    setNewPassword('');
    setConfirmNewPassword('');
    setRecoveryError('');
  };

  // Renderizar contenido del modal según el paso
  const renderRecoveryContent = () => {
    switch (recoveryStep) {
      case 'email':
        return (
          <>
            <Text style={styles.modalTitle}>Recuperar contraseña</Text>
            <Text style={styles.modalSubtitle}>
              Ingresa tu correo electrónico para recibir un código de verificación.
            </Text>

            <Input
              label="Correo electrónico"
              value={recoveryEmail}
              onChangeText={setRecoveryEmail}
              placeholder="tu@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Text style={styles.inputIcon}>✉️</Text>}
            />

            {recoveryError ? (
              <Text style={styles.errorText}>{recoveryError}</Text>
            ) : null}

            <View style={styles.modalButtons}>
              <Button
                title="Enviar código"
                onPress={handleSendCode}
                variant="primary"
                fullWidth
              />
              <Button
                title="Cancelar"
                onPress={() => closeRecoveryModal(false)}
                variant="ghost"
                fullWidth
              />
            </View>
          </>
        );

      case 'code':
        return (
          <>
            <Text style={styles.modalTitle}>Verificar código</Text>
            <Text style={styles.modalSubtitle}>
              Ingresa el código de 6 dígitos que se mostró en la alerta.
            </Text>

            <Input
              label="Código de verificación"
              value={inputCode}
              onChangeText={setInputCode}
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              leftIcon={<Text style={styles.inputIcon}>🔢</Text>}
            />

            {recoveryError ? (
              <Text style={styles.errorText}>{recoveryError}</Text>
            ) : null}

            <View style={styles.modalButtons}>
              <Button
                title="Verificar"
                onPress={handleVerifyCode}
                variant="primary"
                fullWidth
              />
              <Button
                title="Reenviar código"
                onPress={handleSendCode}
                variant="outline"
                fullWidth
              />
              <Button
                title="Cancelar"
                onPress={() => closeRecoveryModal(false)}
                variant="ghost"
                fullWidth
              />
            </View>
          </>
        );

      case 'newPassword':
        return (
          <>
            <Text style={styles.modalTitle}>Nueva contraseña</Text>
            <Text style={styles.modalSubtitle}>
              Crea una nueva contraseña para tu cuenta.
            </Text>

            <Input
              label="Nueva contraseña"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
            />

            <Input
              label="Confirmar contraseña"
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              placeholder="Repite la contraseña"
              secureTextEntry
              leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
            />

            {recoveryError ? (
              <Text style={styles.errorText}>{recoveryError}</Text>
            ) : null}

            <View style={styles.modalButtons}>
              <Button
                title="Cambiar contraseña"
                onPress={handleChangePassword}
                variant="primary"
                fullWidth
              />
              <Button
                title="Cancelar"
                onPress={() => closeRecoveryModal(false)}
                variant="ghost"
                fullWidth
              />
            </View>
          </>
        );

      case 'success':
        return (
          <>
            <View style={styles.successContainer}>
              <Text style={styles.successEmoji}>✅</Text>
              <Text style={styles.modalTitle}>¡Verificación completada!</Text>
              <Text style={styles.modalSubtitle}>
                El proceso de verificación fue exitoso.{'\n\n'}
                Tu correo y contraseña se autocompletarán para que puedas iniciar sesión.
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="Iniciar sesión"
                onPress={() => closeRecoveryModal(true)}
                variant="primary"
                fullWidth
              />
            </View>
          </>
        );
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
          { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo y título */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>💓</Text>
          </View>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.tagline}>Tu legado, tu historia</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
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
            placeholder="Tu contraseña"
            secureTextEntry
            autoComplete="password"
            error={errors.password}
            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
          />

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          <Button
            title="Iniciar sesión"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            style={styles.loginButton}
          />
        </View>

        {/* Registro */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={styles.registerLink}>Regístrate</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>

      {/* Modal de recuperación de contraseña */}
      <Modal
        visible={showRecoveryModal}
        transparent
        animationType="fade"
        onRequestClose={closeRecoveryModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {renderRecoveryContent()}
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
  header: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 0, // Paradise Garden: sin border radius
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoEmoji: {
    fontSize: 40,
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
    marginBottom: spacing.xl,
  },
  inputIcon: {
    fontSize: 18,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: Colors.primary,
  },
  loginButton: {
    marginTop: spacing.md,
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
  registerLink: {
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
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'CormorantGaramond_400Regular',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_300Light',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  modalButtons: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: Colors.error,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  successEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
});

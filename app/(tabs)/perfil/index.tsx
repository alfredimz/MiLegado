import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, spacing } from '../../../constants';
import { Card, Avatar, Badge, Button } from '../../../components/ui';
import { Header } from '../../../components/layout';
import { useAuth } from '../../../contexts/AuthContext';
import { useBattery } from '../../../hooks';

const LATIDO_INTERVALS = [
  { label: '7 días', value: 7 },
  { label: '14 días', value: 14 },
  { label: '30 días', value: 30 },
  { label: '60 días', value: 60 },
  { label: '90 días', value: 90 },
];

const LATIDO_KEY = '@milegado_latido_interval';
const LATIDO_LAST_KEY = '@milegado_latido_last';

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightContent?: React.ReactNode;
}

function SettingItem({ icon, title, subtitle, onPress, rightContent }: SettingItemProps) {
  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingIcon}>
        <Text style={styles.settingEmoji}>{icon}</Text>
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightContent || (onPress && <Text style={styles.chevron}>→</Text>)}
    </TouchableOpacity>
  );
}

export default function PerfilScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { percentage, isCharging } = useBattery();

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.settings.notificationsEnabled ?? true
  );
  const [latidoInterval, setLatidoInterval] = useState(30);
  const [lastLatido, setLastLatido] = useState<Date | null>(null);
  const [showLatidoModal, setShowLatidoModal] = useState(false);

  useEffect(() => {
    loadLatidoSettings();
  }, []);

  const loadLatidoSettings = async () => {
    try {
      const interval = await AsyncStorage.getItem(LATIDO_KEY);
      const last = await AsyncStorage.getItem(LATIDO_LAST_KEY);
      if (interval) setLatidoInterval(parseInt(interval));
      if (last) setLastLatido(new Date(last));
    } catch (e) {
      console.log('Error loading latido settings:', e);
    }
  };

  const saveLatidoInterval = async (value: number) => {
    try {
      await AsyncStorage.setItem(LATIDO_KEY, value.toString());
      setLatidoInterval(value);
      setShowLatidoModal(false);
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar la configuración');
    }
  };

  const confirmLatido = async () => {
    try {
      const now = new Date();
      await AsyncStorage.setItem(LATIDO_LAST_KEY, now.toISOString());
      setLastLatido(now);
      Alert.alert(
        '💓 Latido confirmado',
        'Tu pulso de vida ha sido registrado. Tus guardianes saben que estás bien.'
      );
    } catch (e) {
      Alert.alert('Error', 'No se pudo registrar el latido');
    }
  };

  const getLatidoStatus = () => {
    if (!lastLatido) return { status: 'pending', text: 'Sin confirmar' };
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastLatido.getTime()) / (1000 * 60 * 60 * 24));
    const remaining = latidoInterval - diff;

    if (remaining > 7) return { status: 'ok', text: `${remaining} días restantes` };
    if (remaining > 0) return { status: 'warning', text: `${remaining} días restantes` };
    return { status: 'danger', text: 'Vencido - Confirma tu latido' };
  };

  const latidoStatus = getLatidoStatus();

  const handleSignOut = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar la sesión');
            }
          },
        },
      ]
    );
  };

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
  };

  const getBatteryEmoji = () => {
    if (isCharging) return '🔌';
    if (percentage > 80) return '🔋';
    if (percentage > 20) return '🔋';
    return '🪫';
  };

  return (
    <View style={styles.container}>
      <Header title="Perfil" />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Perfil del usuario */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar
              source={user?.photoURL}
              name={user?.displayName}
              size="xl"
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.displayName}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <Badge
                label={user?.plan === 'premium' ? '✨ Premium' : 'Gratis'}
                variant={user?.plan === 'premium' ? 'primary' : 'secondary'}
                size="sm"
              />
            </View>
          </View>
        </Card>

        {/* Estado de batería */}
        <Text style={styles.sectionTitle}>Dispositivo</Text>
        <Card style={styles.settingsCard}>
          <SettingItem
            icon={getBatteryEmoji()}
            title="Batería"
            subtitle={`${percentage}%${isCharging ? ' - Cargando' : ''}`}
          />
        </Card>

        {/* El Latido */}
        <Text style={styles.sectionTitle}>El Latido</Text>
        <Card style={styles.latidoCard}>
          <View style={styles.latidoHeader}>
            <Text style={styles.latidoEmoji}>💓</Text>
            <View style={styles.latidoInfo}>
              <Text style={styles.latidoTitle}>Pulso de vida</Text>
              <Text style={[
                styles.latidoStatus,
                latidoStatus.status === 'ok' && styles.latidoStatusOk,
                latidoStatus.status === 'warning' && styles.latidoStatusWarning,
                latidoStatus.status === 'danger' && styles.latidoStatusDanger,
              ]}>
                {latidoStatus.text}
              </Text>
            </View>
          </View>
          <Text style={styles.latidoDescription}>
            El Latido es tu señal de vida. Confírmalo periódicamente para que tus guardianes sepan que estás bien.
          </Text>
          <Button
            title="Confirmar mi latido"
            onPress={confirmLatido}
            variant="primary"
            fullWidth
          />
        </Card>

        {/* Configuración de cuenta */}
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <Card style={styles.settingsCard}>
          <SettingItem
            icon="👤"
            title="Editar perfil"
            onPress={() => router.push('/perfil/editar')}
          />
        </Card>

        {/* Preferencias */}
        <Text style={styles.sectionTitle}>Preferencias</Text>
        <Card style={styles.settingsCard}>
          <SettingItem
            icon="🔔"
            title="Notificaciones"
            rightContent={
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.surface}
              />
            }
          />
          <View style={styles.divider} />
          <SettingItem
            icon="⚙️"
            title="Intervalo de latido"
            subtitle={`Cada ${latidoInterval} días`}
            onPress={() => setShowLatidoModal(true)}
          />
        </Card>

        {/* Soporte */}
        <Text style={styles.sectionTitle}>Soporte</Text>
        <Card style={styles.settingsCard}>
          <SettingItem
            icon="📱"
            title="Características del app"
            subtitle="Funcionalidades implementadas"
            onPress={() => router.push('/perfil/caracteristicas')}
          />
        </Card>

        {/* Cerrar sesión */}
        <Card style={styles.logoutCard}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <Text style={styles.logoutEmoji}>🚪</Text>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </Card>

        {/* Versión */}
        <Text style={styles.versionText}>MiLegado v1.0.0</Text>
        <Text style={styles.copyrightText}>
          Proyecto académico UNIR 2025
        </Text>
      </ScrollView>

      {/* Modal de configuración de latido */}
      <Modal
        visible={showLatidoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLatidoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Intervalo de latido</Text>
            <Text style={styles.modalSubtitle}>
              ¿Cada cuántos días quieres confirmar tu latido?
            </Text>

            {LATIDO_INTERVALS.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.intervalOption,
                  latidoInterval === item.value && styles.intervalOptionSelected,
                ]}
                onPress={() => saveLatidoInterval(item.value)}
              >
                <Text style={[
                  styles.intervalText,
                  latidoInterval === item.value && styles.intervalTextSelected,
                ]}>
                  {item.label}
                </Text>
                {latidoInterval === item.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}

            <Button
              title="Cancelar"
              onPress={() => setShowLatidoModal(false)}
              variant="ghost"
              fullWidth
            />
          </View>
        </View>
      </Modal>
    </View>
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
  profileCard: {
    marginBottom: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'CormorantGaramond_300Light',
    fontWeight: '300',
    color: Colors.text,
  },
  profileEmail: {
    fontSize: 16,
    fontFamily: 'Nunito_300Light',
    color: Colors.textSecondary,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  settingsCard: {
    marginBottom: spacing.lg,
    padding: 0,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 0, // Paradise Garden: sin border radius
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingEmoji: {
    fontSize: 18,
  },
  settingContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: Colors.text,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_300Light',
    color: Colors.textMuted,
    marginTop: 2,
  },
  chevron: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: spacing.md + 40,
  },
  logoutCard: {
    marginBottom: spacing.lg,
    padding: 0,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  logoutEmoji: {
    fontSize: 18,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: Colors.error,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Nunito_300Light',
    color: Colors.textMuted,
    textAlign: 'center',
  },
  copyrightText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  // Latido styles
  latidoCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  latidoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  latidoEmoji: {
    fontSize: 40,
  },
  latidoInfo: {
    marginLeft: spacing.md,
  },
  latidoTitle: {
    fontSize: 20,
    fontFamily: 'CormorantGaramond_400Regular',
    color: Colors.text,
  },
  latidoStatus: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  latidoStatusOk: {
    color: Colors.success,
  },
  latidoStatusWarning: {
    color: Colors.warning,
  },
  latidoStatusDanger: {
    color: Colors.error,
  },
  latidoDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_300Light',
    color: Colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
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
  },
  intervalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: spacing.sm,
    backgroundColor: Colors.surface,
  },
  intervalOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceAlt,
  },
  intervalText: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: Colors.text,
  },
  intervalTextSelected: {
    color: Colors.primary,
  },
  checkmark: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

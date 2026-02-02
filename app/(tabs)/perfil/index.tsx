import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing } from '../../../constants';
import { Card, Avatar, Badge } from '../../../components/ui';
import { Header } from '../../../components/layout';
import { useAuth } from '../../../contexts/AuthContext';
import { useBattery } from '../../../hooks';

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

        {/* Configuración de cuenta */}
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <Card style={styles.settingsCard}>
          <SettingItem
            icon="👤"
            title="Editar perfil"
            onPress={() => router.push('/perfil/editar')}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="🔒"
            title="Seguridad"
            subtitle="Contraseña y autenticación"
            onPress={() => { }}
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
            subtitle="Cada 30 días"
            onPress={() => { }}
          />
        </Card>

        {/* Soporte */}
        <Text style={styles.sectionTitle}>Soporte</Text>
        <Card style={styles.settingsCard}>
          <SettingItem
            icon="❓"
            title="Centro de ayuda"
            onPress={() => { }}
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
});

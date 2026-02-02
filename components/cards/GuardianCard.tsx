import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, spacing } from '../../constants';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import type { Guardian } from '../../types';

export interface GuardianCardProps {
  guardian: Guardian;
  onPress: () => void;
  onOptionsPress?: () => void;
  cartasAsignadas?: number;
}

export function GuardianCard({
  guardian,
  onPress,
  onOptionsPress,
  cartasAsignadas = 0,
}: GuardianCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Avatar
          source={guardian.photoURL}
          name={guardian.nombre}
          size="md"
        />

        <View style={styles.headerContent}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {guardian.nombre}
            </Text>
            {guardian.isVerified && (
              <Text style={styles.verifiedIcon}>✓</Text>
            )}
          </View>
          <Text style={styles.relacion}>{guardian.relacion}</Text>
        </View>

        {onOptionsPress && (
          <TouchableOpacity
            style={styles.optionsButton}
            onPress={onOptionsPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.moreIcon}>⋮</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.contactInfo}>
        <View style={styles.contactItem}>
          <Text style={styles.contactIcon}>✉️</Text>
          <Text style={styles.contactText} numberOfLines={1}>
            {guardian.email}
          </Text>
        </View>

        {guardian.telefono && (
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>📱</Text>
            <Text style={styles.contactText}>{guardian.telefono}</Text>
          </View>
        )}
      </View>

      {cartasAsignadas > 0 && (
        <View style={styles.footer}>
          <Badge
            label={`📚 ${cartasAsignadas} carta${cartasAsignadas > 1 ? 's' : ''}`}
            variant="primary"
            size="sm"
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 0, // Paradise Garden: sin border radius
    borderWidth: 1,
    borderColor: Colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    fontWeight: '400',
    color: Colors.text,
    flex: 1,
  },
  verifiedIcon: {
    fontSize: 14,
    color: Colors.success,
  },
  relacion: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textMuted,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  optionsButton: {
    padding: spacing.xs,
  },
  moreIcon: {
    fontSize: 20,
    color: Colors.textMuted,
  },
  contactInfo: {
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  contactIcon: {
    fontSize: 14,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Nunito_300Light',
    color: Colors.textSecondary,
    flex: 1,
  },
  footer: {
    marginTop: spacing.md,
    flexDirection: 'row',
  },
});

export default GuardianCard;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Mail, Phone, MoreVertical, CheckCircle } from 'lucide-react-native';
import { Colors, spacing, borderRadius, typography } from '../../constants';
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
              <CheckCircle size={16} color={Colors.success} />
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
            <MoreVertical size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.contactInfo}>
        <View style={styles.contactItem}>
          <Mail size={14} color={Colors.textMuted} />
          <Text style={styles.contactText} numberOfLines={1}>
            {guardian.email}
          </Text>
        </View>

        {guardian.telefono && (
          <View style={styles.contactItem}>
            <Phone size={14} color={Colors.textMuted} />
            <Text style={styles.contactText}>{guardian.telefono}</Text>
          </View>
        )}
      </View>

      {cartasAsignadas > 0 && (
        <View style={styles.footer}>
          <Badge
            label={`${cartasAsignadas} carta${cartasAsignadas > 1 ? 's' : ''} asignada${cartasAsignadas > 1 ? 's' : ''}`}
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
    borderRadius: borderRadius.xl,
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
    ...typography.body,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  relacion: {
    ...typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  optionsButton: {
    padding: spacing.xs,
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
  contactText: {
    ...typography.bodySm,
    color: Colors.textSecondary,
    flex: 1,
  },
  footer: {
    marginTop: spacing.md,
    flexDirection: 'row',
  },
});

export default GuardianCard;

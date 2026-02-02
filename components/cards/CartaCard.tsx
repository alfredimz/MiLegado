import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, spacing } from '../../constants';
import { Badge } from '../ui/Badge';
import type { Carta, TipoCarta, EstadoCarta } from '../../types';

export interface CartaCardProps {
  carta: Carta;
  onPress: () => void;
  onOptionsPress?: () => void;
}

// Emojis para cada tipo
const TIPO_EMOJIS: Record<TipoCarta, string> = {
  texto: '📝',
  audio: '🎤',
  video: '🎬',
  mixta: '📷',
};

const TIPO_LABELS: Record<TipoCarta, string> = {
  texto: 'Texto',
  audio: 'Audio',
  video: 'Video',
  mixta: 'Mixta',
};

const ESTADO_VARIANTS: Record<EstadoCarta, 'warning' | 'success' | 'info'> = {
  borrador: 'warning',
  activa: 'success',
  entregada: 'info',
};

const ESTADO_LABELS: Record<EstadoCarta, string> = {
  borrador: 'Borrador',
  activa: 'Activa',
  entregada: 'Entregada',
};

// Emojis para estados
const ESTADO_EMOJIS: Record<EstadoCarta, string> = {
  borrador: '📋',
  activa: '✨',
  entregada: '✓',
};

export function CartaCard({ carta, onPress, onOptionsPress }: CartaCardProps) {
  const formattedDate = new Date(carta.updatedAt).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.emoji}>{TIPO_EMOJIS[carta.tipo]}</Text>
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={1}>
            {carta.titulo}
          </Text>
          <Text style={styles.date}>{formattedDate}</Text>
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

      <View style={styles.footer}>
        <View style={styles.badges}>
          <Badge
            label={TIPO_LABELS[carta.tipo]}
            variant="primary"
            size="sm"
          />
          <Badge
            label={`${ESTADO_EMOJIS[carta.estado]} ${ESTADO_LABELS[carta.estado]}`}
            variant={ESTADO_VARIANTS[carta.estado]}
            size="sm"
          />
        </View>

        {carta.guardianes.length > 0 && (
          <Text style={styles.guardianes}>
            👥 {carta.guardianes.length}
          </Text>
        )}
      </View>
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
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 0, // Paradise Garden: sin border radius
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 20,
  },
  headerContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    fontWeight: '400',
    color: Colors.text,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textMuted,
    marginTop: 2,
  },
  optionsButton: {
    padding: spacing.xs,
  },
  moreIcon: {
    fontSize: 20,
    color: Colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  guardianes: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textSecondary,
  },
});

export default CartaCard;

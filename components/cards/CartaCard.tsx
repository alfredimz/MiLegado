import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FileText, Mic, Video, Image as ImageIcon, MoreVertical } from 'lucide-react-native';
import { Colors, spacing, borderRadius, typography } from '../../constants';
import { Badge } from '../ui/Badge';
import type { Carta, TipoCarta, EstadoCarta } from '../../types';

export interface CartaCardProps {
  carta: Carta;
  onPress: () => void;
  onOptionsPress?: () => void;
}

const TIPO_ICONS: Record<TipoCarta, React.ReactNode> = {
  texto: <FileText size={20} color={Colors.primary} />,
  audio: <Mic size={20} color={Colors.secondary} />,
  video: <Video size={20} color={Colors.error} />,
  mixta: <ImageIcon size={20} color={Colors.info} />,
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
        <View style={styles.iconContainer}>{TIPO_ICONS[carta.tipo]}</View>

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
            <MoreVertical size={20} color={Colors.textMuted} />
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
            label={ESTADO_LABELS[carta.estado]}
            variant={ESTADO_VARIANTS[carta.estado]}
            size="sm"
          />
        </View>

        {carta.guardianes.length > 0 && (
          <Text style={styles.guardianes}>
            {carta.guardianes.length} guardián{carta.guardianes.length > 1 ? 'es' : ''}
          </Text>
        )}
      </View>
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
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: Colors.text,
  },
  date: {
    ...typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  optionsButton: {
    padding: spacing.xs,
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
    ...typography.caption,
    color: Colors.textSecondary,
  },
});

export default CartaCard;

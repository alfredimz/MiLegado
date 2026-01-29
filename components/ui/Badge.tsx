import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, spacing, borderRadius } from '../../constants';

export interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({
  label,
  variant = 'primary',
  size = 'md',
  style,
}: BadgeProps) {
  return (
    <View style={[styles.base, styles[variant], styles[`size_${size}`], style]}>
      <Text style={[styles.text, styles[`text_${variant}`], styles[`textSize_${size}`]]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
  },

  // Variantes
  primary: {
    backgroundColor: `${Colors.primary}20`,
  },
  secondary: {
    backgroundColor: `${Colors.secondary}20`,
  },
  success: {
    backgroundColor: `${Colors.success}20`,
  },
  warning: {
    backgroundColor: `${Colors.warning}20`,
  },
  error: {
    backgroundColor: `${Colors.error}20`,
  },
  info: {
    backgroundColor: `${Colors.info}20`,
  },

  // Tamaños
  size_sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  size_md: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },

  // Texto
  text: {
    fontWeight: '500',
  },
  text_primary: {
    color: Colors.primary,
  },
  text_secondary: {
    color: Colors.secondary,
  },
  text_success: {
    color: Colors.success,
  },
  text_warning: {
    color: Colors.warning,
  },
  text_error: {
    color: Colors.error,
  },
  text_info: {
    color: Colors.info,
  },

  // Tamaños de texto
  textSize_sm: {
    fontSize: 10,
  },
  textSize_md: {
    fontSize: 12,
  },
});

export default Badge;

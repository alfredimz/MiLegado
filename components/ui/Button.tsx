import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, spacing } from '../../constants';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'blush' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
    isDisabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <Text style={textStyles}>💓</Text>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <React.Fragment>{icon}</React.Fragment>
          )}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <React.Fragment>{icon}</React.Fragment>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0, // Paradise Garden: sin border radius
    gap: spacing.sm,
    borderWidth: 1,
    backgroundColor: 'transparent', // Outline por defecto
  },

  // Variantes - Todos son outline
  primary: {
    borderColor: Colors.primary,
  },
  secondary: {
    borderColor: Colors.secondary,
  },
  blush: {
    borderColor: Colors.blush,
  },
  ghost: {
    borderColor: Colors.border,
  },
  danger: {
    borderColor: Colors.error,
  },
  outline: {
    borderColor: Colors.primary,
  },

  // Tamaños
  size_sm: {
    height: 40,
    paddingHorizontal: spacing.md,
  },
  size_md: {
    height: 48,
    paddingHorizontal: spacing.lg,
  },
  size_lg: {
    height: 56,
    paddingHorizontal: spacing.xl,
  },

  // Estados
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },

  // Texto
  text: {
    fontFamily: 'Nunito_400Regular',
    fontWeight: '400',
  },
  text_primary: {
    color: Colors.primary,
  },
  text_secondary: {
    color: Colors.secondary,
  },
  text_blush: {
    color: Colors.blushDark,
  },
  text_ghost: {
    color: Colors.textSecondary,
  },
  text_danger: {
    color: Colors.error,
  },
  text_outline: {
    color: Colors.primary,
  },
  textSize_sm: {
    fontSize: 14,
  },
  textSize_md: {
    fontSize: 16,
  },
  textSize_lg: {
    fontSize: 18,
  },
  textDisabled: {
    opacity: 0.7,
  },
});

export default Button;

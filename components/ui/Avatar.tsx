import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { User } from 'lucide-react-native';
import { Colors, borderRadius } from '../../constants';

export interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}

const SIZES = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

const FONT_SIZES = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 36,
};

export function Avatar({ source, name, size = 'md', style }: AvatarProps) {
  const dimensions = SIZES[size];
  const fontSize = FONT_SIZES[size];

  // Obtener iniciales del nombre
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  const containerStyle = [
    styles.container,
    {
      width: dimensions,
      height: dimensions,
      borderRadius: dimensions / 2,
    },
    style,
  ];

  // Si hay imagen
  if (source) {
    return (
      <View style={containerStyle}>
        <Image
          source={{ uri: source }}
          style={[
            styles.image,
            {
              width: dimensions,
              height: dimensions,
              borderRadius: dimensions / 2,
            },
          ]}
        />
      </View>
    );
  }

  // Si hay nombre, mostrar iniciales
  if (name) {
    return (
      <View style={[containerStyle, styles.placeholder]}>
        <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
      </View>
    );
  }

  // Fallback: icono de usuario
  return (
    <View style={[containerStyle, styles.placeholder]}>
      <User size={dimensions * 0.5} color={Colors.textMuted} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: Colors.text,
    fontWeight: '600',
  },
});

export default Avatar;

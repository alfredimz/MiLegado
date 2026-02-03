import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { useFonts } from 'expo-font';
import {
  CormorantGaramond_300Light,
  CormorantGaramond_400Regular,
} from '@expo-google-fonts/cormorant-garamond';
import {
  DancingScript_400Regular,
} from '@expo-google-fonts/dancing-script';
import {
  Nunito_300Light,
  Nunito_400Regular,
} from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants';

// Prevenir que el splash screen se oculte automáticamente
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignorar si ya fue llamado */
});

// Tema personalizado Paradise Garden para React Native Paper
const customTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.primary,
    secondary: Colors.secondary,
    background: Colors.background,
    surface: Colors.surface,
    text: Colors.text,
    onSurface: Colors.text,
    onBackground: Colors.text,
    outline: Colors.border,
    error: Colors.error,
  },
  roundness: 0,
};

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('[RootLayoutNav] isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>💓</Text>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="crear"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    CormorantGaramond_300Light,
    CormorantGaramond_400Regular,
    DancingScript_400Regular,
    Nunito_300Light,
    Nunito_400Regular,
  });

  // Ocultar splash cuando las fuentes estén listas
  useEffect(() => {
    if (fontsLoaded || fontError) {
      console.log('[RootLayout] Fonts loaded:', fontsLoaded, 'Font error:', fontError);
      SplashScreen.hideAsync().catch(() => {
        /* ignorar error */
      });
    }
  }, [fontsLoaded, fontError]);

  // Mostrar pantalla de carga mientras cargan las fuentes
  if (!fontsLoaded && !fontError) {
    console.log('[RootLayout] Esperando fuentes...');
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>💓</Text>
        <Text style={styles.loadingText}>Cargando fuentes...</Text>
      </View>
    );
  }

  console.log('[RootLayout] Renderizando app principal');

  return (
    <GestureHandlerRootView style={styles.container}>
      <PaperProvider theme={customTheme}>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingEmoji: {
    fontSize: 48,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.textSecondary,
    fontSize: 16,
  },
});

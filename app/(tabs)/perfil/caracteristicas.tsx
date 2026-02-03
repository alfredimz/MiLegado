import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing } from '../../../constants';
import { Card, Badge } from '../../../components/ui';
import { Header } from '../../../components/layout';

interface FeatureItemProps {
  emoji: string;
  title: string;
  description: string;
  criteria: string;
}

function FeatureItem({ emoji, title, description, criteria }: FeatureItemProps) {
  return (
    <Card style={styles.featureCard}>
      <View style={styles.featureHeader}>
        <Text style={styles.featureEmoji}>{emoji}</Text>
        <View style={styles.featureInfo}>
          <Text style={styles.featureTitle}>{title}</Text>
          <Badge label={criteria} variant="success" size="sm" />
        </View>
      </View>
      <Text style={styles.featureDescription}>{description}</Text>
    </Card>
  );
}

export default function CaracteristicasScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Header title="Características" showBack />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          MiLegado es una aplicación de legado digital desarrollada como proyecto académico.
          A continuación se listan las características implementadas y los criterios de evaluación que cumplen.
        </Text>

        {/* Navegación */}
        <Text style={styles.sectionTitle}>Navegación (2 pts)</Text>

        <FeatureItem
          emoji="📱"
          title="Stack Navigator"
          description="Navegación basada en pila con Expo Router. Permite navegar entre pantallas con animaciones y mantener el historial de navegación."
          criteria="Stack Navigator"
        />

        <FeatureItem
          emoji="🔀"
          title="Navegación entre páginas"
          description="Flujo completo de navegación: Login > Registro > Home > Cartas > Guardianes > Perfil. Navegación con tabs y pantallas modales."
          criteria="Navegación"
        />

        <FeatureItem
          emoji="📦"
          title="Paso de parámetros"
          description="Transferencia de datos entre pantallas usando params de Expo Router. Ejemplo: ID de carta al ver detalles, datos del formulario al crear."
          criteria="Parámetros"
        />

        {/* Seguridad */}
        <Text style={styles.sectionTitle}>Seguridad (2 pts)</Text>

        <FeatureItem
          emoji="🔐"
          title="Autenticación segura"
          description="Autenticación con Firebase Auth. Soporte para registro con email/contraseña, inicio de sesión, recuperación de contraseña y cierre de sesión seguro."
          criteria="Auth seguro"
        />

        <FeatureItem
          emoji="🛡️"
          title="Protección de rutas"
          description="Sistema de rutas protegidas que verifica autenticación. Los usuarios no autenticados son redirigidos al login automáticamente."
          criteria="Rutas protegidas"
        />

        {/* Almacenamiento */}
        <Text style={styles.sectionTitle}>Almacenamiento (3 pts)</Text>

        <FeatureItem
          emoji="💾"
          title="AsyncStorage"
          description="Almacenamiento local para borradores de cartas, configuración del latido e intervalo de notificaciones. Persistencia offline de datos del usuario."
          criteria="AsyncStorage"
        />

        <FeatureItem
          emoji="☁️"
          title="Firebase Firestore"
          description="Base de datos NoSQL en la nube para almacenar cartas, guardianes y datos de usuario. Sincronización en tiempo real y persistencia permanente."
          criteria="Firebase"
        />

        <FeatureItem
          emoji="🖼️"
          title="Firebase Storage"
          description="Almacenamiento de archivos multimedia: fotos de perfil, imágenes de cartas, videos y audios. Subida mediante Base64 por limitaciones de Expo Go."
          criteria="Storage"
        />

        {/* APIs de plataforma */}
        <Text style={styles.sectionTitle}>APIs de Plataforma (3 pts)</Text>

        <FeatureItem
          emoji="🔋"
          title="Estado de batería"
          description="Uso de expo-battery para mostrar el porcentaje de batería y estado de carga del dispositivo en la pantalla de perfil."
          criteria="Battery API"
        />

        <FeatureItem
          emoji="📷"
          title="Cámara e imágenes"
          description="Integración con expo-camera y expo-image-picker. Permite tomar fotos con la cámara o seleccionar de la galería para cartas y foto de perfil."
          criteria="Camera/Images"
        />

        <FeatureItem
          emoji="🎬"
          title="Audio y video"
          description="Uso de expo-av para grabar y reproducir audio/video. Soporte para mensajes de voz y video en las cartas de legado."
          criteria="Audio/Video"
        />

        {/* Características adicionales */}
        <Text style={styles.sectionTitle}>Características adicionales</Text>

        <FeatureItem
          emoji="💓"
          title="El Latido"
          description="Sistema de 'prueba de vida'. El usuario confirma periódicamente su estado. Si no confirma, los guardianes reciben notificación."
          criteria="Feature único"
        />

        <FeatureItem
          emoji="✉️"
          title="Cartas de legado"
          description="Creación de cartas con texto, fotos, audio o video. Asignación a guardianes específicos para entrega futura."
          criteria="Core feature"
        />

        <FeatureItem
          emoji="👥"
          title="Guardianes"
          description="Gestión de contactos de confianza que recibirán las cartas. Sistema de verificación y asignación de cartas."
          criteria="Core feature"
        />

        <FeatureItem
          emoji="🎨"
          title="Diseño Paradise Garden"
          description="Sistema de diseño consistente sin border-radius, paleta de colores cálida y tipografía elegante (Cormorant Garamond + Nunito)."
          criteria="UI/UX"
        />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Desarrollado como proyecto académico
          </Text>
          <Text style={styles.footerText}>
            UNIR - Maestría en Ingeniería de Software
          </Text>
          <Text style={styles.footerText}>
            2025
          </Text>
        </View>
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
  intro: {
    fontSize: 16,
    fontFamily: 'Nunito_300Light',
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'CormorantGaramond_400Regular',
    color: Colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  featureCard: {
    marginBottom: spacing.md,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureEmoji: {
    fontSize: 32,
  },
  featureInfo: {
    flex: 1,
    marginLeft: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featureTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_400Regular',
    color: Colors.text,
    flex: 1,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_300Light',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Nunito_300Light',
    color: Colors.textMuted,
    marginBottom: spacing.xs,
  },
});

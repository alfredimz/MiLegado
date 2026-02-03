import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing } from '../../../constants';
import { Card } from '../../../components/ui';
import { Header } from '../../../components/layout';

export default function TerminosScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Header title="Términos y Condiciones" showBack />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdate}>
          Última actualización: Febrero 2025
        </Text>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>1. Aceptación de los términos</Text>
          <Text style={styles.sectionText}>
            Al utilizar la aplicación MiLegado, usted acepta estos términos y condiciones en su totalidad.
            Si no está de acuerdo con alguna parte de estos términos, no deberá utilizar la aplicación.
          </Text>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>2. Descripción del servicio</Text>
          <Text style={styles.sectionText}>
            MiLegado es una plataforma de legado digital que permite a los usuarios crear mensajes
            (cartas, audios, videos) para ser entregados a personas designadas (guardianes)
            en el futuro bajo condiciones específicas definidas por el usuario.
          </Text>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>3. Registro y cuenta</Text>
          <Text style={styles.sectionText}>
            Para utilizar MiLegado, debe registrarse proporcionando información veraz y actualizada.
            Usted es responsable de mantener la confidencialidad de su cuenta y contraseña.
            Debe notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta.
          </Text>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>4. Privacidad y datos personales</Text>
          <Text style={styles.sectionText}>
            Sus datos personales serán tratados conforme a nuestra Política de Privacidad.
            Nos comprometemos a proteger su información personal y no compartirla con terceros
            sin su consentimiento, excepto cuando sea requerido por ley.
          </Text>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>5. Contenido del usuario</Text>
          <Text style={styles.sectionText}>
            Usted es responsable del contenido que crea y almacena en MiLegado.
            No debe subir contenido ilegal, ofensivo, o que viole derechos de terceros.
            Nos reservamos el derecho de eliminar contenido que viole estos términos.
          </Text>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>6. El Latido</Text>
          <Text style={styles.sectionText}>
            La función "El Latido" requiere confirmación periódica del usuario.
            Si no confirma su estado dentro del período establecido,
            el sistema podrá notificar a los guardianes designados según la configuración del usuario.
          </Text>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>7. Guardianes</Text>
          <Text style={styles.sectionText}>
            Al designar guardianes, usted autoriza a MiLegado a compartir el contenido
            de sus cartas con dichas personas bajo las condiciones que usted establezca.
            Asegúrese de obtener el consentimiento de los guardianes antes de designarlos.
          </Text>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>8. Limitación de responsabilidad</Text>
          <Text style={styles.sectionText}>
            MiLegado se proporciona "tal cual" sin garantías de ningún tipo.
            No somos responsables por pérdida de datos, daños indirectos,
            o cualquier perjuicio derivado del uso o imposibilidad de uso de la aplicación.
          </Text>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>9. Proyecto académico</Text>
          <Text style={styles.sectionText}>
            Esta aplicación ha sido desarrollada como proyecto académico para la
            Maestría en Ingeniería de Software de UNIR.
            Se trata de un prototipo funcional con fines educativos y de demostración.
          </Text>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>10. Modificaciones</Text>
          <Text style={styles.sectionText}>
            Nos reservamos el derecho de modificar estos términos en cualquier momento.
            Los cambios serán efectivos al publicarse en la aplicación.
            El uso continuado de MiLegado constituye aceptación de los términos modificados.
          </Text>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>11. Contacto</Text>
          <Text style={styles.sectionText}>
            Para consultas sobre estos términos, puede contactarnos a través
            de los canales de soporte disponibles en la aplicación.
          </Text>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerEmoji}>📜</Text>
          <Text style={styles.footerText}>
            MiLegado - Tu legado digital seguro
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
  lastUpdate: {
    fontSize: 14,
    fontFamily: 'Nunito_300Light',
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_400Regular',
    color: Colors.text,
    marginBottom: spacing.sm,
  },
  sectionText: {
    fontSize: 14,
    fontFamily: 'Nunito_300Light',
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'CormorantGaramond_400Regular',
    color: Colors.textMuted,
  },
});

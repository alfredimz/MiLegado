import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();

  // Si no está autenticado, ir a auth
  if (!isAuthenticated) {
    // Si no ha completado onboarding, mostrar onboarding
    if (!hasCompletedOnboarding) {
      return <Redirect href="/(auth)/onboarding" />;
    }
    // Si ya completó onboarding, ir a login
    return <Redirect href="/(auth)/login" />;
  }

  // Si está autenticado, ir a tabs
  return <Redirect href="/(tabs)" />;
}

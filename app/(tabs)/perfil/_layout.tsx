import { Stack } from 'expo-router';
import { Colors } from '../../../constants';

export default function PerfilLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="editar" />
      <Stack.Screen name="caracteristicas" />
      <Stack.Screen name="terminos" />
    </Stack>
  );
}

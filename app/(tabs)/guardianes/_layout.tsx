import { Stack } from 'expo-router';
import { Colors } from '../../../constants';

export default function GuardianesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="nuevo" />
      <Stack.Screen name="editar" />
    </Stack>
  );
}

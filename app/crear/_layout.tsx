import { Stack } from 'expo-router';
import { Colors } from '../../constants';

export default function CrearLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="texto" />
      <Stack.Screen name="media" />
      <Stack.Screen name="preview" />
    </Stack>
  );
}

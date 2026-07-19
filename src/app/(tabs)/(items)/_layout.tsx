import { Stack } from 'expo-router/stack';

export default function ItemsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="item-form" />
    </Stack>
  );
}

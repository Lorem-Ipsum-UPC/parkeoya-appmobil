import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="my-cars" />
      <Stack.Screen name="add-car" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="payment-history" />
    </Stack>
  );
}

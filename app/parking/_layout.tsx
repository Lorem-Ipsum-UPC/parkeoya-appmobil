import { Stack } from 'expo-router';

export default function ParkingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="reviews" />
      <Stack.Screen name="reserve" />
      <Stack.Screen name="select-parking" />
    </Stack>
  );
}
